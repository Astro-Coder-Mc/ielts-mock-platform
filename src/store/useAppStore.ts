import { create } from 'zustand';
import { ExamData, UserAnswer } from '../types/exam';

type ExamType = 'IELTS' | 'CEFR';

interface AppState {
  examType: ExamType;
  setExamType: (type: ExamType) => void;
  coins: number;
  addCoins: (amount: number) => void;
  deductCoins: (amount: number) => void;
  isProfileModalOpen: boolean;
  setProfileModalOpen: (isOpen: boolean) => void;
  isPasswordModalOpen: boolean;
  setPasswordModalOpen: (isOpen: boolean) => void;
  isEmailModalOpen: boolean;
  setEmailModalOpen: (isOpen: boolean) => void;
  isExamTypeModalOpen: boolean;
  setExamTypeModalOpen: (isOpen: boolean) => void;
  // User Profile
  user: {
    username: string;
    phone: string;
    isAdmin?: boolean;
  } | null;
  setUser: (user: { username: string; phone: string; isAdmin?: boolean } | null) => void;
  logout: () => void;
  // Exam Session
  currentExam: ExamData | null;
  setCurrentExam: (exam: ExamData | null) => void;
  userAnswers: UserAnswer[];
  setUserAnswer: (questionId: string, answer: string | string[]) => void;
  toggleMarkForReview: (questionId: string) => void;
  clearUserAnswers: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  examType: 'IELTS',
  setExamType: (type) => set({ examType: type }),
  coins: 50, // Initial coins for testing
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  deductCoins: (amount) => set((state) => ({ coins: Math.max(0, state.coins - amount) })),
  isProfileModalOpen: false,
  setProfileModalOpen: (isOpen) => set({ isProfileModalOpen: isOpen }),
  isPasswordModalOpen: false,
  setPasswordModalOpen: (isOpen) => set({ isPasswordModalOpen: isOpen }),
  isEmailModalOpen: false,
  setEmailModalOpen: (isOpen) => set({ isEmailModalOpen: isOpen }),
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, currentExam: null, userAnswers: [] }),
  isExamTypeModalOpen: false,
  setExamTypeModalOpen: (isOpen) => set({ isExamTypeModalOpen: isOpen }),
  // Exam Session
  currentExam: null,
  setCurrentExam: (exam) => {
    if (exam) {
      const initialAnswers = exam.sections.flatMap(s => 
        s.questions.map(q => ({
          questionId: q.id,
          answer: q.type === 'matching' ? [] : '',
          isMarkedForReview: false
        }))
      );
      set({ currentExam: exam, userAnswers: initialAnswers });
    } else {
      set({ currentExam: null, userAnswers: [] });
    }
  },
  userAnswers: [],
  setUserAnswer: (questionId, answer) => set((state) => {
    const existingIndex = state.userAnswers.findIndex(a => a.questionId === questionId);
    if (existingIndex > -1) {
      const newAnswers = [...state.userAnswers];
      newAnswers[existingIndex] = { ...newAnswers[existingIndex], answer };
      return { userAnswers: newAnswers };
    }
    return { userAnswers: [...state.userAnswers, { questionId, answer }] };
  }),
  toggleMarkForReview: (questionId) => set((state) => {
    const existingIndex = state.userAnswers.findIndex(a => a.questionId === questionId);
    if (existingIndex > -1) {
      const newAnswers = [...state.userAnswers];
      newAnswers[existingIndex] = { 
        ...newAnswers[existingIndex], 
        isMarkedForReview: !newAnswers[existingIndex].isMarkedForReview 
      };
      return { userAnswers: newAnswers };
    }
    // If no answer yet, create one just for marking
    return { userAnswers: [...state.userAnswers, { questionId, answer: '', isMarkedForReview: true }] };
  }),
  clearUserAnswers: () => set({ userAnswers: [] }),
}));
