import fs from 'fs';
import path from 'path';

export function writeFixture(filePath, data) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const newContent = JSON.stringify(data, null, 2);

  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf-8');
    if (existing === newContent) {
      return; // no change
    }
  }

  fs.writeFileSync(filePath, newContent);
}
