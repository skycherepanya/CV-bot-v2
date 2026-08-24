const test = require('node:test');
const assert = require('node:assert');
const { createBot } = require('../../src/bot/bot');

test('createBot function should return bot instance', () => {
    const oldKey = process.env.TELEGRAM_TOKEN;
    process.env.TELEGRAM_TOKEN = 'test:token';
    const bot = createBot();
    assert.ok(bot);
    process.env.TELEGRAM_TOKEN = oldKey;
});
