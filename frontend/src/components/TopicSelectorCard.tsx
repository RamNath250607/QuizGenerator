import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface TopicSelectorCardProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  error?: string | null;
}

const POPULAR_TOPICS = [
  'DBMS & SQL',
  'Python Programming',
  'Artificial Intelligence',
  'Machine Learning',
  'Operating Systems',
  'Data Structures & Algorithms',
  'Computer Networks',
  'Software Engineering',
];

export const TopicSelectorCard: React.FC<TopicSelectorCardProps> = ({
  topic,
  onTopicChange,
  error,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Choose or Enter a Topic</span>
            <span className="text-xs bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-medium px-2 py-0.5 rounded-full">
              General Knowledge
            </span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pick a computer science subject or type any specialized domain
          </p>
        </div>
      </div>

      {/* Text Input */}
      <div className="relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="e.g., Database Normalization, Binary Search Trees, Concurrency in OS..."
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <div className="absolute right-3 top-3 text-slate-400">
          <BookOpen className="w-5 h-5" />
        </div>
      </div>

      {/* Suggested Topic Badges */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Quick Select Suggestions:</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TOPICS.map((item) => {
            const isSelected = topic.toLowerCase() === item.toLowerCase();
            return (
              <button
                key={item}
                type="button"
                onClick={() => onTopicChange(item)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-700/60 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="mt-3 text-xs text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
};
