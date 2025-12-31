let runsData = [];
let donutChart, barChart;

let currentPage = 1;
let pageSize = 25;

function setRunUI(isRunning, { force = false } = {}) {
  if (isRunning) {
    activateStopButton();
    localStorage.setItem('fullRunInProgress', 'true');
    localStorage.setItem('runLocked', 'true');
  } else {
    if (force) {
      resetRunButtons();
      localStorage.removeItem('fullRunInProgress');
      localStorage.removeItem('runLocked');
    } else {
      // only clear if not locked by a user action
      if (!localStorage.getItem('runLocked')) {
        resetRunButtons();
        localStorage.removeItem('fullRunInProgress');
      }
    }
  }
}

// Theme toggle
document.getElementById('themeToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');

  if (donutChart) donutChart.update();
  if (barChart) {
    barChart.destroy();
    renderRunsPerDayChart(runsData);
  }
});

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

// Load data
const isReport = window.location.pathname.includes('report.html');
const urlParams = new URLSearchParams(window.location.search);
const runId = urlParams.get('id');

// Defer loading data until window 'load' so optimistic UI restore runs first
// (actual load is triggered in the load event handler below)

// Polling will be started after window load so optimistic UI restoration runs first

async function loadDashboard(silent = false) {
  try {
    const res = await fetch('/api/runs');
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    runsData = Array.isArray(data) ? data : data.runs || [];

    if (runsData.length === 0) {
      document.getElementById('runsBody').innerHTML = '<tr><td colspan="8" class="text-center py-8">No runs yet</td></tr>';
      document.getElementById('paginationInfo').textContent = 'Showing 0 to 0 of 0 entries';
      document.getElementById('pagination').innerHTML = '';
      return;
    }

    // Calculate overall stats
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

    renderDonut(overall);
    renderRunsPerDayChart(runsData);

    const totalRuns = runsData.length;
    const totalPages = Math.ceil(totalRuns / pageSize);

    renderTablePage(currentPage, pageSize);
    renderPagination(currentPage, totalPages);
    updatePaginationInfo(currentPage, pageSize, totalRuns);

    // Determine if a full run is currently running
    const latestRun = runsData[0];
    const isCurrentlyRunning =
      latestRun &&
      (latestRun.endedAt == null || latestRun.status === 'running');

    console.debug('[dashboard] latestRun:', latestRun ? { id: latestRun.id, status: latestRun.status, endedAt: latestRun.endedAt } : null);
    console.debug('[dashboard] isCurrentlyRunning:', isCurrentlyRunning, 'runLocked:', !!localStorage.getItem('runLocked'));

    // Only enable the running UI when a run is detected. Do not automatically clear the locked state
    // on refresh — keep the Run button disabled until the user explicitly presses Stop.
    if (isCurrentlyRunning) setRunUI(true);

  } catch (err) {
    console.error('Dashboard load error:', err);
    // Do nothing — preserve current button state on error
  }
}

// Activate "running" UI
function activateStopButton() {
  const runAllBtn = document.getElementById('runAllTests');
  const stopBtn = document.getElementById('stopRun');

  if (runAllBtn) {
    runAllBtn.disabled = true;
    runAllBtn.textContent = 'Running All Tests...';
  }
  if (stopBtn) {
    stopBtn.style.display = 'inline-block';
    stopBtn.disabled = false;
    stopBtn.textContent = 'Stop Run';
  }
}

// Reset to idle state
function resetRunButtons() {
  const runAllBtn = document.getElementById('runAllTests');
  const stopBtn = document.getElementById('stopRun');

  if (runAllBtn) {
    runAllBtn.disabled = false;
    runAllBtn.textContent = 'Run All Tests';
  }
  if (stopBtn) {
    stopBtn.style.display = 'inline-block';
    stopBtn.disabled = true;
    stopBtn.textContent = 'Stop Run';
  }
}

// Run All Tests — only alert on real failure
document.getElementById('runAllTests')?.addEventListener('click', async () => {
  const runAllBtn = document.getElementById('runAllTests');
  const stopBtn = document.getElementById('stopRun');

  if (runAllBtn.disabled) return;

  // set UI state immediately and persist
  setRunUI(true);

  try {
    const response = await fetch('/api/run-all-tests', { method: 'POST' });
    if (!response.ok) throw new Error('Failed');

    // Confirm run actually started — poll backend for up to 10 seconds
    let started = false;
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 1000));
      try {
        const res = await fetch('/api/runs');
        if (!res.ok) continue;
        const data = await res.json();
        const latest = Array.isArray(data) ? data[0] : (data.runs || [])[0];
        if (latest && (latest.endedAt == null || latest.status === 'running')) {
          started = true;
          break;
        }
      } catch (e) {
        // ignore individual poll errors
      }
    }

    if (!started) {
      // couldn't detect a started run — keep UI locked until user stops; log for debugging
      console.warn('Failed to detect started run after POST /api/run-all-tests. Server may be slow or down.');
    }
    } catch (err) {
    console.error('Failed to start full test run', err);
    // rollback immediately on failure
    setRunUI(false, { force: true });
  }
});

// Stop Run
document.getElementById('stopRun')?.addEventListener('click', async () => {
  const stopBtn = document.getElementById('stopRun');
  stopBtn.disabled = true;
  stopBtn.textContent = 'Stopping...';

  try {
    const response = await fetch('/api/stop-run', { method: 'POST' });
    if (response.ok) {
      alert('Test run stopped successfully');
    } else {
      alert('Stop command sent, but response was not OK');
    }
  } catch (err) {
    alert('Failed to send stop command');
  } finally {
    await loadDashboard();
    // user pressed Stop — force UI reset
    setRunUI(false, { force: true });
  }
});

// Restore UI immediately on page load/refresh
window.addEventListener('load', () => {
  // optimistic restore (instant)
  if (localStorage.getItem('fullRunInProgress') === 'true') {
    setRunUI(true);
  }

  // backend confirmation: load dashboard or report after optimistic UI restore
  if (isReport && runId) {
    loadRunReport(runId);
  } else {
    loadDashboard();
  }

  // start polling after initial load
  setInterval(() => {
    if (!isReport) loadDashboard(true);
  }, 5000);
});

// === Rest of your functions (unchanged) ===

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

    document.getElementById('runSummary').textContent = 
      `Total duration: ${(run.duration / 1000).toFixed(2)}s | Executed on: ${new Date(run.startedAt).toLocaleString()}`;

    const s = run.summary || {};
    document.getElementById('totalTests').textContent = s.total || 0;
    document.getElementById('passedTests').textContent = s.passed || 0;
    document.getElementById('failedTests').textContent = s.failed || 0;
    document.getElementById('skippedTests').textContent = s.skipped || 0;
    document.getElementById('interruptedTests').textContent = s.interrupted || 0;

    const total = s.total || 1;
    document.getElementById('passedFill').style.width = `${(s.passed / total) * 100}%`;
    document.getElementById('failedFill').style.width = `${(s.failed / total) * 100}%`;
    document.getElementById('skippedFill').style.width = `${(s.skipped / total) * 100}%`;
    document.getElementById('interruptedFill').style.width = `${((s.interrupted || 0) / total) * 100}%`;

    renderRunDonut(s);

    const list = document.getElementById('testsList');
    list.innerHTML = '';
    run.tests.forEach(test => {
      const div = document.createElement('div');
      div.className = `test-item ${test.status}`;
      if (test.status === 'failed') div.classList.add('expanded');

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
          <strong>Location:</strong> ${escapeHtml(test.file || 'Unknown')}:${test.line || '?'}
        </div>` : ''}
        <div class="test-rerun">
          <button class="btn-rerun" onclick="rerunTest(event, '${escapeHtml(test.file || '')}', '${escapeHtml(test.title)}', this)">
            🔄 Re-run This Test
          </button>
          <span class="rerun-status"></span>
        </div>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error('Report load error:', err);
    document.getElementById('runSummary').textContent = 'Error loading report';
  }
}

function renderDonut(overall) {
  const ctx = document.getElementById('statusDonut')?.getContext('2d');
  if (!ctx) return;

  if (donutChart) donutChart.destroy();

  const data = [];
  const colors = [];
  if (overall.passed > 0) { data.push(overall.passed); colors.push('#1aff01ff'); }
  if (overall.failed > 0) { data.push(overall.failed); colors.push('#ff5252'); }
  if (overall.skipped > 0) { data.push(overall.skipped); colors.push('#e8f900ff'); }
  if (overall.interrupted > 0) { data.push(overall.interrupted); colors.push('#94a3b8'); }
  if (data.length === 0) { data.push(1); colors.push('#e9ecef'); }

  requestAnimationFrame(() => {
    donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: { datasets: [{ data, backgroundColor: colors, borderWidth: 0, cutout: '75%' }] },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } }
      }
    });
    setTimeout(() => donutChart?.resize(), 100);
  });
}

function renderRunDonut(summary) {
  const ctx = document.getElementById('runDonut')?.getContext('2d');
  if (!ctx) return;

  if (donutChart) donutChart.destroy();

  const data = [summary.passed || 0];
  const colors = ['#1aff01ff'];
  if (summary.failed > 0) { data.push(summary.failed); colors.push('#ff5252'); }
  if (summary.skipped > 0) { data.push(summary.skipped); colors.push('#ffd43b'); }
  if (summary.interrupted > 0) { data.push(summary.interrupted); colors.push('#cacacaff'); }

  requestAnimationFrame(() => {
    donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: { datasets: [{ data, backgroundColor: colors, borderWidth: 0, cutout: '80%' }] },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } }
      }
    });
    setTimeout(() => donutChart?.resize(), 100);
  });
}

function renderRunsPerDayChart(runs) {
  const ctx = document.getElementById('testsBar')?.getContext('2d');
  if (!ctx || runs.length === 0) return;

  if (barChart) barChart.destroy();

  const runsByDay = {};
  runs.forEach(run => {
    const date = new Date(run.startedAt);
    const dayKey = date.toISOString().slice(0, 10);
    runsByDay[dayKey] = (runsByDay[dayKey] || 0) + 1;
  });

  const sortedDays = Object.keys(runsByDay).sort();
  const recentDays = sortedDays.slice(-30);

  const labels = recentDays.map(day => {
    const date = new Date(day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const data = recentDays.map(day => runsByDay[day]);

  const isDark = document.body.classList.contains('dark');
  const barColor = isDark ? '#ffffff' : '#1e293b';

  requestAnimationFrame(() => {
    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: barColor,
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.8,
          categoryPercentage: 0.9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: item => `Test runs: ${item.raw}` } }
        },
        scales: {
          x: { ticks: { color: '#64748b' }, grid: { display: false } },
          y: {
            beginAtZero: true,
            ticks: { color: '#64748b', stepSize: 1 },
            grid: { color: '#e2e8f0' },
            title: { display: true, text: 'Test Runs Per Day', color: '#64748b' }
          }
        }
      }
    });
    setTimeout(() => barChart?.resize(), 100);
  });
}

function renderTablePage(page, size) {
  const start = (page - 1) * size;
  const end = start + size;
  const pageRuns = runsData.slice(start, end);

  const tbody = document.getElementById('runsBody');
  tbody.innerHTML = '';
  pageRuns.forEach(run => {
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
}

function renderPagination(currentPage, totalPages) {
  const container = document.getElementById('pagination');
  if (!container) return;
  container.innerHTML = '';

  if (totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.textContent = 'Previous';
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    currentPage--;
    renderTablePage(currentPage, pageSize);
    renderPagination(currentPage, totalPages);
    updatePaginationInfo(currentPage, pageSize, runsData.length);
    window.scrollTo(0, 0);
  };
  container.appendChild(prev);

  const maxVisible = 7;
  let start = Math.max(1, currentPage - 3);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  if (start > 1) {
    addPageButton(1);
    if (start > 2) addEllipsis();
  }

  for (let i = start; i <= end; i++) addPageButton(i);

  if (end < totalPages) {
    if (end < totalPages - 1) addEllipsis();
    addPageButton(totalPages);
  }

  const next = document.createElement('button');
  next.textContent = 'Next';
  next.disabled = currentPage === totalPages;
  next.onclick = () => {
    currentPage++;
    renderTablePage(currentPage, pageSize);
    renderPagination(currentPage, totalPages);
    updatePaginationInfo(currentPage, pageSize, runsData.length);
    window.scrollTo(0, 0);
  };
  container.appendChild(next);

  function addPageButton(num) {
    const btn = document.createElement('button');
    btn.textContent = num;
    btn.classList.toggle('active', num === currentPage);
    btn.onclick = () => {
      currentPage = num;
      renderTablePage(currentPage, pageSize);
      renderPagination(currentPage, totalPages);
      updatePaginationInfo(currentPage, pageSize, runsData.length);
      window.scrollTo(0, 0);
    };
    container.appendChild(btn);
  }

  function addEllipsis() {
    const span = document.createElement('span');
    span.textContent = '...';
    span.style.padding = '0 0.5rem';
    container.appendChild(span);
  }
}

function updatePaginationInfo(page, size, total) {
  const info = document.getElementById('paginationInfo');
  if (!info) return;
  const start = (page - 1) * size + 1;
  const end = Math.min(page * size, total);
  info.textContent = `Showing ${start} to ${end} of ${total} entries`;
}

document.getElementById('pageSizeSelect')?.addEventListener('change', (e) => {
  pageSize = parseInt(e.target.value);
  currentPage = 1;
  const totalPages = Math.ceil(runsData.length / pageSize);
  renderTablePage(currentPage, pageSize);
  renderPagination(currentPage, totalPages);
  updatePaginationInfo(currentPage, pageSize, runsData.length);
});

async function rerunTest(event, file, title, button) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const statusEl = button.nextElementSibling;
  statusEl.textContent = 'Running test...';
  statusEl.style.display = 'inline';
  statusEl.style.color = '#64748b';
  button.disabled = true;
  button.textContent = 'Running...';

  try {
    const response = await fetch('/api/rerun-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, title })
    });

    const result = await response.json();

    if (result.success) {
      // Show stop UI immediately when a rerun is accepted
      setRunUI(true);

      statusEl.textContent = 'Completed! Loading new results...';
      statusEl.style.color = '#22c55e';

      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        try {
          const res = await fetch('/api/runs');
          const data = await res.json();
          const latest = data[0];
          if (latest && latest.id !== runId) {
            clearInterval(interval);
            window.location.href = `report.html?id=${latest.id}`;
          }
        } catch (e) {}

        if (attempts > 20) {
          clearInterval(interval);
          location.reload();
        }
      }, 1000);
    } else {
      statusEl.textContent = 'Failed';
      statusEl.style.color = '#ef4444';
    }
  } catch (err) {
    statusEl.textContent = 'Error';
    statusEl.style.color = '#ef4444';
    console.error(err);
  } finally {
    setTimeout(() => {
      button.disabled = false;
      button.textContent = '🔄 Re-run This Test';
    }, 10000);
  }
}

function formatDuration(ms) {
  return ms ? (ms / 1000).toFixed(2) + 's' : '0s';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}