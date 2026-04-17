import express from 'express';
import path from 'path';
import { resolve } from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import treeKill from 'tree-kill';
import { getTestRuns, getRunDetails, getLatestTests } from './lib/db.js';

let currentRunProcess = null; // Active process for the current test file
let isRunStopped = false;    // Flag to abort the remaining files in a full run
let isSessionRunning = false; // Flag for the overall test session (multiple files)

const app = express();
const PORT = 5000;

// API: Get current session status
app.get('/api/status', (req, res) => {
  res.json({
    running: isSessionRunning || !!currentRunProcess
  });
});

// Direct path to Playwright Test CLI (bypasses npx and shell)
const playwrightCliPath = resolve(
  process.cwd(),
  'node_modules',
  '@playwright',
  'test',
  'cli.js'
);

app.use(express.json());

// API: Get runs (from Supabase, fallback to local JSON)
app.get('/api/runs', async (req, res) => {
  try {
    const runs = await getTestRuns();
    res.json(runs);
  } catch (err) {
    console.error('Error loading runs from Supabase:', err.message);
    // Fallback to local JSON if Supabase fails
    const dataFile = path.join(process.cwd(), 'server', 'data', 'runs.json');
    if (fs.existsSync(dataFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
        return res.json(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore parse errors
      }
    }
    // No data source available — return empty instead of crashing
    res.json([]);
  }
});

// API: Get run details (Now from Supabase)
app.get('/api/run-details/:id', async (req, res) => {
  try {
    const details = await getRunDetails(req.params.id);
    if (!details) return res.status(404).json({ error: 'Run not found' });
    res.json(details);
  } catch (err) {
    console.error('Error loading run details:', err.message);
    res.status(500).json({ error: 'Failed to load run details' });
  }
});
// API: Get latest individual test cases
app.get('/api/latest-tests', async (req, res) => {
  try {
    const tests = await getLatestTests();
    res.json(tests);
  } catch (err) {
    console.error('Error loading latest tests:', err.message);
    res.status(500).json({ error: 'Failed to load latest tests' });
  }
});
app.post('/api/rerun-test', (req, res) => {
  const { file, title } = req.body;

  if (!file || !title) {
    return res.status(400).json({ error: 'Missing file or title' });
  }

  let safeFile = file.replace(/[^a-zA-Z0-9_./\-\\]/g, '');
  safeFile = safeFile.replace(/^D:[\\/]/i, '').replace(/\\/g, '/');

  const safeTitle = title.trim().replace(/"/g, '\\"');

  console.log(`\n🔄 Re-running single test`);
  console.log(`   Title: "${title}"`);
  console.log(`   File : ${safeFile}\n`);

  // Escape regex metacharacters so Playwright's --grep receives a literal match
  const escapedGrep = safeTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // For debugging, print the final grep string
  console.log('   Grep :', escapedGrep);

  const spawnArgs = [
    playwrightCliPath,
    'test',
    safeFile,
    '--grep',
    escapedGrep,
    '--headed',
    '--retries=1',
    '--workers=1'
  ];

  console.log('Spawning:', 'node', spawnArgs.join(' '));

  const child = spawn('node', spawnArgs, {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

    // expose single-run process so it can be stopped via /api/stop-run
    currentRunProcess = child;

  child.on('close', (code) => {
    // The rerun was executed successfully, regardless of test result
    // Wait for the reporter to write the results to runs.json
    // The reporter's onEnd() is called when the process closes, but file write is async
    setTimeout(() => {
      if (code === 0) {
        console.log('✅ Single test passed\n');
        res.json({ success: true, passed: true, code: 0 });
      } else {
        console.log(`❌ Single test failed (exit code ${code})`);
        console.log(`   Note: Rerun executed successfully. Test result saved to Supabase.\n`);
        // Still return success: true because the rerun executed successfully
        // The test result (pass/fail) is separate from execution success
        res.json({ success: true, passed: false, code });
      }
    }, 1000); // Increased delay to ensure reporter finishes writing
  });

  child.on('error', (err) => {
    console.error('Failed to start Playwright:', err.message);
    res.status(500).json({ error: 'Failed to start test' });
  });
});

app.post('/api/run-all-tests', (req, res) => {
  if (currentRunProcess) {
    return res.status(409).json({ error: 'A full test run is already in progress' });
  }

  isRunStopped = false; // Reset stop flag
  isSessionRunning = true; // Mark session active

  const getAllTestFiles = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllTestFiles(filePath, fileList);
      } else if (file.endsWith('.spec.js')) {
        // Store relative path from process.cwd() formatted for Playwright
        const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
        fileList.push(relativePath);
      }
    });
    return fileList;
  };

  const testFiles = getAllTestFiles(path.join(process.cwd(), 'tests', 'e2e')).sort((a, b) => {
    const aName = path.basename(a);
    const bName = path.basename(b);
    return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: 'base' });
  });

  if (testFiles.length === 0) {
    return res.status(404).json({ error: 'No test files found in tests/e2e' });
  }

  console.log('\nStarting full test run in order...\n');

  let index = 0;

  const runNext = () => {
    if (isRunStopped) {
      isSessionRunning = false;
      currentRunProcess = null;
      console.log('\nFull test run stopped. Remaining files skipped.\n');
      return res.json({ success: true, message: 'Test run stopped' });
    }

    if (index >= testFiles.length) {
      isSessionRunning = false;
      currentRunProcess = null;
      console.log('\nAll tests completed.\n');
      return res.json({ success: true });
    }

    const file = testFiles[index];
    console.log(`Running (${index + 1}/${testFiles.length}): ${file}`);

    currentRunProcess = spawn('node', [
      playwrightCliPath,
      'test',
      file,
      '--headed',
      '--workers=1'
    ], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });

    currentRunProcess.on('close', (code) => {
      currentRunProcess = null;
      if (code === 0) {
        console.log(`✅ ${file} passed\n`);
      } else {
        console.log(`❌ ${file} failed (code ${code})\n`);
      }
      index++;
      runNext();
    });

    currentRunProcess.on('error', (err) => {
      currentRunProcess = null;
      console.error(`Spawn error for ${file}:`, err.message);
      index++;
      runNext();
    });
  };

  runNext();
});

// API: Run all load tests in order
app.post('/api/run-load-tests', (req, res) => {
  if (currentRunProcess) {
    return res.status(409).json({ error: 'A test run is already in progress' });
  }

  isRunStopped = false; // Reset stop flag
  isSessionRunning = true; // Mark session active

  const loadTestDir = path.join(process.cwd(), 'tests', 'Load-Test');
  
  if (!fs.existsSync(loadTestDir)) {
    return res.status(404).json({ error: 'Load test directory not found' });
  }

  const testFiles = fs.readdirSync(loadTestDir)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join('tests', 'Load-Test', file));

  if (testFiles.length === 0) {
    return res.status(404).json({ error: 'No load test files found' });
  }

  console.log(`\nStarting full load test run (${testFiles.length} files)...\n`);

  let index = 0;

  const runNext = () => {
    if (isRunStopped) {
      isSessionRunning = false;
      currentRunProcess = null;
      console.log('\nLoad test run stopped. Remaining files skipped.\n');
      return res.json({ success: true, message: 'Load test run stopped' });
    }

    if (index >= testFiles.length) {
      isSessionRunning = false;
      currentRunProcess = null;
      console.log('\nAll load tests completed.\n');
      return res.json({ success: true });
    }

    const file = testFiles[index];
    console.log(`Running Load Test (${index + 1}/${testFiles.length}): ${file}`);

    // Run using k6
    currentRunProcess = spawn('k6', ['run', file], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });

    currentRunProcess.on('close', (code) => {
      currentRunProcess = null;
      if (code === 0) {
        console.log(`✅ Load test ${file} passed\n`);
      } else {
        console.log(`❌ Load test ${file} failed (code ${code})\n`);
      }
      index++;
      runNext();
    });

    currentRunProcess.on('error', (err) => {
      currentRunProcess = null;
      console.error(`Spawn error for load test ${file}:`, err.message);
      // Even if it fails to start (e.g. k6 missing), we move to next or stop
      index++;
      runNext();
    });
  };

  runNext();
});

// API: Stop current full run
app.post('/api/stop-run', (req, res) => {
  if (!currentRunProcess) {
    return res.status(400).json({ error: 'No test run in progress' });
  }

  isRunStopped = true;
  isSessionRunning = false;

  console.log('\nStopping full Playwright test run...');

  try {
    currentRunProcess.kill('SIGINT');
    console.log('Sent SIGINT – current test file shutting down gracefully');
  } catch (e) {
    console.warn('Failed to send SIGINT:', e.message);
  }

    // Clear current process reference
    currentRunProcess = null;

  res.json({
    success: true,
    message: 'Full test run stopped – current file terminating, remaining files skipped'
  });
});

// Legacy HTTP API only — UI lives in https://github.com/Sabirdev112/Automation-dashboard
app.get('/', (req, res) => {
  res.json({
    message: 'Legacy test-runner API. For the web UI, run the Automation Dashboard (Next.js) from its own repo.',
    dashboard: 'https://github.com/Sabirdev112/Automation-dashboard',
  });
});

app.listen(PORT, () => {
  console.log(`\nLegacy API server at http://localhost:${PORT} (JSON APIs only)\n`);
  console.log('Automation Dashboard UI: https://github.com/Sabirdev112/Automation-dashboard\n');
});