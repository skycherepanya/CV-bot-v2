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
    
    // Attempt to get the original vacancy from the message we replied to
    // If we can't extract it, we'll notify the user.
    // In Telegram, ctx.callbackQuery.message is the bot's own message with buttons.
    // The vacancy is ideally stored in a session, but for MVP we might not have sessions.
    // Let's assume we can get it from the session later, but for now we just use a placeholder text 
    // or tell the user to send the vacancy again if session is not used.
    
    const vacancyText = "Job Vacancy Text (Note: session state needed for real vacancy)";
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
