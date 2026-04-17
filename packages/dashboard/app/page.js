'use client';
import { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  AlertCircle,
  RotateCcw,
  Loader2,
  LayoutDashboard,
  Play,
  Database,
  Zap,
  Square,
  Search,
  TrendingUp,
} from 'lucide-react';
import { SpecTable } from './components/SpecTable';
import { RunConfigModal } from './components/RunConfigModal';
import { useDashboardData } from './hooks/useDashboardData';
import {
  calculateAggregatedStats,
  calculatePassRate,
  calculateAvgDuration,
  generateDonutData,
  generateBarChartData,
  calculateProgressPercent,
  getSummaryCardsData,
} from './utils/dashboardUtils';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement
);

const API_ENDPOINTS = {
  runAllTests: '/api/run-all-tests',
  runApiTests: '/api/run-api-tests',
  runLoadTests: '/api/run-load-tests',
  stopRun: '/api/stop-run',
};

export default function DashboardPage() {
  const {
    uiTests, apiTests, loadTests,
    uiRuns, apiRuns, loadRuns,
    status, error, loading, fetchDashboard, fetchStatus
  } = useDashboardData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const runAllTests = async (browser = 'all') => {
    setIsConfigModalOpen(false);
    const res = await fetch(API_ENDPOINTS.runAllTests, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ browser })
    });
    if (res.ok) {
        fetchStatus();
        fetchDashboard(true);
    }
  };

  const runApiTests = async () => {
    const res = await fetch(API_ENDPOINTS.runApiTests, { method: 'POST' });
    if (res.ok) {
        fetchStatus();
        fetchDashboard(true);
    }
  };

  const runLoadTests = async () => {
    const res = await fetch(API_ENDPOINTS.runLoadTests, { method: 'POST' });
    if (res.ok) {
        fetchStatus();
        fetchDashboard(true);
    }
  };

  const stopTests = async () => {
    const res = await fetch(API_ENDPOINTS.stopRun, { method: 'POST' });
    if (res.ok) {
        fetchStatus();
        fetchDashboard(true);
    }
  };

  // Aggregate all data
  const allRuns = [...uiRuns, ...apiRuns, ...loadRuns];
  const allTestsCount = uiTests.length + apiTests.length + loadTests.length;
  const stats = calculateAggregatedStats(allRuns);
  const passRate = calculatePassRate(stats);
  const globalAvgDur = calculateAvgDuration(allRuns, stats);
  const progressPercent = calculateProgressPercent(status);
  
  // Generate chart data
  const donutData = generateDonutData(stats);
  const barData = generateBarChartData(allRuns);
  const summaryCardsData = getSummaryCardsData(allRuns, allTestsCount, passRate, globalAvgDur);

  if (loading && uiTests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-pulse">
         <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
         <p className="text-muted font-bold tracking-widest text-xs uppercase italic text-muted-foreground/60">Synchronizing Multi-Source Metadata...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Error Alert Overlay */}
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-rose-500/10 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-6 shadow-2xl flex items-center gap-6">
            <div className="bg-rose-600 rounded-2xl p-3 shadow-lg shadow-rose-600/30">
               <AlertCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
               <h4 className="font-black text-rose-600 uppercase tracking-widest text-xs mb-1 italic">Synchronization Blockage</h4>
               <p className="text-sm font-bold text-foreground/80 leading-relaxed">{error}</p>
            </div>
            <button onClick={() => fetchDashboard()} className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-all border border-rose-500/10">
               <RotateCcw size={18} className="text-rose-600 animate-spin" style={{ animationDuration: '3s' }} />
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar Container */}
      {status.running && status.progress && status.progress.total > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-6 pointer-events-none">
            <div className="max-w-3xl mx-auto glass p-6 rounded-3xl shadow-2xl pointer-events-auto border-t-4 border-indigo-600 animate-in slide-in-from-bottom-10 duration-500">
              <div className="flex justify-between items-end mb-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                      <Loader2 className="animate-spin" size={12} /> Execution in progress
                    </p>
                    <h5 className="text-lg font-black tracking-tight text-foreground truncate max-w-[400px]">
                      Running: {status.progress.currentTest || 'Analyzing Spec...'}
                    </h5>
                  </div>

                  <div className="text-right">
                     <p className="text-[10px] font-black text-muted-foreground uppercase">{status.progress.completed} / {status.progress.total} Complete</p>
                     <p className="text-3xl font-black text-indigo-600">{progressPercent}%</p>
                  </div>
              </div>

                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-1000 ease-out relative" style={{ width: `${progressPercent}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>

              <div className="mt-4 flex justify-between items-center px-1">
                <span className="text-[9px] font-black text-muted-foreground uppercase opacity-40">System Node: Audit Session X3</span>
                <button onClick={stopTests} className="btn bg-rose-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-lg shadow-rose-600/20">Stop</button>
              </div>
            </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-8 mt-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2 flex items-center gap-3 text-foreground italic text-foreground">
            <LayoutDashboard size={32} className="text-indigo-600" />Automation Center
          </h2>
          <p className="text-muted text-sm font-medium text-muted-foreground/60 uppercase tracking-widest text-[10px]">Multi-Source Telemetry & Quality Analysis</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            disabled={status.running} 
            onClick={() => setIsConfigModalOpen(true)} 
            className={`btn bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg active:scale-95 flex items-center gap-3 ${status.running ? 'opacity-40' : ''}`}
            >
            <Play fill="currentColor" size={16} /> UI Suite
          </button>
          
          <button disabled={status.running} onClick={runApiTests} className={`btn bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg active:scale-95 flex items-center gap-3 ${status.running ? 'opacity-40' : ''}`}>
            <Database size={16} /> API Spec
          </button>

          <button disabled={status.running} onClick={runLoadTests} className={`btn bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg active:scale-95 flex items-center gap-3 ${status.running ? 'opacity-40' : ''}`}>
            <Zap size={16} /> Load Test
          </button>

          {status.running && (
            <button onClick={stopTests} className="btn bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-xl hover:bg-rose-700 active:scale-95 text-[10px] font-black uppercase tracking-widest">
              <Square size={16} fill="white" /> Stop All
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-foreground">
        {summaryCardsData.map((card, i) => (
          <div key={i} className="premium-card !p-8 border-none bg-card relative overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-sm">
            <h4 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 mb-1">{card.label}</h4>
            <h3 className={`text-4xl font-black ${card.color} tracking-tighter`}>{card.val}</h3>
            <p className="text-[10px] font-bold text-muted mt-2 uppercase tracking-tighter text-muted-foreground/40">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
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

      {/* Tables Section */}
      <div className="space-y-12">
        <SpecTable title="UI Validation Logs" type="ui" data={uiTests} runs={uiRuns} searchTerm={searchTerm} />
        <SpecTable title="API Integrity Logs" type="api" data={apiTests} runs={apiRuns} searchTerm={searchTerm} />
        <SpecTable title="Load Stress Logs" type="load" data={loadTests} runs={loadRuns} searchTerm={searchTerm} />
      </div>

      {/* Fixed Search */}
      <div className="fixed top-8 right-80 z-[50] w-64">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-indigo-600" size={14} />
            <input 
              type="text" placeholder="Search test case..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card/80 backdrop-blur-md pl-12 pr-4 py-2 rounded-xl border border-border/40 focus:border-indigo-500/50 outline-none text-[10px] font-black uppercase tracking-widest transition-all shadow-xl text-foreground text-foreground"
            />
        </div>
      </div>

      <RunConfigModal 
        isOpen={isConfigModalOpen} 
        onClose={() => setIsConfigModalOpen(false)} 
        onConfirm={runAllTests} 
      />
    </div>
  );
}



