import React, { useState, useEffect } from 'react';
import type { QuizData } from '../types/quiz';

import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, AlertCircle, Check } from 'lucide-react';

interface QuizActiveViewProps {
  quiz: QuizData;
  onFinishQuiz: (selectedAnswers: Record<string, number | null>, timeSpent: number) => void;
  onQuitQuiz: () => void;
}

export const QuizActiveView: React.FC<QuizActiveViewProps> = ({
  quiz,
  onFinishQuiz,
  onQuitQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | null>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQ = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.values(selectedAnswers).filter((v) => v !== null && v !== undefined).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleSubmitAttempt = () => {
    if (answeredCount < totalQuestions) {
      setShowConfirmModal(true);
    } else {
      onFinishQuiz(selectedAnswers, elapsedSeconds);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Quiz Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900">
            {quiz.topicOrDocument}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
            {quiz.title}
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Elapsed Timer */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-bold font-mono">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Quit button */}
          <button
            type="button"
            onClick={onQuitQuiz}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            Exit Quiz
          </button>
        </div>
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          <span>
            Question <strong className="text-indigo-600 dark:text-indigo-400">{currentIndex + 1}</strong> of {totalQuestions}
          </span>
          <span>
            {answeredCount} of {totalQuestions} Answered ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* Badges: Difficulty & Format */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                currentQ.difficulty === 'easy'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : currentQ.difficulty === 'medium'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {currentQ.difficulty}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full uppercase">
              {currentQ.type === 'mcq' ? 'Multiple Choice' : 'True / False'}
            </span>
          </div>

          {/* Flag button */}
          <button
            type="button"
            onClick={toggleFlag}
            className={`inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              flaggedQuestions[currentQ.id]
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>{flaggedQuestions[currentQ.id] ? 'Flagged for Review' : 'Flag'}</span>
          </button>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
          {currentQ.questionText}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt, optIndex) => {
            const isSelected = selectedAnswers[currentQ.id] === optIndex;
            const optionLabels = ['A', 'B', 'C', 'D'];
            return (
              <button
                key={optIndex}
                type="button"
                onClick={() => handleSelectOption(optIndex)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between cursor-pointer group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-white shadow-sm ring-2 ring-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 group-hover:border-indigo-400'
                    }`}
                  >
                    {currentQ.type === 'mcq' ? optionLabels[optIndex] : optIndex === 0 ? 'T' : 'F'}
                  </span>
                  <span className="text-sm sm:text-base font-medium">{opt}</span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Actions */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Quick Question Number Jump Pills */}
          <div className="hidden sm:flex items-center space-x-1.5">
            {quiz.questions.map((q, qIdx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== null;
              const isCurrent = qIdx === currentIndex;
              const isFlagged = flaggedQuestions[q.id];

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(qIdx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-500/30 scale-105'
                      : isAnswered
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {qIdx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white dark:border-slate-900" />
                  )}
                </button>
              );
            })}
          </div>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitAttempt}
              className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal if Unanswered Questions Remain */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Unanswered Questions Detected
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              You answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions. Are you sure you want to finalize and grade this test now?
            </p>
            <div className="mt-6 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  onFinishQuiz(selectedAnswers, elapsedSeconds);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/25 cursor-pointer"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
