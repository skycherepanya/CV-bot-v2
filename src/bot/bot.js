const { Bot } = require('grammy');

function createBot() {
    if (!process.env.TELEGRAM_TOKEN) {
        throw new Error('TELEGRAM_TOKEN is required');
    }
    
    const bot = new Bot(process.env.TELEGRAM_TOKEN);
    
    bot.command('start', (ctx) => {
        ctx.reply('Привіт! Надішли мені текст вакансії, і я зроблю аналіз, чи підходить вона під мій профіль.');
    });

    return bot;
}

module.exports = { createBot };
