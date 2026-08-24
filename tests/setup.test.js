const test = require('node:test');
const assert = require('node:assert');

test('Setup should have dependencies installed', () => {
    assert.doesNotThrow(() => require('grammy'));
    assert.doesNotThrow(() => require('@google/generative-ai'));
});
