# Reel Recruit AI - Automation Monorepo 🚀

Welcome to the centralized automation hub for Reel Recruit AI. This repository is organized as a **Monorepo** using NPM Workspaces, containing both the Testing Suite and the Automation Dashboard.

## 📁 Repository Structure

- **`packages/dashboard`**: A Next.js application that provides a visual UI to monitor, rerun, and analyze test results.
- **`packages/testing`**: A Playwright-based E2E testing suite with a custom Express API runner.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher.
- **Playwright Browsers**: Run `npx playwright install` after the first setup.
- **Environment Variables**: Ensure you have correct `.env` files in:
  - `packages/testing/.env`
  - `packages/dashboard/.env`

### 2. Initial Setup
From the **root directory**, run:
```bash
npm install
```
This will automatically install dependencies for all packages in the monorepo.

---

## 🚀 Running the Project

You can run everything from the root directory using these shortcut commands:

### **A. Start the Automation Dashboard (UI)**
Runs the Next.js UI where you can see the reports.
```bash
npm run dashboard:dev
```
Local URL: `http://localhost:3000`

### **B. Start the Test Runner Server (API)**
Runs the Express server that the dashboard communicates with to trigger tests.
```bash
npm run testing:run
```
Local URL: `http://localhost:5000`

### **C. Run Tests via CLI**
You can run all tests or choose a specific category:
```bash
# Run everything
npm run testing:test

# Run only UI/E2E Functional tests (Sequence ordered)
npm run testing:e2e

# Run only API tests
npm run testing:api

# Run only Load tests (k6)
npm run testing:load
```
# to run and test category in specific browser
```bash
npm run testing:e2e -- --project=chromium
npm run testing:e2e -- --project=firefox
npm run testing:e2e -- --project=webkit
```
---

## 🔢 Test Execution Order

Tests are executed in a **specific numeric order** to handle state-dependent flows (e.g., Job Creation must happen before Job Application).

- To maintain this order, tests in both `packages/testing/tests/e2e` and `packages/testing/tests/api` are named with numeric prefixes (`01-`, `02-`, etc.).
- The system automatically discovers these files and sorts them before running.
- **To add a new test in the sequence**: Simply name it `XX-MyTest.spec.js` and it will be picked up automatically.

---

## 🌐 Deployment (Vercel)

### Deploying the Dashboard
1. Connect this repo to Vercel.
2. Set **Root Directory** to `packages/dashboard`.
3. Add your Supabase/Database Environment Variables.
4. **Note**: The Test Runner API (in `packages/testing`) should be hosted on a persistent server (like Railway or a VPS) because Playwright cannot run inside Vercel's serverless functions.

---

## 🧪 Debugging
- All failure snapshots, videos, and traces are stored in `packages/testing/test-results`.
- You can inspect these directly or via the local Dashboard.
