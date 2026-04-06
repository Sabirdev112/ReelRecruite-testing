import fs from 'fs';
import path from 'path';
import { 
  insertTestCase, insertTestRun, 
  insertApiTestCase, insertApiRun, 
  insertLoadTestCase, insertLoadRun,
  uploadScreenshot
} from './supabase.js';

const browserTrackerFile = path.join(process.cwd(), '.browser-trace.json');

function getBrowserForTest(testId) {
  try {
    if (fs.existsSync(browserTrackerFile)) {
      const tracker = JSON.parse(fs.readFileSync(browserTrackerFile, 'utf-8'));
      return tracker[testId] || 'unknown';
    }
  } catch (err) {
    console.error('[REPORTER] Failed to read browser tracker:', err.message);
  }
  return 'unknown';
}

export default class CustomReporter {
  constructor() {
    this.results = [];
    this.runStartTime = Date.now();
  }

  onBegin(config, suite) {
    // Initialization if needed
  }

  onTestEnd(test, result) {
    const filePath = path.relative(process.cwd(), test.location.file);
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    let browserName = getBrowserForTest(test.id);
    
    if (browserName === 'unknown' && test.parent) {
      const project = typeof test.parent.project === 'function' ? test.parent.project() : null;
      if (project && project.name) {
        browserName = project.name;
      }
    }
    
    let localScreenshot = null;
    const screenshotAttachment = result.attachments.find(a => a.name === 'screenshot');
    
    if (screenshotAttachment) {
      localScreenshot = {
        path: screenshotAttachment.path,
        body: screenshotAttachment.body,
        browserName,
        testId: test.id,
        title: test.title
      };
    }

    this.results.push({
      title: test.title,
      file: normalizedPath,
      line: test.location.line,
      browser: browserName,
      status: result.status,
      duration: result.duration,
      error: result.error ? result.error.message : null,
      stack: result.error ? result.error.stack : null,
      localScreenshot
    });
  }

  async onEnd() {
    const runEndTime = Date.now();
    
    // Sync evidence
    for (const res of this.results) {
      if (res.localScreenshot) {
        const ls = res.localScreenshot;
        const runId = this.runStartTime;
        const shortId = ls.testId.slice(0, 8);
        const fileName = `${runId}_${shortId}_${ls.browserName}.png`;
        
        let publicUrl = null;
        if (ls.path) {
          publicUrl = await uploadScreenshot(ls.path, fileName);
        } else if (ls.body) {
          const tempPath = path.join(process.cwd(), '.temp_screenshot.png');
          fs.writeFileSync(tempPath, ls.body);
          publicUrl = await uploadScreenshot(tempPath, fileName);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
        
        res.screenshot = publicUrl;
        delete res.localScreenshot;
      }
    }

    const browserStats = {};
    for (const result of this.results) {
      const browser = result.browser || 'unknown';
      if (!browserStats[browser]) {
        browserStats[browser] = { total: 0, passed: 0, failed: 0, flaky: 0, interrupted: 0 };
      }
      browserStats[browser].total++;
      browserStats[browser][result.status]++;
    }

    const summary = {
      total: this.results.length,
      passed: this.results.filter(t => t.status === 'passed').length,
      failed: this.results.filter(t => t.status === 'failed').length,
      flaky: this.results.filter(t => t.status === 'skipped' || t.status === 'timedOut').length,
      interrupted: this.results.filter(t => t.status === 'interrupted').length,
      browsers: browserStats
    };

    const runData = {
      id: Date.now(),
      name: process.env.PLAYWRIGHT_RUN_NAME || 'Automated Suite',
      startedAt: new Date(this.runStartTime).toISOString(),
      endedAt: new Date(runEndTime).toISOString(),
      duration: runEndTime - this.runStartTime,
      summary,
    };

    const firstTestFile = (this.results[0]?.file || '').toLowerCase();
    const runName = runData.name.toLowerCase();
    
    let runInserter = insertTestRun, caseInserter = insertTestCase;

    if (firstTestFile.includes('api') || runName.includes('api')) {
       runInserter = insertApiRun;
       caseInserter = insertApiTestCase;
    } else if (firstTestFile.includes('load-test') || runName.includes('load')) {
       runInserter = insertLoadRun;
       caseInserter = insertLoadTestCase;
    }

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
            browser: test.browser,
            screenshot: test.screenshot
          },
          runData.id
        );
      }
    } catch (err) {
      console.error('[REPORTER] Supabase handshake failed:', err.message);
    } finally {
      if (fs.existsSync(browserTrackerFile)) fs.unlinkSync(browserTrackerFile);
    }
  }
}
