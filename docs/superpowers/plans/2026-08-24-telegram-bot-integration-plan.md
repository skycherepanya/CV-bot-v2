# Telegram Bot Setup & Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Telegram bot interface using `grammy` to interact with users, receive job vacancies, run AI analysis, and provide CV/Cover Letter generation via inline buttons.

**Architecture:** A modular `grammy` bot setup. Handlers are split by commands and callbacks. Uses `dotenv` for secrets. It relies on the previously built Core Engine (`analyzeVacancy`) and AI client (which we will update to read the dynamic `MODEL_NAME`).

**Tech Stack:** Node.js, `grammy`, `dotenv`

**Spec:** `/Users/skycherepanya/Documents/GitHub/CV-bot-v2/CV_Generator_Engineering_Spec.md` (Phase 3)

## Global Constraints
- Node.js v18+
- Use ES Modules or CommonJS (we initialized as CommonJS).
- Strict error handling to prevent bot crashes.
- Output from AI should be sent using `parse_mode: 'Markdown'` or `MarkdownV2` (but Gemini raw markdown might conflict with Telegram's strict MarkdownV2, so we'll just send plain text if parsing fails, or use HTML).

---

### Task 1: Update AI Client to Use Environment Model

**Files:**
- Modify: `src/ai/client.js`
- Test: `tests/ai/client.test.js`

**Interfaces:**
- Consumes: `process.env.MODEL_NAME` (e.g. `gemini-3.6-flash`)

- [ ] **Step 1: Write the failing test** (Update the existing test to verify model config)
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation** (Update `client.js` to use `process.env.MODEL_NAME || 'gemini-1.5-flash'`)
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

### Task 2: Bot Initialization & /start Command

**Files:**
- Create: `src/bot/bot.js`
- Create: `tests/bot/bot.test.js`

**Interfaces:**
- Produces: `bot` instance

- [ ] **Step 1: Write the failing test** (Verify `bot` is instantiated and has handlers)
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation** (Init `grammy` bot, add `/start` command with a welcome message explaining how to send a vacancy)
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

### Task 3: Handle Vacancy Text & Trigger Analysis

**Files:**
- Create: `src/bot/handlers/message.js`
- Modify: `src/bot/bot.js` (to attach handler)
- Create: `tests/bot/handlers.test.js`

**Interfaces:**
- Consumes: `analyzeVacancy(text)` from `src/core/engine.js`

- [ ] **Step 1: Write the failing test** (Mock `analyzeVacancy` and test the message handler)
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation** (When text is received, reply with "Аналізую..." then call `analyzeVacancy`. Send the result back with Inline Keyboard buttons for "Згенерувати CV" and "Згенерувати Cover Letter")
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

### Task 4: Handle Callback Queries (CV & Cover Letter)

**Files:**
- Create: `src/bot/handlers/callback.js`
- Modify: `src/bot/bot.js` (to attach callback handlers)

**Interfaces:**
- Consumes: `getCvPrompt`, `getCoverLetterPrompt`, `generateContent`

- [ ] **Step 1: Write the failing test** (Test `generate_cv` and `generate_cl` callback routing)
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation** (Handle callbacks, read the original vacancy from the message text if possible, generate CV/Cover Letter, and send the result)
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

### Task 5: Server Entrypoint

**Files:**
- Create: `src/index.js`
- Modify: `package.json` (add `start` script)

- [ ] **Step 1: Write minimal implementation** (Load `dotenv`, start `bot.start()`)
- [ ] **Step 2: Run test** (Manual check or basic test)
- [ ] **Step 3: Commit**
