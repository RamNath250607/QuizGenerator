import React from 'react';
import { Sparkles, Brain, Clock, Moon, Sun, Server } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: 'create' | 'history';
  onSelectTab: (tab: 'create' | 'history') => void;
  backendOnline?: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  activeTab,
  onSelectTab,
  backendOnline = null,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-indigo-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('create')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white">
            <Brain className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                QuizCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">AI</span>
              </span>
              <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full font-semibold border border-indigo-200 dark:border-indigo-800">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Intelligent Quiz Generator & RAG Tutor
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Live Backend Status */}
        <nav className="flex items-center space-x-2">
          {/* Backend Health Badge */}
          <div
            className={`hidden md:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border mr-2 ${
              backendOnline === true
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}
            title={backendOnline === true ? "FastAPI server running at http://127.0.0.1:8000" : "FastAPI server offline"}
          >
            <Server className="w-3.5 h-3.5" />
            <span>FastAPI:</span>
            <span className={`w-2 h-2 rounded-full ${backendOnline === true ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>{backendOnline === true ? 'Connected' : 'Offline'}</span>
          </div>

          <button
            onClick={() => onSelectTab('create')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'create'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Quiz</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>History</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
