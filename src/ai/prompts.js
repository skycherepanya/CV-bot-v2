function getAnalysisPrompt(profile, vacancy) {
    return `
    You are an expert ATS Optimization Strategist and Career Advisor.
    Analyze the following job vacancy against the candidate's profile.
    
    CANDIDATE PROFILE:
    ${JSON.stringify(profile)}
    
    JOB VACANCY:
    ${vacancy}
    
    GATEKEEPER RULES (CRITICAL):
    SCENARIO A: If the "Job Description" is just a greeting, random text, or an unreadable link, output EXACTLY "❌ Помилка: Текст не розпізнано як вакансію." and STOP.
    SCENARIO B (Low Match/Dealbreaker): If the match is < 30% OR there is an absolute dealbreaker (e.g., Native Hungarian required, Senior level 5+ years), output EXACTLY "❌ СКІПАЄМО: [Вкажи причину]." and STOP.
    
    TASK (If passed Gatekeeper):
    Provide a VERY CONCISE analysis (maximum 3-4 short sentences).
    State clearly if the candidate is a good match and list 1-2 main missing skills if any.
    CRITICAL: Output PLAIN TEXT ONLY. Do NOT use any Markdown formatting, bold text (**), headers (###), or bullet points.
    Output ONLY in Ukrainian.
    `;
}

function getCvPlannerPrompt(profile, vacancy) {
    return `You are an expert ATS Optimization Strategist. Your task is to plan a tailored CV for the provided vacancy based on the candidate's profile.

CANDIDATE PROFILE (JSON):
${JSON.stringify(profile)}

VACANCY:
${vacancy}

INSTRUCTIONS:
1. Identify the "Job Family" (e.g., IT Support, Software Engineer, Customer Success).
2. Write a highly tailored "professional_summary" narrative for this specific Job Family. Adapt and re-contextualize the candidate's past experience to highlight relevance to the target vacancy. It's okay to emphasize certain aspects of a past job to make it look like a better fit, but DO NOT invent fake titles, false dates, or tools the candidate has never used.
3. Select and categorize skills into "required", "relevant", and "peripheral" based on the vacancy. We will only show required and relevant skills.
4. Score and rank the candidate's projects based on relevance to the vacancy.
5. Provide a JSON output detailing the plan.

JSON SCHEMA:
{
  "job_family": "string",
  "tailored_summary": "string",
  "skills_to_include": ["string (skill names only)"],
  "projects_ranking": ["string (project names only)"],
  "experience_focus": [
    {
      "company": "string",
      "action_context_result_bullets": ["string"]
    }
  ]
}
`;
}

function getCvGeneratorPrompt(profile, plan) {
    return `You are a professional Resume Writer. Generate a 1-page ATS-friendly CV in Markdown format.

CANDIDATE PROFILE (Source of Truth):
${JSON.stringify(profile)}

CV PLAN (Tailoring Instructions):
${plan}

STRICT RULES:
1. ONLY include skills listed in "skills_to_include" from the plan.
2. Order projects according to "projects_ranking" from the plan.
3. Use the exact "tailored_summary" from the plan.
4. For Experience, use the "action_context_result_bullets" from the plan if provided, or rewrite them to follow the Action -> Context -> Result format based on the Profile.
5. NEVER invent false dates or job titles. Dates MUST strictly match the Profile.
6. MUST fit on a single page (be extremely concise, max 3-4 bullets per role, keep it tight).
7. Output pure Markdown. No conversational text.
`;
}

function getCoverLetterPrompt(profile, vacancy) {
    return `Write a modern cover letter in English targeting the provided vacancy.
Tone: Human, direct, professional. B2 English level. No corporate fluff (do NOT use words like delve, testament, spearhead).
Max 200 words. Cover Letter only, no extra text.
Profile:
${JSON.stringify(profile)}

Vacancy:
${vacancy}`;
}

module.exports = { getAnalysisPrompt, getCvPlannerPrompt, getCvGeneratorPrompt, getCoverLetterPrompt };
