const { readMasterProfile } = require('../utils/fileSystem');
const { getAnalysisPrompt } = require('../ai/prompts');
const { generateContent } = require('../ai/client');

async function analyzeVacancy(jobText) {
    const profile = readMasterProfile();
    const prompt = getAnalysisPrompt(profile, jobText);
    const analysis = await generateContent(prompt);
    return analysis;
}

module.exports = { analyzeVacancy };
