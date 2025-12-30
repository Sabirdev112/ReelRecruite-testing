let runsData = [];
let currentFilter = 'all';

// ===== Theme Toggle =====
const toggleThemeBtn = document.getElementById('toggleTheme');
const themeIcon = toggleThemeBtn.querySelector('.theme-icon');

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  
  // Save preference
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Update charts if they exist
  if (runsData.length > 0) {
    renderCharts();
  }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeIcon.textContent = '☀️';
}

// ===== Fetch Test Runs =====
fetch('/api/runs')
  .then(res => res.json())
  .then(runs => {
    if (!runs.length) {
      showEmptyState();
      return;
    }
    runsData = runs;
    updateSummaryCards();
    renderCharts();
    populateAllTestsTable();
    setupSearchAndFilter();
  })
  .catch(err => {
    console.error('Failed to load runs:', err);
    showEmptyState();
  });

// ===== Update Summary Cards =====
function updateSummaryCards() {
  // Calculate overall statistics across all runs
  const overallTotal = runsData.reduce((sum, run) => 
    sum + run.summary.passed + run.summary.failed + run.summary.skipped, 0);
  const overallPassed = runsData.reduce((sum, run) => sum + run.summary.passed, 0);
  const overallFailed = runsData.reduce((sum, run) => sum + run.summary.failed, 0);
  const overallSkipped = runsData.reduce((sum, run) => sum + run.summary.skipped, 0);

  updateCard('total', overallTotal);
  updateCard('passed', overallPassed);
  updateCard('failed', overallFailed);
  updateCard('skipped', overallSkipped);
  
  // Update run time with latest run
  if (runsData.length > 0) {
    document.getElementById('runTime').textContent = new Date(runsData[0].startedAt).toLocaleString();
  }
}

// ===== Update Summary Card with Animation =====
function updateCard(id, value) {
  const element = document.getElementById(id);
  const currentValue = parseInt(element.textContent) || 0;
  
  if (currentValue !== value) {
    element.style.transform = 'scale(1.05)';
    setTimeout(() => {
      element.textContent = value;
      element.style.transform = 'scale(1)';
    }, 150);
  } else {
    element.textContent = value;
  }
}

// ===== Populate Table with All Tests =====
function populateAllTestsTable() {
  const tbody = document.getElementById('testTable').querySelector('tbody');
  tbody.innerHTML = '';

  // Flatten all tests from all runs with run information
  const allTests = [];
  runsData.forEach((run, runIndex) => {
    const runNumber = runsData.length - runIndex;
    run.tests.forEach(test => {
      allTests.push({
        ...test,
        runNumber: runNumber,
        runId: run.id
      });
    });
  });

  if (allTests.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="6">
          <div class="empty-content">
            <span class="empty-icon">📭</span>
            <p>No test results to display</p>
            <small>Run your tests to see results here</small>
          </div>
        </td>
      </tr>
    `;
    updateVisibleTestsCount(0);
    return;
  }

  allTests.forEach(test => {
    const row = document.createElement('tr');
    row.dataset.status = test.status;
    row.innerHTML = `
      <td class="col-run">Run #${test.runNumber}</td>
      <td class="col-test">${escapeHtml(test.title)}</td>
      <td class="col-status">
        <span class="status ${getStatusClass(test.status)}">${test.status}</span>
      </td>
      <td class="col-duration">${formatDuration(test.duration)}</td>
      <td class="col-file">${escapeHtml(test.file)}</td>
      <td class="col-error">${test.error ? `<pre>${escapeHtml(test.error)}</pre>` : '<span style="color: var(--text-muted);">-</span>'}</td>
    `;
    tbody.appendChild(row);
  });

  updateVisibleTestsCount(allTests.length);
}

// ===== Populate Table (for filtering) =====
function populateTable(tests) {
  const tbody = document.getElementById('testTable').querySelector('tbody');
  tbody.innerHTML = '';

  if (!tests || tests.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="6">
          <div class="empty-content">
            <span class="empty-icon">📭</span>
            <p>No test results to display</p>
            <small>Run your tests to see results here</small>
          </div>
        </td>
      </tr>
    `;
    updateVisibleTestsCount(0);
    return;
  }

  tests.forEach(test => {
    const row = document.createElement('tr');
    row.dataset.status = test.status;
    row.innerHTML = `
      <td class="col-run">Run #${test.runNumber}</td>
      <td class="col-test">${escapeHtml(test.title)}</td>
      <td class="col-status">
        <span class="status ${getStatusClass(test.status)}">${test.status}</span>
      </td>
      <td class="col-duration">${formatDuration(test.duration)}</td>
      <td class="col-file">${escapeHtml(test.file)}</td>
      <td class="col-error">${test.error ? `<pre>${escapeHtml(test.error)}</pre>` : '<span style="color: var(--text-muted);">-</span>'}</td>
    `;
    tbody.appendChild(row);
  });

  updateVisibleTestsCount(tests.length);
}

// ===== Setup Search and Filter =====
function setupSearchAndFilter() {
  const searchInput = document.getElementById('searchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Search functionality
  searchInput.oninput = () => applyFilters();

  // Filter buttons
  filterButtons.forEach(btn => {
    btn.onclick = () => {
      currentFilter = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    };
  });
}

// ===== Apply Filters =====
function applyFilters() {
  if (!runsData || runsData.length === 0) return;

  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase();
  
  // Flatten all tests from all runs
  const allTests = [];
  runsData.forEach((run, runIndex) => {
    const runNumber = runsData.length - runIndex;
    run.tests.forEach(test => {
      allTests.push({
        ...test,
        runNumber: runNumber,
        runId: run.id
      });
    });
  });
  
  let filteredTests = allTests;
  
  // Apply status filter
  if (currentFilter !== 'all') {
    filteredTests = filteredTests.filter(test => test.status === currentFilter);
  }
  
  // Apply search filter
  if (searchTerm) {
    filteredTests = filteredTests.filter(test => {
      const testName = test.title.toLowerCase();
      const file = test.file.toLowerCase();
      return testName.includes(searchTerm) || file.includes(searchTerm);
    });
  }
  
  // Re-populate table with filtered tests
  populateTable(filteredTests);
}

// ===== Render Charts =====
let barChart, pieChart;

function renderCharts() {
  if (!runsData || runsData.length === 0) return;
  
  const barCtx = document.getElementById('resultChart').getContext('2d');
  const pieCtx = document.getElementById('pieChart').getContext('2d');

  // Calculate overall statistics
  const overallPassed = runsData.reduce((sum, run) => sum + run.summary.passed, 0);
  const overallFailed = runsData.reduce((sum, run) => sum + run.summary.failed, 0);
  const overallSkipped = runsData.reduce((sum, run) => sum + run.summary.skipped, 0);

  const data = [overallPassed, overallFailed, overallSkipped];
  const colors = ['#10b981', '#ef4444', '#6b7280'];

  // Destroy existing charts
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  // Bar Chart
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['Passed', 'Failed', 'Skipped'],
      datasets: [{
        label: 'Number of Tests',
        data: data,
        backgroundColor: colors,
        borderRadius: 8,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14 },
          bodyFont: { size: 13 },
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border')
          }
        },
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
          },
          grid: {
            display: false
          }
        }
      }
    }
  });

  // Pie Chart
  pieChart = new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Passed', 'Failed', 'Skipped'],
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 3,
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-card')
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: { size: 12 },
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14 },
          bodyFont: { size: 13 },
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }
      }
    }
  });
}

// ===== Helper Functions =====

function getStatusClass(status) {
  const statusMap = {
    'passed': 'pass',
    'failed': 'fail',
    'skipped': 'skip'
  };
  return statusMap[status] || 'skip';
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateVisibleTestsCount(count) {
  const visibleTests = document.getElementById('visibleTests');
  visibleTests.textContent = `${count} test${count !== 1 ? 's' : ''} displayed`;
}

function showEmptyState() {
  const tbody = document.getElementById('testTable').querySelector('tbody');
  tbody.innerHTML = `
    <tr class="empty-state">
      <td colspan="6">
        <div class="empty-content">
          <span class="empty-icon">📭</span>
          <p>No test runs available</p>
          <small>Start running your Playwright tests to see results</small>
        </div>
      </td>
    </tr>
  `;
  updateVisibleTestsCount(0);
}