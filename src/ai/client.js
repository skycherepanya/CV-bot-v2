const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateContent(prompt) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is required');
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.MODEL_NAME || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = { generateContent };
