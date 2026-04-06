'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight,
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Activity,
  ChevronDown,
  ChevronRight,
  Terminal,
  FileText,
  ShieldCheck,
  Zap,
  Cpu,
  Fingerprint,
  RefreshCw,
  AlertCircle,
  PauseCircle,
  AlertTriangle,
  ImageIcon,
  Expand
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReportPage({ params }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const type = searchParams?.get('type') || 'ui';

  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTests, setExpandedTests] = useState({});
  const [rerunning, setRerunning] = useState({});

  const fetchDetails = async () => {
    try {
      const res = await fetch(`/api/run-details/${id}?type=${type}`);
      if (!res.ok) throw new Error('Technical report not found in metadata');
      const data = await res.json();
      setRun(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const toggleExpand = (index) => {
    setExpandedTests(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const rerunTest = async (test) => {
    setRerunning(prev => ({ ...prev, [test.title]: true }));
    try {
      const res = await fetch('/api/rerun-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: test.file, title: test.title })
      });
      const result = await res.json();
      if (result.success) {
        setTimeout(() => {
           window.location.href = '/'; 
        }, 1500);
      }
    } catch (err) {
      console.error('Rerun failed:', err);
      alert('Rerun failed to initiate.');
    } finally {
       setRerunning(prev => ({ ...prev, [test.title]: false }));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4 animate-pulse">
       <div className="w-12 h-12 bg-indigo-600 rounded-2xl rotate-45 animate-spin"></div>
       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Re-assembling Frame...</p>
    </div>
  );
  
  if (error || !run) return (
    <div className="p-20 text-center flex flex-col items-center gap-6 text-foreground">
       <XCircle size={64} className="text-rose-500 opacity-20" />
       <p className="text-xl font-black text-rose-500 italic max-w-sm">{error || 'Data Integrity Violation'}</p>
       <Link href="/" className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-border shadow-sm active:scale-95 bg-secondary text-foreground">Reset to Overview</Link>
    </div>
  );

  const s = run.summary || {};
  const total = s.total || 1;
  const passRate = Math.round((s.passed / total) * 100);

  const failedTests = run.tests.filter(t => t.status === 'failed');

  const donutData = {
    labels: ['Passed', 'Failed', 'Flaky', 'Killed'],
    datasets: [{
      data: [s.passed, s.failed, s.flaky, s.interrupted],
      backgroundColor: ['#22c55e', '#ef4444', '#f59e0b', '#94a3b8'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 pt-6 text-foreground">
      <Link href="/" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-600 transition-all duration-300 transform hover:-translate-x-2">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border shadow-sm border-border/40 text-foreground"><ArrowLeft size={14} /></div>
        Return to Fleet Center
      </Link>

      {/* Hero Header */}
      <div className="premium-card !p-12 bg-indigo-600 text-white border-none shadow-indigo-500/30 shadow-2xl overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12"><Activity size={180} /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <span className="bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black font-mono tracking-widest flex items-center gap-2 border border-white/10 uppercase text-white/90"><Fingerprint size={12}/> {String(id).slice(0, 16).toUpperCase()}</span>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/70 tracking-tighter">
                    <Clock size={12}/> Duration: {Math.round(run.duration / 1000)}s
                  </div>
               </div>
               <h2 className="text-5xl font-black tracking-tighter leading-tight italic">Summary Report<br/></h2>
               <div className="flex items-center gap-3 text-white/80 font-black text-xs uppercase tracking-widest bg-black/10 w-fit px-4 py-2 rounded-xl border border-white/10">
                  <Calendar size={16} className="text-indigo-300" /> 
                  {new Date(run.startedAt).toLocaleString()}
               </div>
            </div>
            
            <div className="flex bg-white/15 backdrop-blur-2xl rounded-3xl p-8 gap-10 items-center justify-center border border-white/10 shadow-2xl w-full md:w-auto shadow-indigo-900/40">
               <div className="text-center">
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-indigo-200 mb-2">Alpha Ratio</p>
                  <p className="text-5xl font-black leading-none">{passRate}%</p>
               </div>
               <div className="w-[1px] h-12 bg-white/20"></div>
               <div className="text-center">
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-indigo-200 mb-2">Spec Count</p>
                  <p className="text-5xl font-black leading-none">{total}</p>
               </div>
            </div>
         </div>
         
         {/* Simple Progress Bar */}
         <div className="mt-12 flex h-2.5 bg-white/15 rounded-full overflow-hidden shadow-inner border border-white/5">
            <div className="bg-emerald-400 h-full transition-all duration-1000" style={{width: `${(s.passed/total)*100}%`}}></div>
            <div className="bg-rose-400 h-full transition-all duration-1000" style={{width: `${(s.failed/total)*100}%`}}></div>
            <div className="bg-amber-400 h-full transition-all duration-1000" style={{width: `${(s.flaky/total)*100}%`}}></div>
         </div>
      </div>

      {/* Cause of Failure Summary Section */}
      {failedTests.length > 0 && (
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8 md:p-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="flex items-center justify-between border-b border-rose-500/20 pb-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <AlertTriangle className="text-white" size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tight text-foreground uppercase italic leading-none">Cause of Failure Analysis</h3>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-rose-500 mt-1">Diagnostic intelligence for {failedTests.length} critical faults</p>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {failedTests.slice(0, 4).map((test, i) => (
                <div key={i} className="bg-card border border-rose-500/10 rounded-3xl p-6 shadow-sm border-l-4 border-l-rose-500 flex flex-col justify-between">
                   <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-[8px] font-black uppercase bg-rose-500 text-white px-2 py-0.5 rounded tracking-tighter">Spec: {i+1}</span>
                         <h5 className="text-xs font-black uppercase tracking-tighter text-foreground truncate">{test.title}</h5>
                      </div>
                      <p className="text-[11px] font-medium text-muted-foreground/80 italic line-clamp-2 leading-relaxed text-foreground text-foreground flex-1">
                         {test.error || "Execution timeout or internal runner crash prevented diagnostic capture."}
                      </p>
                   </div>
                   <button 
                     onClick={() => {
                        // Find this test in the main list to expand it there
                        const fullIndex = run.tests.findIndex(t => t === test);
                        if (fullIndex !== -1) toggleExpand(fullIndex);
                     }}
                     className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-all mt-4 w-fit"
                   >
                      View Deep Specs <ArrowRight size={10} />
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border/40 rounded-3xl p-10 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group text-foreground">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-rose-500 to-amber-500 text-foreground text-foreground"></div>
               <h4 className="text-[10px] items-center gap-2 font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-10 border-b w-full text-center pb-4 flex justify-center border-border/40 text-foreground text-foreground">
                  <ShieldCheck size={14} className="text-indigo-600" /> Integrity Map
               </h4>
               <div className="w-48 h-48 relative flex items-center justify-center">
                  <Doughnut data={donutData} options={{plugins: {legend: {display: false}, tooltip: {enabled: true}}, cutout: '80%'}} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-4xl font-black text-foreground">{passRate}%</span>
                     <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Quality Score</span>
                  </div>
               </div>
               <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 w-full border-t border-dashed pt-8 border-border/40 text-foreground text-foreground">
                  {[
                    { label: 'Passed', val: s.passed, color: 'bg-emerald-500', tColor: 'text-emerald-600' },
                    { label: 'Failed', val: s.failed, color: 'bg-rose-500', tColor: 'text-rose-600' },
                    { label: 'Flaky', val: s.flaky, color: 'bg-amber-500', tColor: 'text-amber-600' },
                    { label: 'Killed', val: s.interrupted, color: 'bg-slate-400', tColor: 'text-slate-500' }
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1 text-foreground">
                       <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-sm ${stat.color}`}></div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                       </div>
                       <p className={`text-2xl font-black ${stat.tColor}`}>{stat.val}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-8 flex flex-col gap-6 text-foreground">
            <div className="flex items-center justify-between mb-2 text-foreground">
               <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 italic text-foreground text-foreground"><FileText size={24} className="text-indigo-600" /> Audit Spec Logs</h3>
               <div className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-rose-500/30 text-rose-600 bg-rose-500/5 rounded-full flex items-center gap-1.5 animate-pulse text-foreground">
                  <Activity size={12}/> Intelligence: Failed specs priority
               </div>
            </div>

            <div className="flex flex-col gap-4 text-foreground">
               {run.tests.map((test, i) => {
                 const isFail = test.status === 'failed';
                 const isExp = expandedTests[i] !== undefined ? expandedTests[i] : isFail;
                 const isRerunning = rerunning[test.title];

                 return (
                   <div key={i} className={`bg-card rounded-3xl overflow-hidden border border-border/40 shadow-sm transition-all duration-300 relative group border-l-8 ${
                     test.status === 'passed' ? 'border-l-emerald-500' : 
                     isFail ? 'border-l-rose-500' : 'border-l-muted'
                   }`}>
                      <div 
                        onClick={() => toggleExpand(i)}
                        className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer hover:bg-secondary/20 transition-all ${isExp ? 'bg-secondary/10' : ''}`}
                      >
                         <div className="flex items-center gap-5">
                            <div className={`p-4 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12 ${
                              test.status === 'passed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                              isFail ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-400 text-white shadow-lg'
                            }`}>
                               {test.status === 'passed' ? <CheckCircle2 size={24}/> : isFail ? <XCircle size={24}/> : <Zap size={24}/>}
                            </div>
                            <div>
                               <p className="font-black text-lg tracking-tighter text-foreground group-hover:text-indigo-600 transition-colors uppercase">{test.title}</p>
                               <div className="flex items-center gap-3 mt-1 underline-offset-4 decoration-border/40">
                                  <p className="text-[10px] text-muted-foreground font-black tracking-[0.1em] flex items-center gap-1 uppercase truncate max-w-[200px] text-foreground"><Terminal size={10}/> {test.file || 'Dynamic source'}</p>
                                  {isFail && <span className="text-[10px] font-black text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm border border-rose-500/5">CRITICAL FAULT DETECTED</span>}
                               </div>
                               {isFail && !isExp && (
                                 <p className="text-[10px] text-rose-500/70 font-bold mt-2 truncate max-w-[400px] italic">
                                    Cause: {test.error ? test.error.split('\n')[0].slice(0, 80) + '...' : 'Unknown error'}
                                 </p>
                               )}
                            </div>
                         </div>
                         <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end text-foreground">
                            <div className="flex gap-6">
                               <div className="flex flex-col">
                                  <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">Latency</span>
                                  <span className="text-sm font-black italic tracking-tighter text-foreground">{(test.duration / 1000).toFixed(2)}s</span>
                               </div>
                               {test.browser && (
                                 <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">Platform</span>
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                      test.browser === 'chromium' ? 'text-yellow-600 border-yellow-500/20 bg-yellow-500/5' :
                                      test.browser === 'firefox' ? 'text-orange-600 border-orange-500/20 bg-orange-500/5' :
                                      test.browser === 'webkit' ? 'text-blue-600 border-blue-500/20 bg-blue-500/5' :
                                      'text-muted-foreground border-border bg-secondary/20'
                                    }`}>{test.browser}</span>
                                 </div>
                               )}
                               <div className="flex flex-col text-right">
                                  <span className="text-[8px] font-black uppercase tracking-widest mb-1 text-muted-foreground">Response</span>
                                  <span className={`text-sm font-black uppercase tracking-tighter ${
                                    test.status === 'passed' ? 'text-emerald-500' : isFail ? 'text-rose-500' : 'text-slate-400'
                                  }`}>{test.status}</span>
                               </div>
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary group-hover:bg-indigo-600/10 transition-colors">
                               {isExp ? <ChevronDown size={20} className="text-indigo-600 shadow-inner" /> : <ChevronRight size={20} className="text-muted-foreground/40" />}
                            </div>
                         </div>
                      </div>

                      {isExp && (
                        <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-4 duration-500">
                           {/* Screenshot Evidence Section */}
                           {test.screenshot && (
                             <div className="mb-8 group/img cursor-zoom-in relative">
                                <div className="absolute top-4 left-4 z-10">
                                   <div className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">
                                      <ImageIcon size={14}/> Visual Evidence: Last Step
                                   </div>
                                </div>
                                <div className="rounded-[2rem] overflow-hidden border-4 border-indigo-600/10 shadow-2xl bg-slate-100 group-hover:border-indigo-600 transition-all duration-500">
                                   <img 
                                     src={test.screenshot} 
                                     alt="Failure Screenshot" 
                                     className="w-full object-cover max-h-[500px] hover:scale-105 transition-transform duration-1000"
                                   />
                                </div>
                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-tighter text-indigo-600 shadow-lg flex items-center gap-2 border border-indigo-600/10">
                                      <Expand size={12}/> Analysis View
                                   </div>
                                </div>
                             </div>
                           )}

                           {test.error && (
                             <div className="bg-slate-900 rounded-3xl p-8 mb-8 border border-white/5 shadow-2xl overflow-hidden relative group/code">
                                <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-500 group-hover/code:scale-150 transition-transform duration-1000"><Terminal size={100}/></div>
                                <div className="relative z-10 space-y-4">
                                   <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                      <div className="flex items-center gap-2 text-rose-400 font-bold">
                                         <Activity size={16}/>
                                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Diagnostic Payload & Snapshot</span>
                                      </div>
                                      <div className="text-[10px] font-mono text-white/40 font-bold truncate uppercase">FAULTING LINE: {test.line || 'UNK_OFFSET'}</div>
                                   </div>
                                   <pre className="text-[11px] text-rose-100/90 font-mono tracking-tight shadow-inner leading-loose whitespace-pre-wrap select-all bg-black/40 p-6 rounded-2xl border border-white/5 italic">
                                      {test.error}
                                   </pre>
                                </div>
                             </div>
                           )}

                           {/* API / Load Response Body */}
                           {(test.responseBody !== undefined || test.statusCode !== undefined) && (
                             <div className="bg-slate-900 rounded-3xl p-8 mb-8 border border-emerald-500/10 shadow-2xl overflow-hidden">
                                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                                   <Activity size={16} className="text-emerald-400" />
                                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">API Response Received</span>
                                   {test.statusCode && (
                                     <span className={`ml-auto text-[10px] font-black px-3 py-1 rounded-full ${
                                       test.statusCode >= 200 && test.statusCode < 300
                                         ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                         : 'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                                     }`}>HTTP {test.statusCode}</span>
                                   )}
                                </div>
                                <pre className="text-[11px] text-emerald-100/80 font-mono tracking-tight leading-loose whitespace-pre-wrap select-all bg-black/40 p-6 rounded-2xl border border-white/5 max-h-[400px] overflow-y-auto">
                                   {typeof test.responseBody === 'object'
                                     ? JSON.stringify(test.responseBody, null, 2)
                                     : test.responseBody || '(empty response)'}
                                </pre>
                             </div>
                           )}

                           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pt-4 text-foreground">
                              <div className="flex flex-wrap gap-3">
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); rerunTest(test); }}
                                   disabled={isRerunning}
                                   className="group relative px-6 py-3 rounded-xl bg-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-600/40 active:scale-95 transition-all flex items-center gap-3 overflow-hidden disabled:opacity-50"
                                 >
                                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                                    {isRerunning ? <RefreshCw size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                                    {isRerunning ? 'Calibrating Test...' : 'Instantiate Re-run Now'}
                                 </button>
                                 <Link 
                                   href="/"
                                   className="px-6 py-3 rounded-xl border border-border/60 bg-secondary/50 font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all active:scale-95 text-foreground"
                                 >
                                    Technical Copy
                                 </Link>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">
                                 <ShieldCheck size={14} className="text-emerald-500"/> Verified Spec Validation Frame 10.4.1.2026
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                 );
               })}
            </div>
         </div>
      </div>
    </div>
  );
}
