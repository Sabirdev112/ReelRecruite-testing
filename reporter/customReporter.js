import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export default class CustomReporter {
  constructor() {
    this.results = [];
    this.runStartTime = Date.now();
  }

  onTestEnd(test, result) {
    this.results.push({
      title: test.title,
      description:
        test.annotations?.find(a => a.type === 'description')?.description || '',
      file: test.location.file,
      line: test.location.line,
      status: result.status,
      duration: result.duration,
      retries: result.retry,
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
    skipped: this.results.filter(t => 
      t.status === 'skipped' || t.status === 'timedOut' // ← ADD timedOut here
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

    const dataDir = path.join(process.cwd(), 'server', 'data');
    const dataFile = path.join(dataDir, 'runs.json');

    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const existingRuns = fs.existsSync(dataFile)
      ? JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
      : [];

    existingRuns.unshift(runData);

    fs.writeFileSync(dataFile, JSON.stringify(existingRuns, null, 2));
    console.log('📊 Test results saved for dashboard');

    // ✅ Check if server file exists before starting
    const serverFile = path.join(process.cwd(), 'server', 'server.js');
    if (fs.existsSync(serverFile)) {
      // Use `start-server-and-test` or simple exec
      exec(`node "${serverFile}"`, (err) => {
        if (err) console.error('❌ Failed to start dashboard server:', err.message);
      });
    } else {
      console.error('❌ server/server.js file not found. Dashboard will not start.');
    }
  }
}
