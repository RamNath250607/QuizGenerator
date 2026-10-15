import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ModeSelector, type QuizMode } from './components/ModeSelector';
import { DocumentUploadCard } from './components/DocumentUploadCard';
import { TopicSelectorCard } from './components/TopicSelectorCard';
import { QuizConfigCard, type QuizSettings } from './components/QuizConfigCard';
import { QuizActiveView } from './components/QuizActiveView';
import { QuizResultView } from './components/QuizResultView';
import { HistoryView } from './components/HistoryView';
import { SAMPLE_QUIZ } from './data/sampleQuiz';
import {
  checkBackendHealth,
  uploadDocumentToBackend,
  generateQuizFromBackend,
  deleteDocumentFromBackend,
  saveQuizAttemptToBackend,
  type DocumentExtractionMeta
} from './services/api';
import type { QuizData, QuizScoreSummary } from './types/quiz';
import { ArrowRight, ArrowLeft, CheckCircle2, BookOpen, FileText, AlertCircle } from 'lucide-react';

export function App() {
  // Theme & Navigation
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Step 1: Source Selection
  const [quizMode, setQuizMode] = useState<QuizMode>('document');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractionMeta, setExtractionMeta] = useState<DocumentExtractionMeta | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [topic, setTopic] = useState<string>('DBMS & SQL');

  // Wizard Steps: 1 = Source Selection, 2 = Quiz Parameters, 3 = Active Quiz, 4 = Results
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 2: Quiz Configuration Settings
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    questionCount: 5,
    isCustomCount: false,
    difficulty: 'medium',
    questionType: 'mcq',
    chapterOrSubtopic: '',
    language: 'en',
  });

  // Active quiz dataset
  const [activeQuiz, setActiveQuiz] = useState<QuizData>(SAMPLE_QUIZ);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);

  // Quiz Attempt Evaluation State
  const [userAnswers, setUserAnswers] = useState<Record<string, number | null>>({});
  const [scoreSummary, setScoreSummary] = useState<QuizScoreSummary | null>(null);

  // Sync dark mode class with html root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check FastAPI backend health on load and periodically
  useEffect(() => {
    const verifyHealth = async () => {
      const health = await checkBackendHealth();
      setBackendOnline(health !== null);
    };

    verifyHealth();
    const interval = setInterval(verifyHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handle Document Selection and Send to FastAPI for extraction & ChromaDB indexing
  const handleFileSelect = async (file: File | null) => {
    setSelectedFile(file);
    setExtractionMeta(null);
    setUploadError(null);
    setValidationError(null);

    if (!file) {
      if (backendOnline) {
        deleteDocumentFromBackend();
      }
      return;
    }

    if (backendOnline) {
      setIsExtracting(true);
      try {
        const meta = await uploadDocumentToBackend(file);
        setExtractionMeta(meta);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to extract text from document.';
        setUploadError(msg);
      } finally {
        setIsExtracting(false);
      }
    } else {
      // Offline fallback simulation
      setExtractionMeta({
        filename: file.name,
        char_count: 5400,
        word_count: 850,
        page_count: 2,
        total_chunks: 4,
        preview: 'Relational Database Management Systems: Transaction ACID properties, B-Tree indexes, and normalization normal forms...',
        message: 'Document ready for RAG processing (Local Mode).',
      });
    }
  };

  // Validation before proceeding to Quiz Parameters (Step 2)
  const handleProceedToConfig = () => {
    if (quizMode === 'document' && !selectedFile) {
      setValidationError('Please upload a PDF/DOCX/TXT file or click "Load Sample Lecture Notes" above to proceed.');
      return;
    }
    if (quizMode === 'topic' && !topic.trim()) {
      setValidationError('Please enter or select a study topic before continuing.');
      return;
    }
    setValidationError(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch AI Quiz Generator
  const handleStartQuiz = async () => {
    setIsLoadingQuiz(true);
    setUserAnswers({});
    setScoreSummary(null);

    try {
      if (backendOnline) {
        const generated = await generateQuizFromBackend({
          mode: quizMode,
          topic: quizMode === 'topic' ? topic : undefined,
          questionCount: quizSettings.questionCount,
          difficulty: quizSettings.difficulty,
          questionType: quizSettings.questionType,
          chapterOrSubtopic: quizSettings.chapterOrSubtopic,
          language: quizSettings.language,
        });

        if (generated && generated.questions.length > 0) {
          setActiveQuiz(generated);
          setStep(3);
          return;
        }
      }
      setActiveQuiz(SAMPLE_QUIZ);
      setStep(3);
    } catch (err: unknown) {
      console.warn('Backend generation failed, using local fallback:', err);
      setActiveQuiz(SAMPLE_QUIZ);
      setStep(3);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // Complete and grade the quiz + Save attempt to SQLite (Milestone 11)
  const handleFinishQuiz = (answers: Record<string, number | null>, timeSpent: number) => {
    setUserAnswers(answers);

    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    activeQuiz.questions.forEach((q) => {
      const pick = answers[q.id];
      if (pick === undefined || pick === null) {
        skipped++;
      } else if (pick === q.correctAnswerIndex) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const total = activeQuiz.questions.length;
    const percentage = Math.round((correct / total) * 100);

    const summary: QuizScoreSummary = {
      score: correct,
      total,
      percentage,
      correctCount: correct,
      incorrectCount: incorrect,
      skippedCount: skipped,
      timeSpentSeconds: timeSpent,
    };

    setScoreSummary(summary);
    setStep(4);

    if (backendOnline) {
      saveQuizAttemptToBackend({
        title: activeQuiz.title,
        topic_or_document: activeQuiz.topicOrDocument,
        mode: quizMode,
        score: correct,
        total_questions: total,
        percentage,
        difficulty: quizSettings.difficulty,
        time_spent_seconds: timeSpent,
      });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F5F3FF] text-[#1E1B4B]'}`}>
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'create') setStep(1);
        }}
        backendOnline={backendOnline}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {activeTab === 'create' ? (
          <>
            {/* Step Wizard Header */}
            {(step === 1 || step === 2) && (
              <div className="pt-8 pb-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-4">
                  {/* Step 1 Pill */}
                  <button
                    type="button"
                    onClick={() => {
                      setValidationError(null);
                      setStep(1);
                    }}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-emerald-500 text-white'
                    }`}>
                      {step > 1 ? '✓' : '1'}
                    </div>
                    <span className={`text-sm font-bold transition-colors ${step === 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 group-hover:text-indigo-600'}`}>
                      1. Study Material
                    </span>
                  </button>

                  <div className="h-0.5 flex-1 mx-4 bg-slate-200 dark:bg-slate-700" />

                  {/* Step 2 Pill (Clickable) */}
                  <button
                    type="button"
                    onClick={handleProceedToConfig}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step === 2 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 group-hover:bg-indigo-100'
                    }`}>
                      2
                    </div>
                    <span className={`text-sm font-bold transition-colors ${step === 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 group-hover:text-indigo-600'}`}>
                      2. Quiz Settings
                    </span>
                  </button>

                  <div className="h-0.5 flex-1 mx-4 bg-slate-200 dark:bg-slate-700" />

                  {/* Step 3 Pill */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-slate-200 dark:bg-slate-700 text-slate-500">
                      3
                    </div>
                    <span className="text-sm font-bold text-slate-400">
                      3. Live Quiz
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Choose Source & Content */}
            {step === 1 && (
              <>
                <HeroSection />

                <div className="mt-4 mb-8">
                  <div className="text-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-950/70 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                      Step 1 of 2: Choose Quiz Source
                    </span>
                    <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                      How would you like to build your quiz?
                    </h2>
                  </div>

                  <ModeSelector
                    selectedMode={quizMode}
                    onSelectMode={(mode) => {
                      setValidationError(null);
                      setQuizMode(mode);
                    }}
                  />
                </div>

                <div className="max-w-4xl mx-auto px-4 mt-8">
                  <div className="text-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-100/70 dark:bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800">
                      Step 2 of 2: Provide Content
                    </span>
                    <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                      {quizMode === 'document' ? 'Upload Your Study Material' : 'Specify Your Subject'}
                    </h2>
                  </div>

                  {quizMode === 'document' ? (
                    <DocumentUploadCard
                      selectedFile={selectedFile}
                      extractionMeta={extractionMeta}
                      isExtracting={isExtracting}
                      onFileSelect={handleFileSelect}
                      error={uploadError}
                    />
                  ) : (
                    <TopicSelectorCard
                      topic={topic}
                      onTopicChange={(t) => {
                        setValidationError(null);
                        setTopic(t);
                      }}
                    />
                  )}

                  {/* Inline Validation Alert Banner */}
                  {validationError && (
                    <div className="mt-6 flex items-center space-x-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 animate-in fade-in duration-200">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <div className="text-xs sm:text-sm font-semibold">
                        {validationError}
                      </div>
                    </div>
                  )}

                  {/* Continue Button */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>
                          {quizMode === 'document'
                            ? selectedFile
                              ? `Ready: "${selectedFile.name}" ${extractionMeta ? `(${extractionMeta.word_count} words)` : ''}`
                              : 'Upload a document above or click "Load Sample Notes" to proceed'
                            : `Ready: "${topic || 'Select a topic'}"`}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Proceed to configure question count, difficulty, and format.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleProceedToConfig}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>Continue to Quiz Options</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: Configure Quiz Settings */}
            {step === 2 && (
              <div className="max-w-4xl mx-auto px-4 mt-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => {
                      setValidationError(null);
                      setStep(1);
                    }}
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Study Material</span>
                  </button>

                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
                    {quizMode === 'document' ? (
                      <>
                        <FileText className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{topic}</span>
                      </>
                    )}
                  </div>
                </div>

                <QuizConfigCard
                  settings={quizSettings}
                  onChangeSettings={setQuizSettings}
                  onGenerate={handleStartQuiz}
                  isLoading={isLoadingQuiz}
                />
              </div>
            )}

            {/* STEP 3: Active Interactive Quiz Engine */}
            {step === 3 && (
              <QuizActiveView
                quiz={activeQuiz}
                onFinishQuiz={handleFinishQuiz}
                onQuitQuiz={() => setStep(2)}
              />
            )}

            {/* STEP 4: Quiz Results & Detailed Review */}
            {step === 4 && scoreSummary && (
              <QuizResultView
                quiz={activeQuiz}
                userAnswers={userAnswers}
                summary={scoreSummary}
                onRetake={() => {
                  setUserAnswers({});
                  setScoreSummary(null);
                  setStep(3);
                }}
                onNewQuiz={() => {
                  setUserAnswers({});
                  setScoreSummary(null);
                  setStep(1);
                }}
              />
            )}
          </>
        ) : (
          /* History & Learning Analytics Tab */
          <HistoryView
            onStartNewQuiz={() => {
              setActiveTab('create');
              setStep(1);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
