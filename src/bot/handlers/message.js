const { InlineKeyboard } = require('grammy');
const { analyzeVacancy } = require('../../core/engine');

async function handleVacancyMessage(ctx) {
    if (!ctx.message.text) return;
    const vacancyText = ctx.message.text;
    ctx.session.vacancy = vacancyText;

    const waitMsg = await ctx.reply('Аналізую вакансію... Зачекай хвилинку ⏳');

    try {
        const analysisResult = await analyzeVacancy(vacancyText);

        const keyboard = new InlineKeyboard()
            .text('📝 Згенерувати CV', 'generate_cv').row()
            .text('✉️ Згенерувати Cover Letter', 'generate_cl');

        await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, analysisResult, {
            reply_markup: keyboard
        });
    } catch (error) {
        console.error('Analysis error:', error);
        await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, '❌ Виникла помилка під час аналізу вакансії. Спробуй ще раз пізніше.');
    }
}

module.exports = { handleVacancyMessage };
