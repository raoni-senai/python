export interface CodeExample {
  id: string;
  title: string;
  code: string;
  explanation: string;
  expectedOutput: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  contentMarkdown: string; // Course-level documentation
  examples: CodeExample[];
  quizQuestions: QuizQuestion[];
  estimatedMinutes: number;
}

export interface CourseSection {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type QuestionType = 'multiple_choice' | 'fill_in_the_blank' | 'code_completion';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  codeContext?: string; // Optional code block helper shown above the question
  options?: string[]; // Used for multiple choice
  correctAnswer: string; // The correct answer string (or exact word for blank fills, or correct code line)
  placeholderText?: string; // For code completions
  hint?: string;
  xpValue: number;
}

export interface UserProgress {
  userId: string;
  username: string;
  xp: number;
  streak: number;
  lastActive: string | null; // Date ISO string
  completedLessons: string[]; // List of lesson IDs
  completedQuizzes: string[]; // List of quiz/lesson IDs
  milestonesReached: string[]; // List of matching milestones
  certificateUuid?: string;
}

export interface LeaderboardUser {
  username: string;
  xp: number;
  streak: number;
  category: string; // e.g. "Senior Pythonist", "Byte Sized", "AI Prodigy"
  avatarSeed: string; // Simple index/seed for avatar generation
  isCurrentUser?: boolean;
}

export interface Certificate {
  id: string;
  recipientName: string;
  dateAwarded: string;
  courseName: string;
  grade: string;
  verificationCode: string;
}
