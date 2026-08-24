const test = require('node:test');
const assert = require('node:assert');
const { generateContent } = require('../../src/ai/client');

test('generateContent function exists', () => {
    assert.strictEqual(typeof generateContent, 'function');
});

test('generateContent throws if no API key', async () => {
    const oldKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    await assert.rejects(() => generateContent('test'), /GEMINI_API_KEY is required/);
    process.env.GEMINI_API_KEY = oldKey;
});
