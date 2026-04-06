# Automation Dashboard

Next.js app to run Playwright suites from a **separate test project**, stream progress, and persist runs, cases, and screenshots to **Supabase**. It ships with a standalone reporter package (`packages/automation-reporter`) for any Playwright repo.

---

## Can this live in its own Git repository?

**Yes.** Treat this folder as its own repo (for example `Automation-dashboard`). Point `TEST_ROOT_DIR` at the **absolute path** of your Playwright project (where `playwright.config.js` and `tests/` live). The dashboard does not need to sit inside the test repo.

**If you remove the dashboard from your test monorepo**, update the test project so it no longer depends on a local path into that removed folder:

- Prefer **`@automation-dashboard/reporter`** from a checkout of the dashboard repo, for example:
  - `npm install ../Automation-dashboard/packages/automation-reporter`
  - or `npm install github:Sabirdev112/Automation-dashboard#main` (if you publish or use a git dependency path to the package subfolder—see npm docs for subdir installs), **or** copy/link `packages/automation-reporter` into the test repo.
- In `playwright.config.js`, use the package reporter instead of a file that imports `../dashboard/...` (see [Reporter integration](#reporter-integration-your-playwright-project) below).

The reporter only needs the **same Supabase / Postgres env vars** as the dashboard so inserts and uploads succeed.

---

## Prerequisites

- **Node.js** 18+ (20 LTS recommended)
- **npm** 9+
- A **Supabase** project (Postgres + Storage if you use screenshot uploads)
- A **Playwright** test repository with `playwright.config.js` and a `tests/` tree

---

## 1. Install the dashboard (new machine / new project)

### Option A — Dashboard only in its own clone

```bash
git clone https://github.com/Sabirdev112/Automation-dashboard.git
cd Automation-dashboard
npm install
```

### Option B — Dashboard inside a monorepo (workspace)

From the repo root that lists `"workspaces": ["dashboard"]`:

```bash
npm install
cd dashboard && npm install
```

Use `npm run dev -w dashboard` from the root if your root `package.json` defines that script.

---

## 2. Environment variables

Copy the example file and edit values:

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `DB_HOST_SB`, `DB_PORT_SB`, `DB_USER_SB`, `DB_PASSWORD_SB`, `DB_NAME_SB` | Direct Postgres (used by API routes / migrations). Often Supabase pooler host/port. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon (publishable) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server-side; keep secret) |
| **`TEST_ROOT_DIR`** | **Absolute path** to the Playwright project root (directory containing `playwright.config.js`). Examples: macOS/Linux `/home/you/projects/ReelRecruite-testing`, Windows `D:\projects\ReelRecruite-testing`. Wrong path = tests will not start. |

**Windows note:** Use a normal absolute path; you can use forward slashes in `.env` (e.g. `D:/projects/ReelRecruite-testing`).

---

## 3. Database schema

From the **dashboard** directory (where `migrate-multi.js` lives):

```bash
node migrate-multi.js
```

Run this once per Supabase project (or after schema changes), with DB env vars loaded (e.g. `dotenv` or exporting them in the shell).

---

## 4. Run the dashboard locally

```bash
npm run dev
```

Open the URL Next prints (usually `http://localhost:3000`). Use the UI to trigger **UI**, **API**, **load**, or **all** runs as implemented in your build.

---

## 5. Production build (optional)

```bash
npm run build
npm run start
```

Set the same env vars in your hosting provider (Vercel, Railway, etc.). Ensure `TEST_ROOT_DIR` is valid **on that server** if you run tests from the dashboard host (often you only run tests on a CI/agent with the test repo checked out).

---

## Reporter integration (your Playwright project)

The dashboard records results when tests use the reporter package.

### Install

From your **test project root**:

```bash
npm install /absolute/or/relative/path/to/Automation-dashboard/packages/automation-reporter
```

(Or pack/publish the package and install by name/version.)

### Configure `playwright.config.js`

```javascript
export default defineConfig({
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['@automation-dashboard/reporter'],
  ],
  use: {
    screenshot: 'only-on-failure', // or 'on' — aligns with evidence uploads
    // ...
  },
});
```

### Env in the test project

Add the **same** Supabase/DB variables the reporter expects (see `packages/automation-reporter/supabase.js` / dashboard `.env.example`). Typically load via `dotenv` in `playwright.config.js` or your shell.

---

## Repository layout

| Path | Role |
|------|------|
| `app/` | Next.js App Router UI and `app/api/*` route handlers |
| `lib/` | DB access, process runner, Supabase helpers |
| `packages/automation-reporter/` | Playwright reporter npm package |
| `migrate-multi.js` | Schema migrations |
| `public/screenshots/` | **Generated** — synced at runtime; gitignored |

---

## Troubleshooting

- **`TEST_ROOT_DIR` invalid** — Playwright CLI will not find `playwright.config.js`. Use an absolute path to the test repo root.
- **No rows in Supabase** — Reporter env vars missing or wrong in the **test** project; fix `.env` and re-run a test.
- **419 / auth errors** — Check Supabase keys and RLS policies if applicable.
- **Monorepo removed dashboard** — Switch `playwright.config.js` from `./reporter/customReporter.js` (or any import under `../dashboard/`) to `@automation-dashboard/reporter` as above.

---

**Maintained by Sabirdev112**
