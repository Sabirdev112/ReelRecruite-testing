# Automation Dashboard

Next.js app to run Playwright suites from a **separate test project**, stream progress, and persist runs, cases, and screenshots to **Supabase**. Includes the standalone reporter package [`packages/automation-reporter`](./packages/automation-reporter) for any Playwright repo.

**Repository:** [github.com/Sabirdev112/Automation-dashboard](https://github.com/Sabirdev112/Automation-dashboard)

The `public/` directory is **not** tracked in git (runtime screenshots and other generated assets). The app does not rely on committed files under `public/`.

---

## Prerequisites

- **Node.js** 18+ (20 LTS recommended)
- **npm** 9+
- A **Supabase** project (Postgres + Storage if you use screenshot uploads)
- A **Playwright** test repository with `playwright.config.js` and a `tests/` tree

---

## 1. Clone and install

```bash
git clone https://github.com/Sabirdev112/Automation-dashboard.git
cd Automation-dashboard
npm install
```

---

## 2. Environment variables

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `DB_HOST_SB`, `DB_PORT_SB`, `DB_USER_SB`, `DB_PASSWORD_SB`, `DB_NAME_SB` | Direct Postgres (API routes / migrations). Often Supabase pooler host/port. |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase anon (publishable) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server-side; keep secret) |
| **`TEST_ROOT_DIR`** | **Absolute path** to the Playwright project root (folder that contains `playwright.config.js`). Examples: `/home/you/projects/my-app-tests`, `C:/dev/my-app-tests`. |

On Windows you can use forward slashes in `.env` (e.g. `C:/dev/my-app-tests`).

---

## 3. Database schema

```bash
node migrate.js
```

Run once per Supabase project (or after schema changes), with DB env vars available (e.g. via `dotenv` or your shell). This creates `test_runs` / `test_cases` (UI), `api_*`, and `load_*` tables. Screenshot URLs are stored in each row’s `result` JSONB; create the Supabase Storage bucket `screenshots` in the dashboard if you use uploads.

### Test order (local only)

`lib/test-order.js` is **not** tracked in git. After clone:

```bash
cp lib/test-order.example.js lib/test-order.js
```

Then list your spec paths in `uiTestOrder` / `apiTestOrder`.

---

## 4. Run locally

```bash
npm run dev
```

Open the URL Next prints (usually `http://localhost:3000`).

---

## 5. Production build (optional)

```bash
npm run build
npm run start
```

Use the same environment variables on your host. If tests run on the same machine as the dashboard, `TEST_ROOT_DIR` must point to a valid path **on that machine**.

---

## Reporter integration (your Playwright project)

### Install

From your **test project root**, install the local package (adjust the path to your clone of this repo):

```bash
npm install ../Automation-dashboard/packages/automation-reporter
```

**Important:** Node resolves `pg` and other reporter dependencies from this dashboard repo’s tree. After cloning, run **`npm install` once in the root of this repository** (`Automation-dashboard/`) so `node_modules` exists there. Otherwise the linked reporter may fail with `Cannot find package 'pg'`.

You can also use an absolute path to `packages/automation-reporter`, or `npm pack` inside `packages/automation-reporter` and install the tarball.

### Configure `playwright.config.js`

```javascript
export default defineConfig({
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['@automation-dashboard/reporter'],
  ],
  use: {
    screenshot: 'only-on-failure',
  },
});
```

### Environment in the test project

Use the **same** Supabase/DB variables the reporter expects (see `packages/automation-reporter/supabase.js` and `.env.example` in this repo). Load them with `dotenv` in `playwright.config.js` or via the shell.

---

## Repository layout

| Path | Role |
|------|------|
| `app/` | Next.js App Router UI and `app/api/*` route handlers |
| `lib/` | DB access, process runner, Supabase helpers |
| `packages/automation-reporter/` | Playwright reporter npm package |
| `migrate.js` | Schema migrations (UI + API + load tables) |
| `lib/test-order.example.js` | Copy to `lib/test-order.js` for run order |
| `public/` | **Gitignored** — created at runtime (e.g. synced screenshots) |
| `LICENSE` | MIT — see [License](#license) |

---

## License

Released under the [MIT License](./LICENSE). You may use, modify, and distribute the code; include the license notice in copies. Software is provided **as-is** (no warranty). Replace the copyright name in `LICENSE` with your legal name if it differs from **Sabirdev112**.

---

## Troubleshooting

- **`TEST_ROOT_DIR` invalid** — Playwright will not find `playwright.config.js`. Use an absolute path to the test repo root.
- **No rows in Supabase** — Reporter env vars missing or wrong in the **test** project.
- **419 / auth** — Check Supabase keys and RLS policies if applicable.

---

**Maintained by Sabirdev112**
