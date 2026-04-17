'use client';
import React from 'react';
import { Monitor, Globe, Compass, X, Zap } from 'lucide-react';

export const RunConfigModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const options = [
    { id: 'chromium', label: 'Chromium', icon: <Monitor size={20} />, color: 'bg-emerald-500', desc: 'Fastest engine, headless optimized.' },
    { id: 'firefox', label: 'Firefox', icon: <Globe size={20} />, color: 'bg-orange-500', desc: 'Gecko engine validation.' },
    { id: 'webkit', label: 'Webkit', icon: <Compass size={20} />, color: 'bg-indigo-500', desc: 'Safari engine (macOS/iOS compatibility).' },
    { id: 'all', label: 'Across All Engines', icon: <Zap size={20} />, color: 'bg-violet-600', desc: 'Full multi-browser matrix audit.' },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full bg-card border border-border/40 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="absolute top-0 right-0 p-8">
           <button 
             onClick={onClose}
             className="p-2.5 rounded-full hover:bg-secondary border border-border transition-all"
             >
             <X size={16} className="text-muted-foreground" />
             </button>
        </div>

        <div className="mb-8">
             <h3 className="text-2xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-3">
             <Zap className="text-indigo-600" /> Configure Suite Run
             </h3>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Select deployment target for the UI validation matrix</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
             {options.map((option) => (
             <button
               key={option.id}
               onClick={() => onConfirm(option.id)}
               className="group flex items-center gap-6 p-6 rounded-3xl bg-secondary/30 hover:bg-secondary/60 border border-border/20 hover:border-indigo-500/30 transition-all text-left active:scale-[0.98]"
               >

               <div className={`w-14 h-14 rounded-2xl ${option.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  {option.icon}
               </div>

               <div className="flex-1">
                  <h4 className="font-black text-foreground uppercase tracking-wider text-sm">{option.label}</h4>
                  <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{option.desc}</p>
               </div>

               <div className="p-2 rounded-full border border-border/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={10} fill="currentColor" />
               </div>
             </button>
           ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex justify-between items-center px-2">
           <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Telemetric Proxy: Active</span>
           <button 
             onClick={onClose}
             className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4"
           >
             Dismiss
           </button>
        </div>
      </div>
    </div>
  );
};

const Play = ({ size, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);
