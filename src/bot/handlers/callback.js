const { generateContent } = require('../../ai/client');
const { getCvPlannerPrompt, getCvGeneratorPrompt, getCoverLetterPrompt } = require('../../ai/prompts');
const { readMasterProfile } = require('../../utils/fileSystem');
const { mdToPdf } = require('md-to-pdf');
const { InlineKeyboard } = require('grammy');
const { uploadFileToDrive } = require('../../google/drive');
const { appendApplicationRow } = require('../../google/sheets');

async function handleCallbackQuery(ctx) {
    const data = ctx.callbackQuery.data;
    
    if (data === 'applied') {
        await ctx.answerCallbackQuery();
        
        try {
            const company = ctx.session.lastCompany || 'Company';
            const vacancyLink = ctx.session.vacancyLink || '';
            const clLink = ctx.session.lastClLink || '';
            
            await appendApplicationRow(company, vacancyLink, clLink);
            
            const newKeyboard = new InlineKeyboard()
                .text('Додано в статистику 📊', 'noop');
            
            await ctx.editMessageReplyMarkup({ reply_markup: newKeyboard });
        } catch (err) {
            console.error('Error applying:', err);
            await ctx.reply('❌ Виникла помилка при додаванні в таблицю.');
        }
        return;
    }
    
    if (data === 'noop') {
        await ctx.answerCallbackQuery();
        return;
    }

    if (data !== 'generate_cv' && data !== 'generate_cl') return;

    await ctx.answerCallbackQuery();
    
    const vacancyText = ctx.session.vacancy;
    if (!vacancyText) {
        await ctx.reply('Текст вакансії не знайдено. Будь ласка, надішли вакансію ще раз.');
        return;
    }
    const profile = readMasterProfile();
    
    const msgText = data === 'generate_cv' 
        ? 'Генерую CV (1/2: Планування) та зберігаю на Google Drive... 📝' 
        : 'Генерую Cover Letter та зберігаю на Google Drive... ✉️';
    const waitMsg = await ctx.reply(msgText);
    
    try {
        let result = '';
        if (data === 'generate_cv') {
            // Step 1: Planner
            const plannerPrompt = getCvPlannerPrompt(profile, vacancyText);
            const planJson = await generateContent(plannerPrompt, true);
            
            await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, 'Генерую CV (2/2: Верстка) та зберігаю на Google Drive... 📝');
            
            // Step 2: Generator
            const generatorPrompt = getCvGeneratorPrompt(profile, planJson);
            result = await generateContent(generatorPrompt, false);
            // Clean up markdown block if the model included it
            result = result.replace(/^```markdown\n/, '').replace(/```$/, '');
        } else {
            const clPrompt = getCoverLetterPrompt(profile, vacancyText);
            result = await generateContent(clPrompt, false);
        }
        
        // Extract company and last name for filename
        const namePrompt = `Extract the company name from the vacancy and the candidate's last name from the profile. 
Return ONLY a string in the format: CompanyName_LastName. 
Use English letters, replace spaces with underscores, omit special characters. 
If company is not found, use "Company". Do not include any other text.

Vacancy text (start):
${vacancyText.substring(0, 1000)}

Profile text (start):
${JSON.stringify(profile).substring(0, 500)}`;

        let filePrefix = 'Company_Applicant';
        let companyName = 'Company';
        try {
            const prefixRaw = await generateContent(namePrompt, false);
            const cleaned = prefixRaw.trim().replace(/[^a-zA-Z0-9_]/g, '');
            if (cleaned.length > 0) {
                filePrefix = cleaned;
                companyName = cleaned.split('_')[0] || 'Company';
            }
        } catch (e) {
            console.error('Failed to generate filename prefix', e);
        }

        ctx.session.lastCompany = companyName;

        const finalFilename = data === 'generate_cv' ? `${filePrefix}_CV.pdf` : `${filePrefix}_CoverLetter.pdf`;

        // Convert markdown to PDF
        const pdf = await mdToPdf(
            { content: result },
            { launch_options: { executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'] } }
        );
        
        // Upload to Google Drive
        const webViewLink = await uploadFileToDrive(pdf.content, finalFilename);
        
        if (data === 'generate_cl') {
            ctx.session.lastClLink = webViewLink;
        }

        const replyKeyboard = new InlineKeyboard()
            .url('📂 Відкрити на Google Drive', webViewLink).row()
            .text('Подався ✅', 'applied');
        
        // Remove the wait message
        await ctx.api.deleteMessage(ctx.chat.id, waitMsg.message_id);
        
        const docType = data === 'generate_cv' ? 'Резюме' : 'Cover Letter';
        await ctx.reply(`✅ ${docType} успішно згенеровано та збережено на Google Drive!`, {
            reply_markup: replyKeyboard
        });
        
    } catch (err) {
        console.error('Generation error:', err);
        await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, '❌ Помилка генерації або збереження на Drive. Деталі: ' + err.message);
    }
}

module.exports = { handleCallbackQuery };
