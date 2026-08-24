const test = require('node:test');
const assert = require('node:assert');
const { getAnalysisPrompt, getCvPrompt, getCoverLetterPrompt } = require('../../src/ai/prompts');

test('getAnalysisPrompt should return formatted prompt', () => {
    const prompt = getAnalysisPrompt('Profile X', 'Job Y');
    assert.ok(prompt.includes('Profile X'));
    assert.ok(prompt.includes('Job Y'));
    assert.ok(prompt.includes('GATEKEEPER RULES'));
});

test('getCvPrompt should return formatted prompt', () => {
    const prompt = getCvPrompt('Profile X', 'Job Y');
    assert.ok(prompt.includes('Profile X'));
    assert.ok(prompt.includes('Job Y'));
    assert.ok(prompt.includes('CRITICAL'));
});

test('getCoverLetterPrompt should return formatted prompt', () => {
    const prompt = getCoverLetterPrompt('Profile X', 'Job Y');
    assert.ok(prompt.includes('Profile X'));
    assert.ok(prompt.includes('Job Y'));
    assert.ok(prompt.includes('Cover Letter'));
});
