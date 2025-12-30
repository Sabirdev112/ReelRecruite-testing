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
  const data = fs.existsSync(dataFile)
    ? JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    : [];
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`📊 Dashboard running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
