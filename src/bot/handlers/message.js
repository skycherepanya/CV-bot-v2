const { InlineKeyboard } = require('grammy');
const { analyzeVacancy } = require('../../core/engine');
const { scrapeUrl } = require('../../utils/scraper');

const messageBuffers = new Map();
const BUFFER_TIMEOUT_MS = 1000; // 1 second debounce

async function handleVacancyMessage(ctx) {
    if (!ctx.message.text) return;
    
    const chatId = ctx.chat.id;
    const incomingText = ctx.message.text.trim();

    if (!messageBuffers.has(chatId)) {
        messageBuffers.set(chatId, {
            texts: [],
            timer: null,
            context: null
        });
    }

    const buffer = messageBuffers.get(chatId);
    buffer.texts.push(incomingText);
    buffer.context = ctx; // save the latest context

    if (buffer.timer) {
        clearTimeout(buffer.timer);
    }

    buffer.timer = setTimeout(() => {
        processBufferedVacancy(chatId);
    }, BUFFER_TIMEOUT_MS);
}

async function processBufferedVacancy(chatId) {
    const buffer = messageBuffers.get(chatId);
    if (!buffer) return;

    messageBuffers.delete(chatId);

    const ctx = buffer.context;
    let vacancyText = buffer.texts.join('\n\n').trim();
    if (!vacancyText) return;

    let waitMsg;

    // Check if the message is a URL
    if (vacancyText.startsWith('http://') || vacancyText.startsWith('https://')) {
        waitMsg = await ctx.reply('🔍 Сканую посилання... Зачекай хвилинку ⏳');
        try {
            const extractedText = await scrapeUrl(vacancyText);
            if (!extractedText || extractedText.length < 50) {
                await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, '❌ Не вдалося витягнути достатньо тексту з цього сайту (можливо, потрібна авторизація, як у LinkedIn). Будь ласка, скопіюй текст вакансії вручну.');
                return;
            }
            vacancyText = extractedText;
            await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, '✅ Текст успішно завантажено! Аналізую вакансію... ⏳');
        } catch (error) {
            console.error('Scraping error:', error);
            await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, '❌ Не вдалося прочитати сайт. Будь ласка, скопіюй текст вакансії вручну.');
            return;
        }
    } else {
        waitMsg = await ctx.reply('Аналізую вакансію... Зачекай хвилинку ⏳');
    }
    
    if (buffer.texts.length === 1 && (vacancyText.startsWith('http://') || vacancyText.startsWith('https://'))) {
        ctx.session.vacancyLink = vacancyText;
    } else {
        ctx.session.vacancyLink = '';
    }
    
    ctx.session.vacancy = vacancyText;
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
