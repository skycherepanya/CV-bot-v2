const test = require('node:test');
const assert = require('node:assert');
const { getAnalysisPrompt, getCvPlannerPrompt, getCvGeneratorPrompt, getCoverLetterPrompt } = require('../../src/ai/prompts');

test('getAnalysisPrompt should return formatted prompt', () => {
    const prompt = getAnalysisPrompt('My Profile', 'Job Vacancy');
    assert.ok(prompt.includes('My Profile'));
    assert.ok(prompt.includes('Job Vacancy'));
    assert.ok(prompt.includes('PLAIN TEXT ONLY'));
});

test('getCvPlannerPrompt should return formatted prompt', () => {
    const prompt = getCvPlannerPrompt('Profile X', 'Job Y');
    assert.ok(prompt.includes('Profile X'));
    assert.ok(prompt.includes('Job Y'));
    assert.ok(prompt.includes('JSON SCHEMA'));
});

test('getCvGeneratorPrompt should return formatted prompt', () => {
    const prompt = getCvGeneratorPrompt('Profile X', 'Plan Y');
    assert.ok(prompt.includes('Profile X'));
    assert.ok(prompt.includes('Plan Y'));
    assert.ok(prompt.includes('Markdown'));
});

test('getCoverLetterPrompt should return formatted prompt', () => {
    const prompt = getCoverLetterPrompt('Profile X', 'Job Y');
    assert.ok(prompt.includes('Profile X'));
    assert.ok(prompt.includes('Job Y'));
    assert.ok(prompt.includes('Cover Letter'));
});
