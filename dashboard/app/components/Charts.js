'use client';
import { TrendingUp } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';

export function Charts({ stats, allRuns, passRate }) {
  const donutData = {
    labels: ['Passed', 'Failed', 'Flaky', 'Killed'],
    datasets: [{
      data: [stats.passed, stats.failed, stats.flaky, stats.interrupted],
      backgroundColor: ['#22c55e', '#ef4444', '#f59e0b', '#94a3b8'],
      borderWidth: 0,
      cutout: '75%',
    }],
  };

  const runsByDay = {};
  allRuns.forEach(run => {
    const d = new Date(run.startedAt);
    const key = d.toISOString().slice(0, 10);
    runsByDay[key] = (runsByDay[key] || 0) + 1;
  });
  const sortedDays = Object.keys(runsByDay).sort().slice(-14);
  const barData = {
    labels: sortedDays.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Sessions/Day',
      data: sortedDays.map(d => runsByDay[d]),
      backgroundColor: '#6366f1',
      borderRadius: 6,
    }],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <div className="lg:col-span-4 bg-card border border-border/40 rounded-3xl p-8 shadow-sm flex flex-col items-center">
        <div className="flex items-center justify-between mb-8 w-full">
          <h4 className="font-black uppercase tracking-widest text-xs flex items-center gap-2 text-foreground">
            <TrendingUp size={14} className="text-indigo-600" /> Integrity Split
          </h4>
        </div>
        <div className="flex-1 min-h-[200px] relative flex items-center justify-center">
          <div className="w-full h-full max-h-[220px]">
            <Doughnut data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-foreground">{passRate}%</span>
            <span className="text-[8px] font-black uppercase text-muted tracking-widest text-muted-foreground/60 text-center">Cloud<br/>Health</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-dashed border-border/40 w-full text-foreground">
          {['Passed', 'Failed', 'Flaky', 'Killed'].map((l, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 rounded-full h-2" style={{ backgroundColor: ['#22c55e', '#ef4444', '#f59e0b', '#94a3b8'][i] }}></div>
                <span className="text-[8px] font-black uppercase tracking-wide text-muted-foreground">{l}</span>
              </div>
              <p className="text-lg font-bold leading-none text-foreground">{[stats.passed, stats.failed, stats.flaky, stats.interrupted][i]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8 bg-card border border-border/40 rounded-3xl p-8 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-10 text-foreground">
          <h4 className="font-black uppercase tracking-widest text-xs mb-1">Execution Velocity</h4>
          <div className="text-[8px] font-black px-3 py-1 bg-indigo-600 text-white rounded-full uppercase tracking-widest text-white">Across 14 Days</div>
        </div>
        <div className="flex-1 min-h-[250px]">
          <Bar 
            data={barData} 
            options={{ 
              maintainAspectRatio: false, 
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, grid: { display: false }, ticks: { font: { weight: 'bold', size: 9 } } },
                x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 9 } } }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
}



