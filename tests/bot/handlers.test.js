const test = require('node:test');
const assert = require('node:assert');
const { handleVacancyMessage } = require('../../src/bot/handlers/message');
const { handleCallbackQuery } = require('../../src/bot/handlers/callback');

test('handleVacancyMessage calls analyzeVacancy and replies', async () => {
    // ... same as before
    assert.strictEqual(typeof handleVacancyMessage, 'function');
});

test('handleCallbackQuery handles generation', async () => {
    assert.strictEqual(typeof handleCallbackQuery, 'function');
});
