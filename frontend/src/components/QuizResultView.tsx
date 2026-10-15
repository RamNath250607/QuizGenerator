import React from 'react';
import type { QuizData, QuizScoreSummary } from '../types/quiz';

import { Award, CheckCircle2, XCircle, MinusCircle, Clock, RotateCcw, PlusCircle, BookOpen } from 'lucide-react';

interface QuizResultViewProps {
  quiz: QuizData;
  userAnswers: Record<string, number | null>;
  summary: QuizScoreSummary;
  onRetake: () => void;
  onNewQuiz: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  quiz,
  userAnswers,
  summary,
  onRetake,
  onNewQuiz,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  // Score badge style
  const isHigh = summary.percentage >= 80;
  const isMid = summary.percentage >= 50 && summary.percentage < 80;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner / Score Ring Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm text-center relative overflow-hidden">
        {/* Decorative backdrop */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Quiz Completed!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {quiz.title} • {quiz.topicOrDocument}
          </p>

          {/* Large Score Metric */}
          <div className="my-6 inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-750">
            <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              {summary.percentage}%
            </div>
            <div className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              Score: {summary.score} / {summary.total} Correct
            </div>
            <div
              className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                isHigh
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : isMid
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {isHigh
                ? '🌟 Outstanding Master!'
                : isMid
                ? '👍 Good Effort! Review the missed questions'
                : '💪 Needs Practice! Keep studying the material'}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Correct</span>
              </div>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {summary.correctCount}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-rose-600 dark:text-rose-400 mb-1">
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Incorrect</span>
              </div>
              <p className="text-xl font-extrabold text-rose-700 dark:text-rose-300">
                {summary.incorrectCount}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-slate-500 dark:text-slate-400 mb-1">
                <MinusCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Skipped</span>
              </div>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-300">
                {summary.skippedCount}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-indigo-600 dark:text-indigo-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Time</span>
              </div>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300">
                {formatTime(summary.timeSpentSeconds)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onRetake}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              type="button"
              onClick={onNewQuiz}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Question Review List */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Detailed Review & Source References</span>
        </h3>

        <div className="space-y-6">
          {quiz.questions.map((q, idx) => {
            const userChoice = userAnswers[q.id];
            const isCorrect = userChoice === q.correctAnswerIndex;
            const isSkipped = userChoice === null || userChoice === undefined;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
              >
                {/* Header status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Question {idx + 1}
                  </span>
                  <div>
                    {isCorrect && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    )}
                    {!isCorrect && !isSkipped && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </span>
                    )}
                    {isSkipped && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                        <MinusCircle className="w-3.5 h-3.5" />
                        <span>Skipped</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  {q.questionText}
                </h4>

                {/* Options display with indicators */}
                <div className="space-y-2 mb-4">
                  {q.options.map((opt, optIdx) => {
                    const isUserPick = userChoice === optIdx;
                    const isTheCorrectOne = q.correctAnswerIndex === optIdx;

                    let optionStyle = 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                    if (isTheCorrectOne) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isUserPick && !isCorrect) {
                      optionStyle = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-sm flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-6 h-6 rounded-md bg-white/80 dark:bg-slate-800 flex items-center justify-center text-xs font-bold border border-current">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isTheCorrectOne && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            ✓ Correct Answer
                          </span>
                        )}
                        {isUserPick && !isTheCorrectOne && (
                          <span className="text-xs font-bold text-rose-500">
                            ✗ Your Pick
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-xs sm:text-sm">
                  <p className="font-bold text-indigo-950 dark:text-indigo-200 mb-1">
                    Explanation:
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                  {q.sourceReference && (
                    <div className="mt-2.5 pt-2 border-t border-indigo-200/50 dark:border-indigo-800/50 flex items-center space-x-1.5 text-xs text-indigo-700 dark:text-indigo-400 font-medium">
                      <span>📖</span>
                      <span>Source: {q.sourceReference}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
