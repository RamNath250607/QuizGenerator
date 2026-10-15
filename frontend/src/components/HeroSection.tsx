import React from 'react';
import { Sparkles, FileText, Zap, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-10 sm:py-14 text-center">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-72 h-72 bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-72 h-72 bg-cyan-300/30 dark:bg-cyan-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Subtitle Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>AI-Powered Learning Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Master Any Subject with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            Intelligent Quizzes
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Generate interactive practice tests directly from your study notes using RAG, or challenge yourself on any computer science topic with verified questions.
        </p>

        {/* Feature Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
          <div className="flex items-center space-x-1.5 bg-white/90 dark:bg-slate-800/90 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>PDF, DOCX & TXT RAG</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-white/90 dark:bg-slate-800/90 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Instant Question Generation</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-white/90 dark:bg-slate-800/90 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span>Answer Explanations & Sources</span>
          </div>
        </div>
      </div>
    </div>
  );
};
