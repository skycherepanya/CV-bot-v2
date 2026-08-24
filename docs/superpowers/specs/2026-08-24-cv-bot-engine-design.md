# Adaptive CV Engine (JS/TS Bot) - Design Specification

## Overview
A modular Node.js Telegram bot (Adaptive-CV-Engine) that processes job descriptions, evaluates candidate fit based on a `master_profile.md`, and dynamically generates a tailored ATS-friendly CV and a Cover Letter.

## Requirements
1. **Platform**: Telegram Bot using `grammy`.
2. **AI Provider**: `@google/generative-ai` (Gemini API).
3. **Core Features**:
   - **Fit Analysis**: Minimal analysis to evaluate if a vacancy is a good match before generating the full documents.
   - **Tailored CV Generation**: Filters and rewrites `master_profile.md` content strictly without hallucinating new skills.
   - **Cover Letter Generation**: Generates a targeted cover letter based on the vacancy and profile.
4. **Architecture**: Modular structure for scalability and future addition of PDF rendering (Puppeteer/Marked).

## System Architecture

### Components & Data Flow
1. **User Input**: User sends a job description (text or link) to the Telegram bot.
2. **Analysis Phase**: 
   - Bot reads `master_profile.md`.
   - AI analyzes the job description against the profile.
   - Bot replies with a short "Fit Analysis" (e.g., Match %, Pros, Cons, and a recommendation on whether to apply).
3. **Generation Phase**:
   - AI generates `tailored_cv.md` based on a strict `cv_system_prompt`.
   - AI generates `cover_letter.md` based on a `cover_letter_prompt`.
4. **Output**: Bot sends the generated documents back to the user.

### File Structure (Modular MVP)
```text
src/
├── bot/
│   ├── handlers.js       # Telegram command and message handlers
│   └── bot.js            # Grammy bot initialization
├── ai/
│   ├── client.js         # Gemini API client wrapper
│   └── prompts.js        # System prompts (Analysis, CV, Cover Letter)
├── core/
│   └── engine.js         # Orchestrates the AI calls and data flow
├── utils/
│   └── fileSystem.js     # Helper for reading master_profile.md
├── index.js              # Application entry point
```

## AI & Prompting Strategy
- **Strict Adherence**: The `cv_system_prompt` must explicitly forbid inventing experiences or skills. It must only filter and adapt existing points from the SSOT (Single Source of Truth).
- **Sequential Calls**: To avoid overloading the AI context and ensure quality, the generation should ideally be split: 
  1. Analysis Call
  2. CV Generation Call
  3. Cover Letter Call

## Error Handling
- Handle Gemini API rate limits and connection errors gracefully.
- Send clear, user-friendly error messages in Telegram.
- Fallback if the job description is too short or malformed.
