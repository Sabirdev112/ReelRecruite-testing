import fs from 'fs';
import path from 'path';

/**
 * Recursively finds all Playwright spec files and sorts them numerically
 */
export function getDynamicTestOrder(dir, rootDir) {
  if (!fs.existsSync(dir)) return [];

  const getAllFiles = (currentDir, fileList = []) => {
    const files = fs.readdirSync(currentDir);
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath, fileList);
      } else if (file.endsWith('.spec.js') || file.endsWith('.test.js')) {
        // format relative path for Playwright
        const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
        fileList.push(relativePath);
      }
    });
    return fileList;
  };

  const tests = getAllFiles(dir);

  // Sort numerically based on filename prefixes (01-, 02-)
  return tests.sort((a, b) => {
    const aName = path.basename(a);
    const bName = path.basename(b);
    return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: 'base' });
  });
}
