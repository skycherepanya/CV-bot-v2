const { Bot, session } = require('grammy');
const { handleVacancyMessage } = require('./handlers/message');
const { handleCallbackQuery } = require('./handlers/callback');

function createBot() {
    if (!process.env.TELEGRAM_TOKEN) {
        throw new Error('TELEGRAM_TOKEN is required');
    }
    
    const bot = new Bot(process.env.TELEGRAM_TOKEN);
    
    bot.use(session({ initial: () => ({ vacancy: '' }) }));
    
    bot.command('start', (ctx) => {
        ctx.reply('Привіт! Надішли мені текст вакансії, і я зроблю аналіз, чи підходить вона під мій профіль.');
    });

    bot.on('message:text', handleVacancyMessage);
    bot.on('callback_query:data', handleCallbackQuery);

    return bot;
}

module.exports = { createBot };
