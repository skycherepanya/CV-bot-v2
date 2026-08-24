function getAnalysisPrompt(profile, vacancy) {
    return `You are an expert ATS Optimization Strategist, Career Advisor, and Copywriter.
CANDIDATE MASTER CONTEXT:
${profile}

Job Description: ${vacancy}

GATEKEEPER RULES (CRITICAL):
If the job is a bad fit (Match < 30% or dealbreaker), output "SKIP" and a reason. 
Otherwise, evaluate the match %, list 🚩 RED FLAGS & ЛОГІСТИКА, and provide an АНАЛІЗ ВАКАНСІЇ.
Output ONLY in Ukrainian.`;
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
