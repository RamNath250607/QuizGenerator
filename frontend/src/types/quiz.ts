export interface Question {
  id: string;
  questionText: string;
  type: 'mcq' | 'true_false';
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  sourceReference?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizData {
  title: string;
  topicOrDocument: string;
  totalQuestions: number;
  questions: Question[];
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionIndex: number | null; // null if skipped
  isCorrect: boolean;
}

export interface QuizScoreSummary {
  score: number;
  total: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  timeSpentSeconds: number;
}
