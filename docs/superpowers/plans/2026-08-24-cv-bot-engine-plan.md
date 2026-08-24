# CV Bot Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modular Node.js Telegram bot that evaluates job fit, and generates a tailored CV and Cover Letter using the Gemini API.

**Architecture:** A modular Node.js application using `grammy` for Telegram interactions, `@google/generative-ai` for AI generation, and native Node.js test runner for TDD. The engine reads `master_profile.md` as the SSOT and orchestrates three distinct AI calls (Analysis, CV, Cover Letter) to ensure quality.

**Tech Stack:** Node.js (v18+), grammy, @google/generative-ai, dotenv.

**Spec:** docs/superpowers/specs/2026-08-24-cv-bot-engine-design.md

## Global Constraints
- Target platform: Node.js (v18+)
- Use native `node:test` and `node:assert` for testing.
- Must not hallucinate new skills (enforced via prompt).
- Strict modular structure as defined in the spec.

---

### Task 1: Project Scaffolding & Setup

**Files:**
- Create: `package.json`
- Create: `tests/setup.test.js`

**Interfaces:**
- Consumes: N/A
- Produces: A working Node.js environment with dependencies installed.

- [ ] **Step 1: Initialize project and install dependencies**

```bash
npm init -y
npm install grammy @google/generative-ai dotenv marked
npm install --save-dev
```

- [ ] **Step 2: Add test script to package.json**

Modify `package.json` to include:
```json
{
  "name": "cv-bot-v2",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "test": "node --test tests/**/*.test.js"
  },
  "dependencies": {
    "@google/generative-ai": "^0.1.0",
    "dotenv": "^16.4.0",
    "grammy": "^1.21.0",
    "marked": "^12.0.0"
  }
}
```

- [ ] **Step 3: Write a failing setup test**

Create `tests/setup.test.js`:
```javascript
const test = require('node:test');
const assert = require('node:assert');

test('Setup should have dependencies installed', () => {
    assert.doesNotThrow(() => require('grammy'));
    assert.doesNotThrow(() => require('@google/generative-ai'));
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tests/setup.test.js
git commit -m "chore: initialize project and add dependencies"
```

### Task 2: File System Utility

**Files:**
- Create: `src/utils/fileSystem.js`
- Create: `tests/utils/fileSystem.test.js`

**Interfaces:**
- Consumes: `master_profile.md`
- Produces: `readMasterProfile()` which returns a string or throws an error.

- [ ] **Step 1: Write the failing test**

Create `tests/utils/fileSystem.test.js`:
```javascript
const test = require('node:test');
const assert = require('node:assert');
const { readMasterProfile } = require('../../src/utils/fileSystem');
const fs = require('fs');

test('readMasterProfile should read the markdown file', () => {
    fs.writeFileSync('./master_profile.md', '# Dummy Profile');
    const content = readMasterProfile();
    assert.strictEqual(content, '# Dummy Profile');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL (Cannot find module)

- [ ] **Step 3: Write minimal implementation**

Create `src/utils/fileSystem.js`:
```javascript
const fs = require('fs');
const path = require('path');

function readMasterProfile() {
    const profilePath = path.join(process.cwd(), 'master_profile.md');
    if (!fs.existsSync(profilePath)) {
        throw new Error('master_profile.md not found');
    }
    return fs.readFileSync(profilePath, 'utf8');
}

module.exports = { readMasterProfile };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/fileSystem.js tests/utils/fileSystem.test.js master_profile.md
git commit -m "feat: add fileSystem utility to read master profile"
```

### Task 3: AI Prompts Module

**Files:**
- Create: `src/ai/prompts.js`
- Create: `tests/ai/prompts.test.js`

**Interfaces:**
- Consumes: profile (String), vacancy (String)
- Produces: `getAnalysisPrompt`, `getCvPrompt`, `getCoverLetterPrompt`.

- [ ] **Step 1: Write the failing test**

Create `tests/ai/prompts.test.js`:
```javascript
const test = require('node:test');
const assert = require('node:assert');
const { getAnalysisPrompt } = require('../../src/ai/prompts');

test('getAnalysisPrompt should return formatted prompt', () => {
    const prompt = getAnalysisPrompt('Profile X', 'Job Y');
    assert.ok(prompt.includes('Profile X'));
    assert.ok(prompt.includes('Job Y'));
    assert.ok(prompt.includes('GATEKEEPER RULES'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Create `src/ai/prompts.js`:
```javascript
function getAnalysisPrompt(profile, vacancy) {
    return `You are an expert ATS Optimization Strategist.
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
Max 200 words.
Profile:
${profile}

Vacancy:
${vacancy}`;
}

module.exports = { getAnalysisPrompt, getCvPrompt, getCoverLetterPrompt };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/ai/prompts.js tests/ai/prompts.test.js
git commit -m "feat: add AI prompt templates"
```

### Task 4: AI Client Wrapper

**Files:**
- Create: `src/ai/client.js`
- Create: `tests/ai/client.test.js`

**Interfaces:**
- Consumes: `@google/generative-ai`
- Produces: `generateContent(prompt)`

- [ ] **Step 1: Write the failing test**

Create `tests/ai/client.test.js`:
```javascript
const test = require('node:test');
const assert = require('node:assert');
const { generateContent } = require('../../src/ai/client');

test('generateContent function exists', () => {
    assert.strictEqual(typeof generateContent, 'function');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Create `src/ai/client.js`:
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateContent(prompt) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is required');
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = { generateContent };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/ai/client.js tests/ai/client.test.js
git commit -m "feat: add Gemini API client wrapper"
```

### Task 5: Core Engine Orchestrator

**Files:**
- Create: `src/core/engine.js`
- Create: `tests/core/engine.test.js`

**Interfaces:**
- Consumes: `readMasterProfile`, `getAnalysisPrompt`, `generateContent`
- Produces: `analyzeVacancy(jobText)`

- [ ] **Step 1: Write the failing test**

Create `tests/core/engine.test.js`:
```javascript
const test = require('node:test');
const assert = require('node:assert');
const { analyzeVacancy } = require('../../src/core/engine');

test('analyzeVacancy function exists', () => {
    assert.strictEqual(typeof analyzeVacancy, 'function');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Create `src/core/engine.js`:
```javascript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/core/engine.js tests/core/engine.test.js
git commit -m "feat: add core engine for orchestrating AI calls"
```
