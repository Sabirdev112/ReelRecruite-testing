import express from 'express';
import path from 'path';
import fs from 'fs';
import open from 'open';

const app = express();
const PORT = 5173;

const dashboardPath = path.join(process.cwd(), 'dashboard');

app.use(express.static(dashboardPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(dashboardPath, 'index.html'));
});

app.get('/api/runs', (req, res) => {
  const dataFile = path.join(process.cwd(), 'server', 'data', 'runs.json');
  
  if (!fs.existsSync(dataFile)) {
    console.warn('⚠️ runs.json not found at:', dataFile);
    return res.json([]);
  }

  try {
    const rawData = fs.readFileSync(dataFile, 'utf-8');
    let data = JSON.parse(rawData);

    // Ensure runs and tests are arrays
    if (!Array.isArray(data)) {
      console.error('Invalid runs.json format: expected array at root');
      return res.json([]);
    }

    // Preserve full error messages (no truncation, full stack trace)
    // Playwright already includes full error in the JSON report
    // We just make sure we don't accidentally modify or shorten it
    data = data.map(run => ({
      ...run,
      tests: run.tests?.map(test => ({
        ...test,
        // Ensure error is preserved as full string with newlines and details
        error: test.error || null
      })) || []
    }));

    res.json(data);
  } catch (err) {
    console.error('❌ Error reading or parsing runs.json:', err.message);
    res.status(500).json({ error: 'Failed to load test data' });
  }
});

app.listen(PORT, () => {
  console.log(`📊 Dashboard running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});