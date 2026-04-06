'use client';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
      <p className="text-muted font-bold tracking-widest text-xs uppercase italic text-muted-foreground/60">Synchronizing Multi-Source Metadata...</p>
    </div>
  );
}



