import fs from 'fs';
import path from 'path';
import { 
  insertTestCase, insertTestRun, 
  insertApiTestCase, insertApiRun, 
  insertLoadTestCase, insertLoadRun 
} from '../dashboard/lib/supabase.js';

export default class CustomReporter {
  constructor() {
    this.results = [];
    this.runStartTime = Date.now();
  }

  onTestEnd(test, result) {
    const filePath = path.relative(process.cwd(), test.location.file);
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    // Look for screenshots on failure
    let screenshotPath = null;
    const screenshotAttachment = result.attachments.find(a => a.name === 'screenshot');
    
    if (screenshotAttachment && screenshotAttachment.path) {
      const runId = this.runStartTime;
      // Use test title as filename basis
      const safeTitle = test.title.replace(/[^a-z0-0]/gi, '_').toLowerCase();
      const fileName = `${runId}_${safeTitle}.png`;
      const targetDir = path.join(process.cwd(), 'dashboard', 'public', 'screenshots');
      
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      
      const targetPath = path.join(targetDir, fileName);
      try {
        fs.copyFileSync(screenshotAttachment.path, targetPath);
        screenshotPath = `/screenshots/${fileName}`;
      } catch (err) {
        console.warn('[REPORTER] Failed to archive screenshot:', err.message);
      }
    }

    this.results.push({
      title: test.title,
      file: normalizedPath,
      line: test.location.line,
      status: result.status,
      duration: result.duration,
      error: result.error ? result.error.message : null,
      stack: result.error ? result.error.stack : null,
      screenshot: screenshotPath
    });
  }

  async onEnd() {
    const runEndTime = Date.now();
    const summary = {
      total: this.results.length,
      passed: this.results.filter(t => t.status === 'passed').length,
      failed: this.results.filter(t => t.status === 'failed').length,
      flaky: this.results.filter(t => t.status === 'skipped' || t.status === 'timedOut').length,
      interrupted: this.results.filter(t => t.status === 'interrupted').length 
    };

    const runData = {
      id: Date.now(),
      name: process.env.PLAYWRIGHT_RUN_NAME || 'Automated Suite',
      startedAt: new Date(this.runStartTime).toISOString(),
      endedAt: new Date(runEndTime).toISOString(),
      duration: runEndTime - this.runStartTime,
      summary,
    };

    // Determine target tables based on evidence (file path or run name as fallback)
    const firstTestFile = (this.results[0]?.file || '').toLowerCase();
    const runName = runData.name.toLowerCase();
    
    let runInserter, caseInserter, dataKey;

    if (firstTestFile.includes('api') || runName.includes('api')) {
       runInserter = insertApiRun;
       caseInserter = insertApiTestCase;
       dataKey = 'api-runs';
    } else if (firstTestFile.includes('load-test') || firstTestFile.includes('k6') || runName.includes('load')) {
       runInserter = insertLoadRun;
       caseInserter = insertLoadTestCase;
       dataKey = 'load-runs';
    } else {
       runInserter = insertTestRun;
       caseInserter = insertTestCase;
       dataKey = 'runs';
    }

    console.log(`[REPORTER] Handshaking: ${runName} -> ${dataKey}`);

    // Supabase Sync
    try {
      await runInserter(runData);

      for (const test of this.results) {
        let dbStatus = test.status;
        if (dbStatus === 'skipped' || dbStatus === 'timedOut') dbStatus = 'flaky';

        await caseInserter(
          test.title,
          dbStatus,
          {
            file: test.file,
            duration: test.duration,
            error: test.error,
            stack: test.stack,
            line: test.line,
            screenshot: test.screenshot
          },
          runData.id
        );
      }
      console.log(`✅ Telemetry Bridge Complete: ${runData.name}`);
    } catch (err) {
      console.error('[REPORTER] Supabase handshake failed:', err.message);
    }
  }
}
