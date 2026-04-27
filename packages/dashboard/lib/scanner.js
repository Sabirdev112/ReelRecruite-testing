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
  // This ensures that 01-Signup.spec.js runs before Recruiter/02-ForgetPassword.spec.js
  return tests.sort((a, b) => {
    const aName = path.basename(a);
    const bName = path.basename(b);
    
    // Extract numbers from the start of the filenames
    const aNum = parseInt(aName.match(/^\d+/)?.[0] || '999', 10);
    const bNum = parseInt(bName.match(/^\d+/)?.[0] || '999', 10);
    
    if (aNum !== bNum) {
      return aNum - bNum;
    }
    
    return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: 'base' });
  });
}
