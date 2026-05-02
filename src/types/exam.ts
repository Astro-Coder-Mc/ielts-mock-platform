export type ExamType = 'IELTS' | 'CEFR';
export type SkillType = 'Listening' | 'Reading' | 'Writing' | 'Speaking' | 'Shadowing' | 'Typing';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'dropdown' | 'writing';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  groupTitle?: string;
}

export interface ExamSection {
  id: string;
  title: string;
  content?: string; // For Reading text
  audioUrl?: string; // For Listening audio
  questions: Question[];
}

export interface ExamData {
  id: string;
  type: ExamType;
  skill: SkillType;
  title: string;
  duration: number; // in seconds
  sections: ExamSection[];
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  isMarkedForReview?: boolean;
}

export interface ExamResult {
  examId: string;
  score: number;
  maxScore: number;
  bandScore: string;
  answers: {
    questionId: string;
    userAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
    explanation: string;
  }[];
  aiFeedback: string;
}
