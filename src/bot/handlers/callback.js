const { generateContent } = require('../../ai/client');
const { getCvPrompt, getCoverLetterPrompt } = require('../../ai/prompts');
const { readMasterProfile } = require('../../utils/fileSystem');

async function handleCallbackQuery(ctx) {
    const data = ctx.callbackQuery.data;
    const actionMap = {
        'generate_cv': {
            promptFn: getCvPrompt,
            msg: 'Генерую CV... 📝'
        },
        'generate_cl': {
            promptFn: getCoverLetterPrompt,
            msg: 'Генерую Cover Letter... ✉️'
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
        await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, result);
    } catch (err) {
        console.error('Generation error:', err);
        await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, '❌ Помилка генерації.');
    }
}

module.exports = { handleCallbackQuery };
