import { spawn } from 'child_process';
import treeKill from 'tree-kill';
import path from 'path';
import { insertLoadRun, insertLoadTestCase } from '@/lib/db';

// Global state for process management
if (!global.processManager) {
  global.processManager = {
    currentRunProcess: null,
    isRunStopped: false,
    isSessionRunning: false,
    progress: { total: 0, completed: 0, currentTest: '' }
  };
}

const manager = global.processManager;

export function getStatus() {
  return {
    running: manager.isSessionRunning || !!manager.currentRunProcess,
    progress: manager.progress
  };
}

export function stopRun() {
  if (!manager.currentRunProcess) return false;
  manager.isRunStopped = true;
  manager.isSessionRunning = false;
  try {
    treeKill(manager.currentRunProcess.pid, 'SIGINT');
    manager.currentRunProcess = null;
    return true;
  } catch (e) {
    console.error('Failed to stop run process:', e.message);
    return false;
  }
}

async function runFilesSequential(testFiles, playwrightCliPath, rootDir, runName, isApi = false) {
  if (manager.isSessionRunning || manager.currentRunProcess) return false;

  // UI runs in 3 browsers, API runs in 1 (Chromium)
  const browsers = isApi ? ['chromium'] : ['chromium', 'firefox', 'webkit'];
  const totalSteps = testFiles.length * browsers.length;

  manager.isRunStopped = false;
  manager.isSessionRunning = true;
  manager.progress = { total: totalSteps, completed: 0, currentTest: '' };
  
  let browserIndex = 0;
  let fileIndex = 0;

  const runNext = () => {
    if (manager.isRunStopped || browserIndex >= browsers.length) {
      manager.isSessionRunning = false;
      manager.currentRunProcess = null;
      return;
    }

    const browser = browsers[browserIndex];
    const file = testFiles[fileIndex];
    const browserLabel = browser ? `[${browser.toUpperCase()}] ` : '';
    manager.progress.currentTest = `${browserLabel}${file.split(/[\\/]/).pop()}`;
    
    const args = [playwrightCliPath, 'test', file];
    
    // For UI tests, specify the project and headed mode
    if (!isApi) {
      args.push('--headed', '--workers=1');
      if (browser) {
        args.push(`--project=${browser}`);
      }
    } else {
      // For API tests, run headless in the specified browser (usually Chromium)
      args.push(`--project=${browser}`);
    }

    const child = spawn(process.execPath, args, {
      cwd: rootDir,
      stdio: 'inherit',
      env: { ...process.env, PLAYWRIGHT_RUN_NAME: runName }
    });

    manager.currentRunProcess = child;

    child.on('close', (code) => {
      manager.currentRunProcess = null;
      
      // STOP if failure occurs (Exit Code !== 0)
      if (code !== 0) {
        console.warn(`[PROCESS MANAGER] Audit failed at spec: ${file} on ${browser || 'api'}. Aborting sequence.`);
        manager.isRunStopped = true;
        manager.isSessionRunning = false;
        return;
      }
      
      fileIndex++;
      if (fileIndex >= testFiles.length) {
        fileIndex = 0;
        browserIndex++;
      }

      manager.progress.completed++;
      runNext();
    });

    child.on('error', (err) => {
      manager.currentRunProcess = null;
      manager.isRunStopped = true;
      manager.isSessionRunning = false;
    });
  };

  runNext();
  return true;
}

export const runAllTests = (f, cli, r, n) => runFilesSequential(f, cli, r, n, false);
export const runApiTests = (f, cli, r, n) => runFilesSequential(f, cli, r, n, true);

/**
 * Executes load tests sequentially and stops on first failure
 */
export async function runLoadTests(testFiles, rootDir, runName = 'Load Stress Audit') {
  if (manager.isSessionRunning || manager.currentRunProcess) return false;

  const runId = Date.now();
  const startedAt = new Date().toISOString();

  manager.isRunStopped = false;
  manager.isSessionRunning = true;
  manager.progress = { total: testFiles.length, completed: 0, currentTest: '' };
  
  let index = 0;

  const runNext = async () => {
    if (manager.isRunStopped || index >= testFiles.length) {
      const endedAt = new Date().toISOString();
      await insertLoadRun({
        id: runId,
        name: runName,
        startedAt,
        endedAt,
        duration: Date.now() - runId,
        summary: { total: testFiles.length, passed: manager.progress.completed, failed: 0 }
      });
      
      manager.isSessionRunning = false;
      manager.currentRunProcess = null;
      return;
    }

    const file = testFiles[index];
    const testName = file.split(/[\\/]/).pop().replace('.js', '');
    manager.progress.currentTest = testName;

    const child = spawn('k6', ['run', file], {
      cwd: rootDir,
      stdio: 'inherit'
    });

    manager.currentRunProcess = child;

    child.on('close', async (code) => {
      manager.currentRunProcess = null;
      
      try {
        await insertLoadTestCase(
          testName,
          code === 0 ? 'passed' : 'failed',
          { file, duration: 0, error: code !== 0 ? 'Load threshold exceeded' : null },
          runId
        );
      } catch (e) {
        console.error('[LOAD] Telemetry failure:', e.message);
      }

      // STOP if k6 exit code is failure
      if (code !== 0) {
        console.warn(`[PROCESS MANAGER] Load threshold failed at ${testName}. Aborting stress sequence.`);
        manager.isRunStopped = true;
        
        // Finalize run record prematurely
        const endedAt = new Date().toISOString();
        await insertLoadRun({
          id: runId,
          name: runName,
          startedAt,
          endedAt,
          duration: Date.now() - runId,
          summary: { total: testFiles.length, passed: manager.progress.completed, failed: 1 }
        });

        manager.isSessionRunning = false;
        return;
      }

      index++;
      manager.progress.completed = index;
      runNext();
    });

    child.on('error', (err) => {
      manager.currentRunProcess = null;
      index++;
      manager.progress.completed = index;
      runNext();
    });
  };

  runNext();
  return true;
}

export async function rerunSingleTest(file, grep, playwrightCliPath, rootDir) {
  if (manager.currentRunProcess || manager.isSessionRunning) return false;
  manager.isSessionRunning = true;
  manager.progress = { total: 1, completed: 0, currentTest: grep };

  const safeFile = file.replace(/^D:[\\/]/i, '').replace(/\\/g, '/');
  const isApi = safeFile.includes('api');
  const escapedGrep = grep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const args = [playwrightCliPath, 'test', safeFile, '--grep', escapedGrep, '--retries=1'];
  if (!isApi) {
    args.push('--headed', '--workers=1');
  } else {
    args.push('--project=chromium');
  }

  const child = spawn(process.execPath, args, {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_RUN_NAME: `Rerun: ${grep}` }
  });

  manager.currentRunProcess = child;

  return new Promise((resolve) => {
    child.on('close', (code) => {
      manager.currentRunProcess = null;
      manager.isSessionRunning = false;
      manager.progress.completed = 1;
      resolve(code === 0);
    });
  });
}


