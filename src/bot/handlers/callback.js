const { generateContent } = require('../../ai/client');
const { getCvPrompt, getCoverLetterPrompt } = require('../../ai/prompts');
const { readMasterProfile } = require('../../utils/fileSystem');
const { InputFile } = require('grammy');
const { mdToPdf } = require('md-to-pdf');

async function handleCallbackQuery(ctx) {
    const data = ctx.callbackQuery.data;
    const actionMap = {
        'generate_cv': {
            promptFn: getCvPrompt,
            msg: 'Генерую CV... 📝',
            filename: 'CV.pdf'
        },
        'generate_cl': {
            promptFn: getCoverLetterPrompt,
            msg: 'Генерую Cover Letter... ✉️',
            filename: 'CoverLetter.pdf'
        }
    };

    if (!actionMap[data]) return;

    await ctx.answerCallbackQuery();
    
    const vacancyText = ctx.session.vacancy;
    if (!vacancyText) {
        await ctx.reply('Текст вакансії не знайдено. Будь ласка, надішли вакансію ще раз.');
        return;
    }
    const profile = readMasterProfile();
    
    const waitMsg = await ctx.reply(actionMap[data].msg);
    
    try {
        const prompt = actionMap[data].promptFn(profile, vacancyText);
        const result = await generateContent(prompt);
        
        // Convert markdown to PDF
        const pdf = await mdToPdf({ content: result });
        
        // Send the PDF document
        await ctx.replyWithDocument(new InputFile(pdf.content, actionMap[data].filename));
        
        // Remove the wait message
        await ctx.api.deleteMessage(ctx.chat.id, waitMsg.message_id);
    } catch (err) {
        console.error('Generation error:', err);
        await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, '❌ Помилка генерації або створення PDF.');
    }
}

module.exports = { handleCallbackQuery };
