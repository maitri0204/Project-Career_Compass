export interface User {
  id: string;
  _id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobile?: string;
  country?: string;
  state?: string;
  city?: string;
  classGrade?: string;
  schoolName?: string;
  board?: string;
  role: "ADMIN" | "STUDENT";
  isVerified?: boolean;
  isActive?: boolean;
  completedTests?: number;
  createdAt?: string;
}

export interface QuestionOption {
  label: string;
  text: string;
}

export interface Question {
  _id: string;
  testType: string;
  partNumber: number;
  partName: string;
  questionNumber: number;
  questionText: string;
  options: QuestionOption[];
  correctAnswer: string;
}

export interface PersonalityDimension {
  pair: string;
  letterA: string;
  letterB: string;
  nameA: string;
  nameB: string;
  countA: number;
  countB: number;
  percentA: number;
  percentB: number;
  winner: string;
}

export interface PersonalityBreakdown {
  personalityType: string;
  description: string;
  dimensions: PersonalityDimension[];
  totalAnswered: number;
}

export interface TestResult {
  _id: string;
  student: User | string;
  status: "IN_PROGRESS" | "COMPLETED";
  answers?: Record<string, string>;
  personalityType?: string;
  totalScore?: number;
  submittedAt?: string;
  personality?: PersonalityBreakdown;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: string[];
}
