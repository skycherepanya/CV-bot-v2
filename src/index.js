require('dotenv').config();
const { createBot } = require('./bot/bot');

try {
    const bot = createBot();
    
    bot.catch((err) => {
        console.error('Bot Error:', err);
    });

    bot.start({
        onStart: (botInfo) => {
            console.log(`Bot started as @${botInfo.username}`);
        }
    });

    process.once('SIGINT', () => bot.stop());
    process.once('SIGTERM', () => bot.stop());
} catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
}
