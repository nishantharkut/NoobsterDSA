
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
  | "learning";

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
}

export interface Analytics {
  totalProblems: number;
  totalTime: number; // minutes
  topicBreakdown: Record<Topic, number>;
  difficultyBreakdown: Record<DifficultyLevel, number>;
  weeklyProgress: Array<{
    week: string; // Format: "YYYY-WW"
    problems: number;
    time: number; // minutes
  }>;
}
