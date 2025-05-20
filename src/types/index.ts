export type Topic = 
  | "arrays" 
  | "strings" 
  | "linkedlist" 
  | "trees" 
  | "graphs" 
  | "dp" 
  | "greedy" 
  | "backtracking" 
  | "other";

export type Platform = 
  | "leetcode" 
  | "codeforces" 
  | "hackerrank" 
  | "codechef" 
  | "atcoder" 
  | "geeksforgeeks" 
  | "other";

export type LogType = 
  | "practice" 
  | "contest" 
  | "learning"
  | "mock_interview";

export type DifficultyLevel = 
  | "easy" 
  | "medium" 
  | "hard";

export interface LogEntry {
  id: string;
  date: Date;
  type: LogType;
  topic: Topic;
  platform: Platform;
  problemCount: number;
  difficultyLevel: DifficultyLevel;
  timeSpent: number; // minutes
  notes: string;
  resources: string;
  nextSteps: string;
  tags: string[];
  problemUrl?: string;
  selfRating?: number; // 1-5 rating of self-effort
  blockers?: string;
  reflections?: string;
  zenMode?: boolean;
}

export interface WeeklyGoal {
  id: string;
  week: string; // Format: "YYYY-WW"
  topics: Topic[];
  targetProblemCount: number;
  targetTime: number; // minutes
  achieved: {
    problemCount: number;
    timeSpent: number;
  };
  notes: string;
  streakDays?: number; // Number of consecutive days with activity
  focusAreas?: Topic[]; // Areas to focus on this week
  weeklyReflection?: string; // End of week reflection
}

export interface TemplateData {
  id: string;
  name: string;
  type: LogType;
  topic: Topic;
  platform: Platform;
  difficultyLevel: DifficultyLevel;
  notes: string;
  resources: string;
  nextSteps: string;
  tags: string[];
  defaultTimeSpent?: number;
  isDefault?: boolean;
  markdownEnabled?: boolean;
}

export interface Analytics {
  totalProblems: number;
  totalTime: number; // minutes
  topicBreakdown: Record<Topic, number>;
  difficultyBreakdown: Record<string, number>;
  weeklyProgress: Array<{
    week: string; // Format: "YYYY-WW"
    problems: number;
    time: number; // minutes
  }>;
  streak: number; // Current streak of consecutive days
  longestStreak: number; // Longest streak ever achieved
  topicMastery: Record<Topic, number>; // Mastery level by topic (0-100)
  suggestedFocus: Topic[]; // Suggested topics to focus on next
  heatmapData: Array<{
    date: string; // Format: "YYYY-MM-DD"
    count: number;
  }>;
  lastActive: string; // Date of last activity
}

// New interface for platform patterns to auto-detect platform and difficulty
export interface PlatformPattern {
  platform: Platform;
  urlPattern: RegExp;
  difficultyExtractor?: (url: string) => DifficultyLevel | null;
}

// New interface for streak tracking
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // Format: "YYYY-MM-DD"
}
