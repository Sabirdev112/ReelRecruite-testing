// Calculate aggregated stats
export function calculateAggregatedStats(allRuns) {
  return allRuns.reduce((acc, run) => {
    const s = run.summary || {};
    acc.passed += s.passed || 0;
    acc.failed += s.failed || 0;
    acc.flaky += s.flaky || 0;
    acc.interrupted += s.interrupted || 0;
    acc.total += s.total || 0;
    acc.duration += run.duration || 0;
    return acc;
  }, { passed: 0, failed: 0, flaky: 0, interrupted: 0, total: 0, duration: 0 });
}

// Calculate pass rate percentage
export function calculatePassRate(stats) {
  return stats.total ? Math.round((stats.passed / stats.total) * 100) : 0;
}

// Calclate average duration
export function calculateAvgDuration(allRuns, stats) {
  return allRuns.length ? (stats.duration / allRuns.length) : 0;
}

// Generate donut chart
export function generateDonutData(stats) {
  return {
      labels: ['Passed', 'Failed', 'Flaky', 'Killed'],
      datasets: [{
      data: [stats.passed, stats.failed, stats.flaky, stats.interrupted],
      backgroundColor: ['#22c55e', '#ef4444', '#f59e0b', '#94a3b8'],
      borderWidth: 0,
      cutout: '75%',
      }],
  };
}

// Generate bar chart
export function generateBarChartData(allRuns) {
    const runsByDay = {};
    allRuns.forEach(run => {
    const d = new Date(run.startedAt);
    const key = d.toISOString().slice(0, 10);
    runsByDay[key] = (runsByDay[key] || 0) + 1;
    });
  
    const sortedDays = Object.keys(runsByDay).sort().slice(-14);
  
  return {
      labels: sortedDays.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
      label: 'Sessions/Day',
      data: sortedDays.map(d => runsByDay[d]),
      backgroundColor: '#6366f1',
      borderRadius: 6,
      }],
  };
}

// Calculate progress percentage for progress bar
export function calculateProgressPercent(status) {
  return status.progress && status.progress.total > 0 
    ? Math.round((status.progress.completed / status.progress.total) * 100) 
    : 0;
}

// Get card data for summary card
export function getSummaryCardsData(allRuns, allTestsCount, passRate, globalAvgDur) {
  return [
    { 
      label: 'Cloud Units', 
      val: allRuns.length, 
      sub: 'Total test sessions', 
      color: 'text-indigo-600' 
    },
    { 
      label: 'Spec Audit', 
      val: allTestsCount, 
      sub: 'Individual specimen count', 
      color: 'text-emerald-600' 
    },
    { 
      label: 'Quality Score', 
      val: `${passRate}%`, 
      sub: 'Global success ratio', 
      color: 'text-indigo-500' 
    },
    { 
      label: 'Avg Time Taken', 
      val: `${(globalAvgDur / 1000).toFixed(1)}s`, 
      sub: 'Across all streams', 
      color: 'text-indigo-600' 
    }
  ];
}


