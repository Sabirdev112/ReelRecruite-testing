'use client';

export function SummaryCards({ allRuns, allTestsCount, passRate, globalAvgDur }) {
  return (
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
  );
}



