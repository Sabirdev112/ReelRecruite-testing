// Global setup to track which browser each test runs on
// This will be populated before each test runs
export let testBrowserMap = new Map();
export let currentBrowser = 'unknown';

export function setCurrentBrowser(browserName) {
  currentBrowser = browserName;
}

export function getCurrentBrowser() {
  return currentBrowser;
}

export function setTestBrowser(testId, browserName) {
  testBrowserMap.set(testId, browserName);
}

export function getTestBrowser(testId) {
  return testBrowserMap.get(testId) || 'unknown';
}
