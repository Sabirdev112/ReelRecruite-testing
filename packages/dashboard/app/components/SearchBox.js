'use client';
import { Search } from 'lucide-react';

export function SearchBox({ searchTerm, onSearchChange }) {
  return (
    <div className="fixed top-8 right-80 z-[50] w-64">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-indigo-600" size={14} />
        <input 
          type="text" 
          placeholder="Search test case..." 
          value={searchTerm} 
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-card/80 backdrop-blur-md pl-12 pr-4 py-2 rounded-xl border border-border/40 focus:border-indigo-500/50 outline-none text-[10px] font-black uppercase tracking-widest transition-all shadow-xl text-foreground"
        />
      </div>
    </div>
  );
}



