
export type DifficultyLevel = "beginner" | "easy" | "medium" | "hard";

export type ProgrammingLanguage = "python" | "javascript" | "java" | "cpp";

export type LearningTrack = 
  | "arrays-strings"
  | "linked-lists" 
  | "stacks-queues"
  | "hash-tables"
  | "binary-trees"
  | "binary-search-trees"
  | "graphs"
  | "dynamic-programming"
  | "sorting-searching"
  | "advanced-algorithms";

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  track: LearningTrack;
  hints: string[];
  starterCode: Record<ProgrammingLanguage, string>;
  solution: Record<ProgrammingLanguage, string>;
  testCases: TestCase[];
  timeEstimate: number; // minutes
  conceptsUsed: string[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface UserProgress {
  userId: string;
  solvedProblems: string[];
  currentTrack: LearningTrack;
  preferredLanguage: ProgrammingLanguage;
  streakDays: number;
  totalProblemsAttempted: number;
  totalProblemsSolved: number;
  badges: Badge[];
  weeklyGoal: number;
  onboardingCompleted: boolean;
  experienceLevel: "complete-beginner" | "some-programming" | "know-basics";
  learningGoal: "interviews" | "academic" | "personal";
  timeCommitment: 15 | 30 | 60; // minutes per day
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface LearningModule {
  id: string;
  track: LearningTrack;
  title: string;
  subtitle: string;
  description: string;
  estimatedTime: number; // hours
  prerequisiteModules: string[];
  problems: string[]; // problem IDs
  theoryContent: string;
  isLocked: boolean;
  completionPercentage: number;
}

export interface CodeSubmission {
  id: string;
  problemId: string;
  userId: string;
  code: string;
  language: ProgrammingLanguage;
  isCorrect: boolean;
  attempts: number;
  hintsUsed: number;
  timeSpent: number; // seconds
  submittedAt: Date;
}
