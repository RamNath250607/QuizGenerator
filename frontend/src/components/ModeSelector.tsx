import React from 'react';
import { FileUp, Sparkles, CheckCircle2 } from 'lucide-react';

export type QuizMode = 'document' | 'topic';

interface ModeSelectorProps {
  selectedMode: QuizMode;
  onSelectMode: (mode: QuizMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto px-4">
      {/* Mode 1: Document Upload (RAG) */}
      <button
        type="button"
        onClick={() => onSelectMode('document')}
        className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
          selectedMode === 'document'
            ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.01]'
            : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <FileUp className="w-6 h-6" />
          </div>
          {selectedMode === 'document' && (
            <span className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active</span>
            </span>
          )}
        </div>

        <h3 className="mt-4 font-bold text-lg text-slate-900 dark:text-white">
          Mode 1: Quiz from Documents
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload PDF, DOCX, or TXT study materials. Extract key knowledge using RAG to generate hyper-relevant questions.
        </p>

        <div className="mt-4 flex items-center space-x-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Supports Multi-page notes & textbook chapters</span>
        </div>
      </button>

      {/* Mode 2: General Topic */}
      <button
        type="button"
        onClick={() => onSelectMode('topic')}
        className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
          selectedMode === 'topic'
            ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.01]'
            : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          {selectedMode === 'topic' && (
            <span className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active</span>
            </span>
          )}
        </div>

        <h3 className="mt-4 font-bold text-lg text-slate-900 dark:text-white">
          Mode 2: Quiz from Any Topic
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          No files required! Enter any subject (DBMS, Python, OS, AI) to create instant custom tests from verified knowledge.
        </p>

        <div className="mt-4 flex items-center space-x-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span>Curated question banks & AI reasoning</span>
        </div>
      </button>
    </div>
  );
};
