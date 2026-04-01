# Reel Recruit AI - Playwright E2E Testing Suite

This project contains the End-to-End (E2E) testing suite for the Reel Recruit AI platform, built using Playwright and following the Page Object Model (POM) and Dependency Injection (Fixtures) patterns.

## 📁 Project Structure

All automation code is located in the `tests/` directory:

- `tests/e2e/`: Contains all `.spec.js` test files organized by user role (Candidate/Recruiter).
- `tests/pages/`: Contains Page Object classes. All classes extend `BasePage`.
- `tests/fixtures/`: Contains `base.fixtures.js` which registers all Page Objects as Playwright fixtures.
- `tests/utils/`: Contains helper functions (database queries, credential loaders, etc.).
- `tests/test-data/`: Contains static assets (images, videos, PDFs) and JSON data files used by tests.

---

## 🚀 Running Tests

### 1. Using the Dashboard (Recommended)
Launch the local dashboard to run tests individually or in batch:
```bash
node server/server
```
Then open `http://localhost:3001` in your browser.

### 2. Using Playwright CLI
Run all tests:
```bash
npx playwright test
```

Run a specific test:
```bash
npx playwright test tests/e2e/Login.spec.js
```

---

## ➕ How to Create a New Test Flow

Follow these steps to add a new functional test to the suite:

### Step 1: Create/Update the Page Object
If the feature requires a new page, create a file in `tests/pages/NewFeaturePage.js`:
```javascript
import { BasePage } from './base.page.js';

export class NewFeaturePage extends BasePage {
  constructor(page) {
    super(page);
    this.someButton = page.getByTestId('some-button');
  }

  async performAction() {
    await this.someButton.click();
  }
}
```

### Step 2: Register the Fixture
Open `tests/fixtures/base.fixtures.js` and register your new page so it can be injected into tests:
```javascript
// 1. Import the class
import { NewFeaturePage } from '../pages/NewFeaturePage.js';

// 2. Add to the base.extend call
export const test = base.extend({
    // ... other fixtures
    newFeaturePage: async ({ page }, use) => {
        await use(new NewFeaturePage(page));
    },
});
```

### Step 3: Create the Spec File
Create your test file in `tests/e2e/` (e.g., `tests/e2e/candidate/NewFeature.spec.js`):
```javascript
import { test, expect } from '../../fixtures/base.fixtures.js';

test('Verify new feature functionality', async ({ page, loginPage, newFeaturePage }) => {
  await loginPage.goto();
  await newFeaturePage.performAction();
  // ... assertions
});
```

### Step 4: Update the Run All Flow (Optional)
If you want your new test to be included in the "Run All Tests" button on the dashboard, add the file path to the `testFiles` array in `server/server.js`.

---

## 🛠️ Debugging
If a test fails, Playwright is configured to:
- Generate a **Trace** file (on first retry).
- Save a **Screenshot** on failure.
- Record a **Video** on failure.

These can be found in the `test-results/` folder or viewed directly via the local dashboard.