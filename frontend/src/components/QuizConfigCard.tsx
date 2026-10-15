import React from 'react';
import { Sliders, Sparkles, HelpCircle, Flame, ShieldAlert, Layers } from 'lucide-react';


export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed';
export type QuestionType = 'mcq' | 'true_false' | 'mixed';

export interface QuizSettings {
  questionCount: number;
  isCustomCount: boolean;
  difficulty: DifficultyLevel;
  questionType: QuestionType;
  chapterOrSubtopic: string;
  language: string;
}

interface QuizConfigCardProps {
  settings: QuizSettings;
  onChangeSettings: (settings: QuizSettings) => void;
  onGenerate: () => void;
  isLoading?: boolean;
}

const PRESET_COUNTS = [5, 10, 15, 20, 30, 50];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' },
];

export const QuizConfigCard: React.FC<QuizConfigCardProps> = ({
  settings,
  onChangeSettings,
  onGenerate,
  isLoading = false,
}) => {
  const handleCountPreset = (count: number) => {
    onChangeSettings({
      ...settings,
      questionCount: count,
      isCustomCount: false,
    });
  };

  const handleCustomCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const count = isNaN(val) ? 1 : Math.min(Math.max(val, 1), 100);
    onChangeSettings({
      ...settings,
      questionCount: count,
      isCustomCount: true,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-750">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Quiz Parameters & Configuration
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tailor the length, challenge level, and question types to match your study goals.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Question Count */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
            Number of Questions
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COUNTS.map((count) => {
              const active = !settings.isCustomCount && settings.questionCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleCountPreset(count)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105'
                      : 'bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {count} Questions
                </button>
              );
            })}

            {/* Custom Count Toggle/Input */}
            <div className="flex items-center space-x-2 pl-2">
              <span className="text-xs text-slate-400 font-medium">or custom:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.isCustomCount ? settings.questionCount : ''}
                onChange={handleCustomCountChange}
                placeholder="Qty"
                className={`w-20 px-3 py-2 rounded-xl text-sm text-center font-bold border transition-all ${
                  settings.isCustomCount
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 2. Difficulty Selectors */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
            Difficulty Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Easy */}
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, difficulty: 'easy' })}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                settings.difficulty === 'easy'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-800'
              }`}
            >
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <HelpCircle className="w-4 h-4" />
                <span className="font-bold text-sm">Easy</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Core definitions & basic concepts
              </p>
            </button>

            {/* Medium */}
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, difficulty: 'medium' })}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                settings.difficulty === 'medium'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-800'
              }`}
            >
              <div className="flex items-center space-x-2 text-amber-500 mb-1">
                <Flame className="w-4 h-4" />
                <span className="font-bold text-sm">Medium</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Application & conceptual questions
              </p>
            </button>

            {/* Hard */}
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, difficulty: 'hard' })}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                settings.difficulty === 'hard'
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800'
              }`}
            >
              <div className="flex items-center space-x-2 text-rose-500 mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span className="font-bold text-sm">Hard</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tricky edge cases & deep reasoning
              </p>
            </button>

            {/* Mixed */}
            <button
              type="button"
              onClick={() => onChangeSettings({ ...settings, difficulty: 'mixed' })}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                settings.difficulty === 'mixed'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800'
              }`}
            >
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <Layers className="w-4 h-4" />
                <span className="font-bold text-sm">Mixed</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Balanced distribution of all tiers
              </p>
            </button>
          </div>
        </div>

        {/* 3. Question Format (MCQ / True-False / Mixed) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
            Question Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'mcq' as QuestionType, label: 'Multiple Choice (MCQ)', desc: '4 options with 1 correct answer' },
              { type: 'true_false' as QuestionType, label: 'True / False', desc: 'Binary verification statements' },
              { type: 'mixed' as QuestionType, label: 'Mixed Format', desc: 'Variety of MCQs and True/False' },
            ].map((fmt) => {
              const active = settings.questionType === fmt.type;
              return (
                <button
                  key={fmt.type}
                  type="button"
                  onClick={() => onChangeSettings({ ...settings, questionType: fmt.type })}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    active
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-950 dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs sm:text-sm">{fmt.label}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">{fmt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Optional Chapter & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Specific Chapter or Focus Area (Optional)
            </label>
            <input
              type="text"
              value={settings.chapterOrSubtopic}
              onChange={(e) => onChangeSettings({ ...settings, chapterOrSubtopic: e.target.value })}
              placeholder="e.g. Chapter 4: Indexing, B-Trees only"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Quiz Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => onChangeSettings({ ...settings, language: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-750 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Generating <strong className="text-indigo-600 dark:text-indigo-400">{settings.questionCount} {settings.difficulty}</strong> questions in <strong className="text-slate-700 dark:text-slate-200">{settings.questionType.toUpperCase()}</strong> format.
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={onGenerate}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isLoading ? 'Crafting Your Quiz...' : 'Generate Quiz Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
