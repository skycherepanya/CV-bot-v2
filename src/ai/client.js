const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateContent(prompt, isJson = false) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is required');
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.MODEL_NAME || 'gemini-1.5-flash';
    
    const config = isJson ? { generationConfig: { responseMimeType: "application/json" } } : {};
    const model = genAI.getGenerativeModel({ model: modelName, ...config });
    
    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = { generateContent };
