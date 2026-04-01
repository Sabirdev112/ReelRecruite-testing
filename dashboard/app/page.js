'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Zap, 
  RotateCcw, 
  History, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  Activity,
  ChevronLeft,
  ChevronRight,
  Square,
  LayoutDashboard,
  Timer,
  AlertCircle,
  PauseCircle,
  FileText,
  Loader2,
  Terminal,
  Fingerprint,
  Database,
  Globe
} from 'lucide-react';
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

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement
);

export default function DashboardPage() {
  const [uiTests, setUiTests] = useState([]);
  const [apiTests, setApiTests] = useState([]);
  const [loadTests, setLoadTests] = useState([]);
  const [uiRuns, setUiRuns] = useState([]);
  const [apiRuns, setApiRuns] = useState([]);
  const [loadRuns, setLoadRuns] = useState([]);
  
  const [status, setStatus] = useState({ running: false, progress: { total: 0, completed: 0, currentTest: '' } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const pollingRef = useRef(null);

  const fetchDashboard = async (silent = false) => {
    if (!silent) setLoading(true);
    
    const safeFetch = async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn(`Fetch failed for ${url}:`, err.message);
        return null;
      }
    };

    try {
      const [
        uiT, apiT, loadT,
        uiR, apiR, loadR,
        stat
      ] = await Promise.all([
        safeFetch('/api/latest-tests?type=ui'),
        safeFetch('/api/latest-tests?type=api'),
        safeFetch('/api/latest-tests?type=load'),
        safeFetch('/api/runs?type=ui'),
        safeFetch('/api/runs?type=api'),
        safeFetch('/api/runs?type=load'),
        safeFetch('/api/status')
      ]);

      if (uiT) setUiTests(uiT);
      if (apiT) setApiTests(apiT);
      if (loadT) setLoadTests(loadT);
      if (uiR) setUiRuns(uiR);
      if (apiR) setApiRuns(apiR);
      if (loadR) setLoadRuns(loadR);
      if (stat) setStatus(stat);

      if (uiT || apiT || loadT || uiR || apiR || loadR || stat) {
        setError(null);
      } else {
        throw new Error('All telemetry streams failed to connect');
      }
    } catch (err) {
      console.error('Core fetch failure:', err);
      setError('Connection disrupted. Synchronizing telemetry nodes...');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const poll = async () => {
      await fetchDashboard(true);
      if (active) setTimeout(poll, 2500);
    };

    fetchDashboard();
    const timeout = setTimeout(poll, 2500);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, []);

  const runAllTests = () => fetch('/api/run-all-tests', { method: 'POST' });
  const runApiTests = () => fetch('/api/run-api-tests', { method: 'POST' });
  const runLoadTests = () => fetch('/api/run-load-tests', { method: 'POST' });
  const stopTests = () => fetch('/api/stop-run', { method: 'POST' });

  // Aggegrated stats
  const allRuns = [...uiRuns, ...apiRuns, ...loadRuns];
  const allTestsCount = uiTests.length + apiTests.length + loadTests.length;
  
  const stats = allRuns.reduce((acc, run) => {
    const s = run.summary || {};
    acc.passed += s.passed || 0;
    acc.failed += s.failed || 0;
    acc.flaky += s.flaky || 0;
    acc.interrupted += s.interrupted || 0;
    acc.total += s.total || 0;
    acc.duration += run.duration || 0;
    return acc;
  }, { passed: 0, failed: 0, flaky: 0, interrupted: 0, total: 0, duration: 0 });

  const passRate = stats.total ? Math.round((stats.passed / stats.total) * 100) : 0;
  const globalAvgDur = allRuns.length ? (stats.duration / allRuns.length) : 0;

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

  const progressPercent = status.progress && status.progress.total > 0 
    ? Math.round((status.progress.completed / status.progress.total) * 100) 
    : 0;

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
          <button disabled={status.running} onClick={runAllTests} className={`btn bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg active:scale-95 flex items-center gap-3 ${status.running ? 'opacity-40' : ''}`}>
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
        {[
          { label: 'Cloud Units', val: allRuns.length, sub: 'Total test sessions', color: 'text-indigo-600' },
          { label: 'Spec Audit', val: allTestsCount, sub: 'Individual specimen count', color: 'text-emerald-600' },
          { label: 'Quality Score', val: `${passRate}%`, sub: 'Global success ratio', color: 'text-indigo-500' },
          { label: 'Avg Time Taken', val: `${(globalAvgDur / 1000).toFixed(1)}s`, sub: 'Across all streams', color: 'text-indigo-600' }
        ].map((card, i) => (
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
    </div>
  );
}

function SpecTable({ title, type, data, runs, searchTerm }) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = data.filter(t => 
    String(t.test_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(t.result?.file || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Mini-Stats Calculation
  const catStats = runs.reduce((acc, r) => {
    const s = r.summary || {};
    acc.passed += s.passed || 0;
    acc.total += s.total || 0;
    acc.duration += r.duration || 0;
    return acc;
  }, { passed: 0, total: 0, duration: 0 });

  const catPassRate = catStats.total ? Math.round((catStats.passed / catStats.total) * 100) : 0;
  const catAvgDur = runs.length ? (catStats.duration / runs.length) : 0;

  const getTypeIcon = () => {
    if (type === 'api') return <Database className="text-emerald-500" size={20} />;
    if (type === 'load') return <Zap className="text-amber-500" size={20} />;
    return <Globe className="text-indigo-500" size={20} />;
  };

  const getThemeColor = () => {
    if (type === 'api') return 'text-emerald-500';
    if (type === 'load') return 'text-amber-500';
    return 'text-indigo-500';
  };

  return (
    <div className="space-y-6">
       {/* Mini Cards Overlay */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Tests Passed', val: catStats.passed, icon: CheckCircle2, color: 'text-emerald-500' },
            { label: 'Total Sessions', val: runs.length, icon: History, color: 'text-slate-400' },
            { label: 'Avg Latency', val: `${(catAvgDur / 1000).toFixed(1)}s`, icon: Clock, color: 'text-slate-400' },
            { label: 'Pass Rate', val: `${catPassRate}%`, icon: Activity, color: getThemeColor() }
          ].map((c, i) => (
            <div key={i} className="bg-card/50 border border-border/40 rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
               <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">{c.label}</p>
                  <p className={`text-lg font-black tracking-tight ${c.color}`}>{c.val}</p>
               </div>
               <c.icon size={16} className="opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all text-foreground" />
            </div>
          ))}
       </div>

       {/* Main Table Structure */}
       <div className="bg-card border border-border/60 rounded-[2.5rem] overflow-hidden shadow-sm relative group hover:border-indigo-500/20 transition-all duration-500">
          <div className="p-8 border-b border-border/40 flex justify-between items-center bg-secondary/10">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform">
                   {getTypeIcon()}
                </div>
                <div>
                   <h4 className="text-lg font-black tracking-tight text-foreground uppercase italic leading-none">{title}</h4>
                   <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1">Telemetry stream source</p>
                </div>
             </div>
             <div className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-black/5 rounded-full border border-black/5 text-muted-foreground/60">
                {filtered.length} Specimens
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-secondary/20 text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 border-b border-border/40">
                      <th className="px-10 py-5">Spec Identification</th>
                      <th className="px-10 py-5 text-center">Status</th>
                      <th className="px-10 py-5 text-center">Latency</th>
                      <th className="px-10 py-5 text-right">Audit Copy</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-foreground">
                  {paginated.map((test, index) => (
                    <tr key={test.id || index} className="hover:bg-secondary/5 transition-colors group/row">
                       <td className="px-10 py-6">
                          <div className="flex flex-col gap-1">
                             <span className="font-black text-[11px] uppercase tracking-tighter text-foreground group-hover/row:text-indigo-600 transition-colors">{test.test_name}</span>
                             <span className="font-mono text-[8px] font-bold text-muted-foreground opacity-50 truncate max-w-[250px]">SPEC: {test.result?.file || 'N/A'}</span>
                          </div>
                       </td>
                       <td className="px-10 py-6 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            test.status === 'passed' ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-600 bg-rose-500/10'
                          }`}>
                            {test.status === 'passed' ? <CheckCircle2 size={10}/> : <XCircle size={10}/>} {test.status}
                          </div>
                       </td>
                       <td className="px-10 py-6 text-center">
                          <span className="font-black text-xs italic text-foreground text-foreground">{(test.result?.duration / 1000).toFixed(2)}s</span>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <Link 
                            href={`/report/${test.run_id}?type=${type}`}
                            className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-600 transition-all transform hover:scale-105 text-foreground"
                          >
                             Report <ArrowRight size={10} />
                          </Link>
                       </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                       <td colSpan="4" className="px-10 py-20 text-center italic text-xs font-bold text-muted-foreground/30 uppercase tracking-widest">No matching specimens in current telemetry stream</td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 bg-secondary/5 border-t border-border/40 flex justify-center items-center gap-4">
               <button onClick={() => setPage(Math.max(1, page - 1))} className="p-2 border rounded-lg disabled:opacity-20 translate-y-0 active:scale-90" disabled={page === 1}><ChevronLeft size={14} /></button>
               <span className="text-[9px] font-black uppercase tracking-[0.2em]">Page {page} / {totalPages}</span>
               <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="p-2 border rounded-lg disabled:opacity-20 translate-y-0 active:scale-90" disabled={page === totalPages}><ChevronRight size={14} /></button>
            </div>
          )}
       </div>
    </div>
  );
}
