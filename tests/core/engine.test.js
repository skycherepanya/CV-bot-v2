const test = require('node:test');
const assert = require('node:assert');
const { analyzeVacancy } = require('../../src/core/engine');

test('analyzeVacancy function exists', () => {
    assert.strictEqual(typeof analyzeVacancy, 'function');
});
