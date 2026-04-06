'use client';
import { AlertCircle, RotateCcw } from 'lucide-react';

export function ErrorAlert({ error, onRetry }) {
  if (!error) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xl animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-rose-500/10 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-6 shadow-2xl flex items-center gap-6">
        <div className="bg-rose-600 rounded-2xl p-3 shadow-lg shadow-rose-600/30">
          <AlertCircle size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-black text-rose-600 uppercase tracking-widest text-xs mb-1 italic">Synchronization Blockage</h4>
          <p className="text-sm font-bold text-foreground/80 leading-relaxed">{error}</p>
        </div>
        <button onClick={onRetry} className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-all border border-rose-500/10">
          <RotateCcw size={18} className="text-rose-600 animate-spin" style={{ animationDuration: '3s' }} />
        </button>
      </div>
    </div>
  );
}



