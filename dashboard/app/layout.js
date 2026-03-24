'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 glass border-b border-border/40 p-4 px-8 flex justify-between items-center transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-indigo-500/20">R</div>
            <Link href="/">
               <h1 className="text-xl font-black tracking-tight leading-none bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ReelRecruite</h1>
               <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60">Quality Dashboard</span>
            </Link>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-secondary border border-border shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {theme === 'light' ? <Moon size={18} className="text-slate-700" /> : <Sun size={18} className="text-amber-400" />}
          </button>
        </header>
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
          {children}
        </main>
        <footer className="p-12 border-t border-border/40 text-center opacity-60">
           <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-widest">&copy; {new Date().getFullYear()} ReelRecruite Labs</p>
              <div className="flex gap-4 text-[10px] font-bold text-indigo-600">
                 <span>INFRASTRUCTURE</span>
                 <span>MONITORING</span>
                 <span>QA OPS</span>
              </div>
           </div>
        </footer>
      </body>
    </html>
  );
}
