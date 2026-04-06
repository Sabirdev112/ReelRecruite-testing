'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Zap,
  Globe,
  History,
  Clock,
  Activity
} from 'lucide-react';

export function SpecTable({ title, type, data, runs, searchTerm }) {
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
                {type === 'ui' && <th className="px-10 py-5 text-center">Browser</th>}
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
                  {type === 'ui' && (
                    <td className="px-10 py-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                        test.browser === 'chromium' ? 'text-yellow-700 bg-yellow-500/15 border border-yellow-500/20' :
                        test.browser === 'firefox' ? 'text-orange-700 bg-orange-500/15 border border-orange-500/20' :
                        test.browser === 'webkit' ? 'text-blue-700 bg-blue-500/15 border border-blue-500/20' :
                        'text-white-700 bg-gray-500/15 border border-gray-500/20'
                      }`}>
                        {test.browser || 'unknown'}
                      </span>
                    </td>
                  )}
                  <td className="px-10 py-6 text-center">
                    <span className="font-black text-xs italic text-foreground">{(test.result?.duration / 1000).toFixed(2)}s</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <Link 
                      href={`/report/${test.run_id}?type=${type}`}
                      className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-600 transition-all transform hover:scale-105 text-foreground"
                    >
                      Report <span>→</span>
                    </Link>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={type === 'ui' ? 5 : 4} className="px-10 py-20 text-center italic text-xs font-bold text-muted-foreground/30 uppercase tracking-widest">No matching specimens in current telemetry stream</td>
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



