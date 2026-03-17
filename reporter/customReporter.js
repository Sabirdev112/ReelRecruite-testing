import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { insertTestCase, insertTestRun } from '../dashboard/supabaseService.js';

export default class CustomReporter {
  constructor() {
    this.results = [];
    this.runStartTime = Date.now();
  }

  onTestEnd(test, result) {
  // Get full relative path from project root
  const fullPath = test.location.file; // This is usually absolute
  const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/'); // Normalize to forward slashes

  this.results.push({
    title: test.title,
    description:
      test.annotations?.find(a => a.type === 'description')?.description || '',
    file: path.relative(process.cwd(), test.location.file).replace(/\\/g, '/'),        // ← NOW CORRECT: e.g., "UI/Recruiter/UpdateInfo.spec.js"
    line: test.location.line,
    status: result.status,
    duration: result.duration,
    retries: result.retry,
    wasFlaky: result.retry > 0 && result.status === 'passed',
    error: result.error ? result.error.message : null,
    stack: result.error ? result.error.stack : null,
    attachments: result.attachments.map(a => ({
      name: a.name,
      path: a.path,
      contentType: a.contentType
    }))
  });
}

  async onEnd() {
  const runEndTime = Date.now();
  const summary = {
    total: this.results.length,
    passed: this.results.filter(t => t.status === 'passed').length,
    failed: this.results.filter(t => t.status === 'failed').length,
    Flaky: this.results.filter(t => 
      t.status === 'skipped' || t.status === 'timedOut'
    ).length,
    interrupted: this.results.filter(t => t.status === 'interrupted').length 
  };

    const runData = {
      id: Date.now(),
      startedAt: new Date(this.runStartTime).toISOString(),
      endedAt: new Date(runEndTime).toISOString(),
      duration: runEndTime - this.runStartTime,
      summary,
      tests: this.results
    };

    // Save to local JSON (backward compatibility)
    const dataDir = path.join(process.cwd(), 'server', 'data');
    const dataFile = path.join(dataDir, 'runs.json');

    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const existingRuns = fs.existsSync(dataFile)
      ? JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
      : [];

    existingRuns.unshift(runData);

    fs.writeFileSync(dataFile, JSON.stringify(existingRuns, null, 2));
    console.log('📊 Test results saved locally');

    // ✅ Sync with Supabase (Full migration)
    console.log('☁️  Syncing full run to Supabase...');
    try {
      // 1. Insert Run Summary
      await insertTestRun({
        id: runData.id,
        startedAt: runData.startedAt,
        endedAt: runData.endedAt,
        duration: runData.duration,
        summary: runData.summary
      });

      // 2. Insert individual Test Cases
      for (const test of this.results) {
        let dbStatus = test.status;
        if (dbStatus === 'skipped' || dbStatus === 'timedOut') {
          dbStatus = 'Flaky';
        }

        await insertTestCase(
          test.title,
          dbStatus,
          {
            file: test.file,
            duration: test.duration,
            error: test.error,
            stack: test.stack
          },
          runData.id // Link to the run
        );
      }
      console.log('✅ Supabase full sync completed');
    } catch (err) {
      console.error('Failed to sync to Supabase:', err.message);
    }

    // ✅ Check if server file exists before starting
    const serverFile = path.join(process.cwd(), 'server', 'server.js');
    if (fs.existsSync(serverFile)) {
      console.log('🚀 Ensuring dashboard server logic...');
    } else {
      console.error('❌ server/server.js file not found.');
    }
  }
}
