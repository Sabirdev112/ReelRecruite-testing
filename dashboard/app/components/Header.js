'use client';
import { LayoutDashboard, Play, Database, Zap, Square } from 'lucide-react';

export function Header({ status, running, onRunAllTests, onRunApiTests, onRunLoadTests, onStop }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-8 mt-6">
      <div>
        <h2 className="text-4xl font-black tracking-tighter mb-2 flex items-center gap-3 text-foreground italic text-foreground">
          <LayoutDashboard size={32} className="text-indigo-600" />Automation Center
        </h2>
        <p className="text-muted text-sm font-medium text-muted-foreground/60 uppercase tracking-widest text-[10px]">Multi-Source Telemetry & Quality Analysis</p>
      </div>
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <button disabled={running} onClick={onRunAllTests} className={`btn bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg active:scale-95 flex items-center gap-3 ${running ? 'opacity-40' : ''}`}>
          <Play fill="currentColor" size={16} /> UI Suite
        </button>
        
        <button disabled={running} onClick={onRunApiTests} className={`btn bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg active:scale-95 flex items-center gap-3 ${running ? 'opacity-40' : ''}`}>
          <Database size={16} /> API Spec
        </button>

        <button disabled={running} onClick={onRunLoadTests} className={`btn bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg active:scale-95 flex items-center gap-3 ${running ? 'opacity-40' : ''}`}>
          <Zap size={16} /> Load Test
        </button>

        {running && (
          <button onClick={onStop} className="btn bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-xl hover:bg-rose-700 active:scale-95 text-[10px] font-black uppercase tracking-widest">
            <Square size={16} fill="white" /> Stop All
          </button>
        )}
      </div>
    </div>
  );
}



