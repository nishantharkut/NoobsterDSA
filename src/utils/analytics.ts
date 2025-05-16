
import { LogEntry, WeeklyGoal, Topic, DifficultyLevel, Analytics } from "@/types";

export function calculateWeekNumber(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 4).getTime()) / 86400000 / 7) + 1;
  return `${d.getFullYear()}-${week.toString().padStart(2, '0')}`;
}

export function getCurrentWeekNumber(): string {
  return calculateWeekNumber(new Date());
}

export function getWeekStartDate(weekStr: string): Date {
  const [year, week] = weekStr.split('-').map(Number);
  const dayOfYear = week * 7 - 7 + 1;
  const date = new Date(year, 0, dayOfYear);
  return date;
}

export function filterLogsByWeek(logs: LogEntry[], week: string): LogEntry[] {
  const weekStart = getWeekStartDate(week);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  return logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= weekStart && logDate <= weekEnd;
  });
}

export function generateAnalytics(logs: LogEntry[]): Analytics {
  const analytics: Analytics = {
    totalProblems: 0,
    totalTime: 0,
    topicBreakdown: {} as Record<Topic, number>,
    difficultyBreakdown: {} as Record<DifficultyLevel, number>,
    weeklyProgress: []
  };

  // Initialize topic and difficulty counts
  const topics: Topic[] = ["arrays", "strings", "linkedlist", "trees", "graphs", "dp", "greedy", "backtracking", "other"];
  const difficulties: DifficultyLevel[] = ["easy", "medium", "hard"];
  
  topics.forEach(topic => {
    analytics.topicBreakdown[topic] = 0;
  });
  
  difficulties.forEach(difficulty => {
    analytics.difficultyBreakdown[difficulty] = 0;
  });

  // Week-based organization
  const weekLogs: Record<string, { problems: number, time: number }> = {};

  logs.forEach(log => {
    // Total counts
    analytics.totalProblems += log.problemCount;
    analytics.totalTime += log.timeSpent;

    // Topic breakdown
    analytics.topicBreakdown[log.topic] += log.problemCount;

    // Difficulty breakdown
    analytics.difficultyBreakdown[log.difficultyLevel] += log.problemCount;

    // Weekly progress
    const week = calculateWeekNumber(new Date(log.date));
    if (!weekLogs[week]) {
      weekLogs[week] = { problems: 0, time: 0 };
    }
    weekLogs[week].problems += log.problemCount;
    weekLogs[week].time += log.timeSpent;
  });

  // Convert weekly logs to array and sort by week
  analytics.weeklyProgress = Object.entries(weekLogs)
    .map(([week, data]) => ({
      week,
      problems: data.problems,
      time: data.time,
    }))
    .sort((a, b) => a.week.localeCompare(b.week));

  return analytics;
}

export function calculateWeeklyGoalProgress(
  goal: WeeklyGoal,
  logs: LogEntry[]
): WeeklyGoal {
  const weekLogs = filterLogsByWeek(logs, goal.week);
  
  const achieved = {
    problemCount: 0,
    timeSpent: 0,
  };

  weekLogs.forEach(log => {
    if (goal.topics.includes(log.topic) || goal.topics.length === 0) {
      achieved.problemCount += log.problemCount;
      achieved.timeSpent += log.timeSpent;
    }
  });

  return {
    ...goal,
    achieved
  };
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
}
