let runsData = [];
let donutChart, barChart;

// Theme toggle
document.getElementById('themeToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isNowDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isNowDark ? 'dark' : 'light');

  // Update charts with new theme colors
  if (donutChart) donutChart.update();
  if (barChart) {
    // Destroy and re-render bar chart to apply new bar color
    barChart.destroy();
    renderBarChart(runsData);  // Re-render with current runsData
  }
});

if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

// Load data
const isReport = window.location.pathname.includes('report.html');
const urlParams = new URLSearchParams(window.location.search);
const runId = urlParams.get('id');

if (isReport && runId) {
  loadRunReport(runId);
} else {
  loadDashboard();
}

// Real-time update (poll every 30s)
setInterval(() => {
  if (!isReport) loadDashboard(true);
}, 30000);

async function loadDashboard(silent = false) {
  try {
    const res = await fetch('/api/runs');
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    runsData = Array.isArray(data) ? data : data.runs || [];

    if (runsData.length === 0) {
      document.getElementById('runsBody').innerHTML = '<tr><td colspan="8" class="text-center py-8">No runs yet</td></tr>';
      return;
    }

    // Overall stats
    const overall = runsData.reduce((acc, run) => {
      const s = run.summary || {};
      acc.totalTests += s.total || 0;
      acc.passed += s.passed || 0;
      acc.failed += s.failed || 0;
      acc.skipped += s.skipped || 0;
      acc.interrupted += s.interrupted || 0;
      acc.duration += run.duration || 0;
      return acc;
    }, { totalTests: 0, passed: 0, failed: 0, skipped: 0, interrupted: 0, duration: 0 });

    document.getElementById('totalRuns').textContent = runsData.length;
    document.getElementById('totalTests').textContent = overall.totalTests;
    const passRate = overall.totalTests ? Math.round((overall.passed / overall.totalTests) * 100) : 0;
    document.getElementById('passRate').textContent = passRate + '%';
    const avgDur = overall.totalTests ? (overall.duration / overall.totalTests / 1000).toFixed(2) + 's' : '0s';
    document.getElementById('avgDuration').textContent = avgDur;

    // Charts
    renderDonut(overall);
    renderBarChart(runsData);

    // Table
    const tbody = document.getElementById('runsBody');
    tbody.innerHTML = '';
    runsData.forEach(run => {
      const s = run.summary || {};
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-mono">${String(run.id).slice(0, 12)}</td>
        <td>${run.startedAt ? new Date(run.startedAt).toLocaleString() : 'Unknown'}</td>
        <td>${s.total || 0}</td>
        <td><span class="status-circle passed"></span> ${s.passed || 0}</td>
        <td><span class="status-circle failed"></span> ${s.failed || 0}</td>
        <td><span class="status-circle skipped"></span> ${s.skipped || 0}</td>
        <td><span class="status-circle interrupted"></span> ${s.interrupted || 0}</td>
        <td><a href="report.html?id=${run.id}" class="btn-view">View Report →</a></td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    if (!silent) alert('Failed to load data. Check /api/runs endpoint.');
  }
}

async function loadRunReport(runId) {
  try {
    const res = await fetch('/api/runs');
    const data = await res.json();
    const allRuns = Array.isArray(data) ? data : data.runs || [];
    const run = allRuns.find(r => String(r.id) === String(runId));

    if (!run) {
      document.getElementById('runSummary').textContent = 'Run not found';
      return;
    }

    // Run Summary
    document.getElementById('runSummary').textContent = `Total execution duration: ${(run.duration / 1000).toFixed(2)}s | Executed on: ${new Date(run.startedAt).toLocaleString()}`;

    const s = run.summary || {};

    // Status Cards
    document.getElementById('totalTests').textContent = s.total || 0;
    document.getElementById('passedTests').textContent = s.passed || 0;
    document.getElementById('failedTests').textContent = s.failed || 0;
    document.getElementById('skippedTests').textContent = s.skipped || 0;
    document.getElementById('interruptedTests').textContent = s.interrupted || 0;

    // Breakdown bars - Set colors FIRST, then widths (prevents flash)
    const total = s.total || 1;

    document.getElementById('passedFill').style.backgroundColor = '#1aff01ff';
    document.getElementById('failedFill').style.backgroundColor = s.failed > 0 ? '#ff5252' : '#e9ecef';
    document.getElementById('skippedFill').style.backgroundColor = '#fff701ff';
    document.getElementById('interruptedFill').style.backgroundColor = '#c7c7c7ff';

    document.getElementById('passedFill').style.width = `${(s.passed / total) * 100}%`;
    document.getElementById('failedFill').style.width = `${(s.failed / total) * 100}%`;
    document.getElementById('skippedFill').style.width = `${(s.skipped / total) * 100}%`;
    document.getElementById('interruptedFill').style.width = `${((s.interrupted || 0) / total) * 100}%`;

    // Donut Chart - Always show passed segment (light gray)
    const ctx = document.getElementById('runDonut').getContext('2d');
    if (donutChart) donutChart.destroy();

    const donutData = [s.passed || 0];
    const donutColors = ['#1aff01ff']; // passed = light gray

    if (s.failed > 0) {
      donutData.push(s.failed);
      donutColors.push('#ff5252');
    }
    if (s.skipped > 0) {
      donutData.push(s.skipped);
      donutColors.push('#ffd43b');
    }
    if (s.interrupted > 0) {
      donutData.push(s.interrupted);
      donutColors.push('#cacacaff');
    }

    donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: donutData,
          backgroundColor: donutColors,
          borderWidth: 0,
          cutout: '80%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } }
      }
    });

    // Test Details List
    const list = document.getElementById('testsList');
    list.innerHTML = '';
    run.tests.forEach(test => {
      const div = document.createElement('div');
      div.className = `test-item ${test.status}`;
      div.innerHTML = `
        <div class="test-header" onclick="this.parentElement.classList.toggle('expanded')">
          <div class="test-title">
            <span class="status-circle ${test.status}"></span>
            ${escapeHtml(test.title)}
          </div>
          <div class="test-status">
            <span class="status-badge ${test.status}">${test.status.toUpperCase()}</span>
            <span>${formatDuration(test.duration)}</span>
            <span class="expand-icon">›</span>
          </div>
        </div>
        ${test.error ? `
        <div class="test-error">
          <strong>Failure Reason:</strong><br>${escapeHtml(test.error)}<br><br>
          <strong>Location:</strong> ${escapeHtml(test.file || 'Unknown')}
        </div>` : ''}
      `;
      if (test.status === 'failed') div.classList.add('expanded');
      list.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    document.getElementById('runSummary').textContent = 'Error loading report';
  }
}

function renderDonut(overall) {
  const ctx = document.getElementById('statusDonut').getContext('2d');
  if (donutChart) donutChart.destroy();

  const donutData = [];
  const donutColors = [];

  // Exact order to match tooltip labels: Passed, Failed, Skipped, Interrupted
  if (overall.passed > 0) {
    donutData.push(overall.passed);
    donutColors.push('#1aff01ff'); // green
  }
  if (overall.failed > 0) {
    donutData.push(overall.failed);
    donutColors.push('#ff5252'); // red
  }
  if (overall.skipped > 0) {
    donutData.push(overall.skipped);
    donutColors.push('#e8f900ff'); // yellow
  }
  if (overall.interrupted > 0) {
    donutData.push(overall.interrupted);
    donutColors.push('#94a3b8'); // gray
  }

  if (donutData.length === 0) {
    donutData.push(1);
    donutColors.push('#e9ecef');
  }
  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: donutData,
        backgroundColor: donutColors,
        borderWidth: 0,
        cutout: '75%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const labels = ['Passed', 'Failed', 'Skipped', 'Interrupted'];
              return `${labels[context.dataIndex]}: ${context.raw}`;
            }
          }
        }
      }
    }
  });
  console.log('Overall aggregated summary:', overall);
}

function renderBarChart(runs) {
  if (runs.length === 0) return;

  // Group runs by date (YYYY-MM-DD)
  const runsByDay = {};

  runs.forEach(run => {
    if (!run.startedAt) return;
    const date = new Date(run.startedAt);
    const dayKey = date.toISOString().slice(0, 10); // '2025-12-31'

    if (!runsByDay[dayKey]) {
      runsByDay[dayKey] = {
        date,
        count: 0,
        totalTests: 0
      };
    }
    runsByDay[dayKey].count += 1;
    runsByDay[dayKey].totalTests += run.summary?.total || 0;
  });

  // Sort days chronologically (oldest first for natural left-to-right)
  const sortedDays = Object.keys(runsByDay)
    .sort((a, b) => new Date(a) - new Date(b));

  // Limit to last 30 days to avoid overcrowding (adjust if needed)
  const recentDays = sortedDays.slice(-30);

  const labels = recentDays.map(day => {
    const date = new Date(day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  });

  // You can choose: number of RUNS per day OR total TESTS per day
  const data = recentDays.map(day => runsByDay[day].count); // ← Change to .totalTests if you want sum of tests

  const ctx = document.getElementById('testsBar').getContext('2d');
  if (barChart) barChart.destroy();

  const isDark = document.body.classList.contains('dark');
  const barColor = isDark ? '#ffffff' : '#1e293b';

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Runs per day',
        data: data,
        backgroundColor: barColor,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.85,
        categoryPercentage: 0.9
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => {
              const dayKey = recentDays[items[0].dataIndex];
              return new Date(dayKey).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            },
            label: (item) => `${item.raw} test run${item.raw === 1 ? '' : 's'} executed`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#64748b',
            font: { size: 12 },
            maxRotation: 45,
            minRotation: 0
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#64748b',
            font: { size: 12 },
            stepSize: 1,
            precision: 0
          },
          grid: {
            color: '#e2e8f0',
            drawBorder: false
          },
          title: {
            display: true,
            text: 'Test Runs per Day',
            color: '#64748b',
            font: { size: 13, weight: '600' }
          }
        }
      }
    }
  });
}

function formatDuration(ms) {
  return ms ? (ms / 1000).toFixed(2) + 'ms' : '0ms';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Manual refresh
async function refreshData() {
  await loadDashboard();
  console.log('Data refreshed at', new Date().toLocaleString());
}