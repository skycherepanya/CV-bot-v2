const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateContent(prompt, isJson = false) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is required');
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Fallback list of models that are just as smart but have separate rate limits
    const modelsToTry = [
        process.env.MODEL_NAME || 'gemini-3.6-flash',
        'gemini-3.7-flash',
        'gemini-3.5-flash',
        'gemini-3.1-flash',
        'gemini-3.0-flash',
        'gemini-2.5-flash'
    ];
    
    const config = isJson ? { generationConfig: { responseMimeType: "application/json" } } : {};
    
    let lastError;
    
    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName, ...config });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error(`Error with model ${modelName}:`, error.message);
            lastError = error;
            console.log(`Switching to next model...`);
            continue;
        }
    }
    
    throw new Error(`All models failed. Last error: ${lastError.message}`);
}

module.exports = { generateContent };
