import React, { useEffect, useState } from 'react';
import { Award, BookOpen, Clock, FileText, Trash2, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';

import {
  fetchQuizAttemptsFromBackend,
  fetchAnalyticsFromBackend,
  clearQuizHistoryFromBackend,
  type AttemptRecord,
  type AnalyticsData
} from '../services/api';

interface HistoryViewProps {
  onStartNewQuiz: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onStartNewQuiz }) => {
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    const [attList, anaData] = await Promise.all([
      fetchQuizAttemptsFromBackend(),
      fetchAnalyticsFromBackend(),
    ]);
    setAttempts(attList);
    setAnalytics(anaData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear your quiz history? This action cannot be undone.')) {
      await clearQuizHistoryFromBackend();
      setAttempts([]);
      setAnalytics(null);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800">
            Milestone 11: SQLite Database
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Learning History & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track your performance progress, review past scores, and maintain your private test log.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {attempts.length > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={onStartNewQuiz}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate New Quiz</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      {analytics && analytics.total_attempts > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Average Accuracy</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {analytics.avg_percentage}%
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Across all quiz sessions
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Quizzes Taken</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {analytics.total_attempts}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Recorded in SQLite
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase mb-1">
              <Award className="w-4 h-4" />
              <span>Questions Mastered</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {analytics.total_correct_answers}
              <span className="text-sm font-normal text-slate-400"> / {analytics.total_questions_answered}</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Total correct answers
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold uppercase mb-1">
              <Clock className="w-4 h-4" />
              <span>Total Study Time</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {formatTime(analytics.total_time_spent_seconds)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Time actively practicing
            </p>
          </div>
        </div>
      )}

      {/* Attempts List */}
      {isLoading ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          Loading history from SQLite...
        </div>
      ) : attempts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Quiz Attempts Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Take your first test from a document or topic, and your scores, analytics, and study time will be saved automatically here.
          </p>
          <button
            onClick={onStartNewQuiz}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Your First Quiz</span>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-750 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Previous Quiz Attempts ({attempts.length})
            </h3>
            <span className="text-[11px] text-slate-500">Stored locally in SQLite</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-750">
            {attempts.map((att) => {
              const isHigh = att.percentage >= 80;
              const isMid = att.percentage >= 50 && att.percentage < 80;

              return (
                <div
                  key={att.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition-colors"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      {att.mode === 'document' ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {att.title}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {att.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {att.topic_or_document} • {att.total_questions} Questions • {formatTime(att.time_spent_seconds)} • {formatDate(att.completed_at)}
                      </p>
                    </div>
                  </div>

                  {/* Score Badge */}
                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        {att.score} / {att.total_questions}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Correct
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-xl font-black text-sm ${
                        isHigh
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isMid
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {att.percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
