function getAnalysisPrompt(profile, vacancy) {
    return `
    You are an expert ATS Optimization Strategist and Career Advisor.
    Analyze the following job vacancy against the candidate's profile.
    
    CANDIDATE PROFILE:
    ${profile}
    
    JOB VACANCY:
    ${vacancy}
    
    TASK:
    Provide a VERY CONCISE analysis (maximum 3-4 short sentences).
    State clearly if the candidate is a good match and list 1-2 main missing skills if any.
    CRITICAL: Output PLAIN TEXT ONLY. Do NOT use any Markdown formatting, bold text (**), headers (###), or bullet points.
    Output ONLY in Ukrainian.
    `;
}

function getCvPrompt(profile, vacancy) {
    return `Create a tailored ATS-friendly CV in Markdown format based ONLY on the following profile.
CRITICAL: Do NOT hallucinate or invent new skills. Use only what is in the profile.
Profile:
${profile}

Vacancy:
${vacancy}`;
}

function getCoverLetterPrompt(profile, vacancy) {
    return `Write a modern cover letter in English targeting the provided vacancy.
Tone: Human, direct, professional. B2 English level. No corporate fluff (do NOT use words like delve, testament, spearhead).
Max 200 words. Cover Letter only, no extra text.
Profile:
${profile}

Vacancy:
${vacancy}`;
}

module.exports = { getAnalysisPrompt, getCvPrompt, getCoverLetterPrompt };
