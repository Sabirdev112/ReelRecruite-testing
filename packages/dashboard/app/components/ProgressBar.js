'use client';
import { Loader2, Chrome, Firefox, Safari } from 'lucide-react';

const getBrowserIcon = (browserName) => {
  switch(browserName?.toLowerCase()) {
    case 'chromium':
      return <Chrome size={16} />;
    case 'firefox':
      return <Firefox size={16} />;
    case 'webkit':
      return <Safari size={16} />;
    default:
      return null;
  }
};

const getBrowserColor = (browserName) => {
  switch(browserName?.toLowerCase()) {
    case 'chromium':
      return 'text-yellow-600 bg-yellow-500/10';
    case 'firefox':
      return 'text-orange-600 bg-orange-500/10';
    case 'webkit':
      return 'text-blue-600 bg-blue-500/10';
    default:
      return 'text-gray-600 bg-gray-500/10';
  }
};

export function ProgressBar({ status, progressPercent, onStop }) {
    if (!status.running || !status.progress || status.progress.total === 0) {
    return null;
  }

  const currentBrowser = status.progress.currentBrowser;
  const browserIcon = getBrowserIcon(currentBrowser);
  const browserColorClass = getBrowserColor(currentBrowser);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-6 pointer-events-none">
      <div className="max-w-3xl mx-auto glass p-6 rounded-3xl shadow-2xl pointer-events-auto border-t-4 border-indigo-600 animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-1 flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
              <Loader2 className="animate-spin" size={12} /> Execution in progress
            </p>
          <div className="flex items-center gap-3">
            <h5 className="text-lg font-black tracking-tight text-foreground truncate max-w-[300px]">
              Running: {status.progress.currentTest || 'Analyzing Spec...'}
              </h5>

              {currentBrowser && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${browserColorClass}`}>
                  {browserIcon}
                  {currentBrowser}
                </div>
                )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black text-muted-foreground uppercase">{status.progress.completed} / {status.progress.total} Complete</p>
            <p className="text-3xl font-black text-indigo-600">{progressPercent}%</p>
          </div>
        </div>

        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-300 ease-out relative" style={{ width: `${progressPercent}%` }}>
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center px-1">
          <span className="text-[9px] font-black text-muted-foreground uppercase opacity-40">System Node: Browser Sequential Audit × 3</span>
          <button onClick={onStop} className="btn bg-rose-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-lg shadow-rose-600/20">Stop</button>
        </div>
      </div>
    </div>
  );
}



