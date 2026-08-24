const test = require('node:test');
const assert = require('node:assert');
const { generateContent } = require('../../src/ai/client');

test('generateContent function exists', () => {
    assert.strictEqual(typeof generateContent, 'function');
});
