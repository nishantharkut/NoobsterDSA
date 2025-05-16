
import { LogEntry, Analytics, Topic } from "@/types";
import { format, subDays, parseISO, isToday, isYesterday } from 'date-fns';
import { calculateStreak } from "./streakTracking";

// Helper functions for formatting and display
export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function getMasteryLabel(score: number): string {
  if (score >= 90) return "Expert";
  if (score >= 75) return "Advanced";
  if (score >= 50) return "Intermediate";
  if (score >= 25) return "Beginner";
  return "Novice";
}

export function getMasteryColorClass(score: number): string {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-emerald-600";
  if (score >= 50) return "text-blue-600";
  if (score >= 25) return "text-amber-600";
  return "text-slate-600";
}

export function getCurrentWeekNumber(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.floor(diff / oneWeek) + 1;
  return `${now.getFullYear()}-${weekNumber < 10 ? '0' + weekNumber : weekNumber}`;
}

export function calculateWeeklyGoalProgress(goal: any, logs: LogEntry[]): any {
  const weekYear = goal.week.split('-')[0];
  const weekNumber = goal.week.split('-')[1];
  
  // Filter logs for the specific week
  const weekLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    const logWeek = getCurrentWeekFromDate(logDate);
    return logWeek === goal.week;
  });
  
  // Calculate achievements
  const problemCount = weekLogs.reduce((sum, log) => sum + (log.problemCount || 0), 0);
  const timeSpent = weekLogs.reduce((sum, log) => sum + log.timeSpent, 0);
  
  return {
    ...goal,
    achieved: {
      problemCount,
      timeSpent
    }
  };
}

function getCurrentWeekFromDate(date: Date): string {
  const year = date.getFullYear();
  const start = new Date(year, 0, 1);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.floor(diff / oneWeek) + 1;
  return `${year}-${weekNumber < 10 ? '0' + weekNumber : weekNumber}`;
}

export function generateAnalytics(logs: LogEntry[]): Analytics {
  const analytics: Analytics = {
    totalProblems: 0,
    totalTime: 0,
    topicBreakdown: {} as Record<Topic, number>,
    difficultyBreakdown: {} as Record<string, number>,
    weeklyProgress: [],
    streak: 0,
    longestStreak: 0,
    topicMastery: {} as Record<Topic, number>,
    suggestedFocus: [],
    heatmapData: [],
    lastActive: ''
  };

  if (logs.length === 0) {
    return analytics;
  }

  // Get unique dates from logs
  const uniqueDates = new Set<string>();
  
  // Initialize topic and difficulty breakdowns
  const topics: Topic[] = ["arrays", "strings", "linkedlist", "trees", "graphs", "dp", "greedy", "backtracking", "other"];
  topics.forEach(topic => {
    analytics.topicBreakdown[topic] = 0;
    analytics.topicMastery[topic] = 0;
  });
  
  const difficulties = ["easy", "medium", "hard"];
  difficulties.forEach(difficulty => {
    analytics.difficultyBreakdown[difficulty] = 0;
  });
  
  // Track total metrics
  logs.forEach(log => {
    uniqueDates.add(format(new Date(log.date), 'yyyy-MM-dd'));
    
    analytics.totalProblems += log.problemCount || 1;
    analytics.totalTime += log.timeSpent;
    
    // Track topic distribution
    if (!analytics.topicBreakdown[log.topic]) {
      analytics.topicBreakdown[log.topic] = 0;
    }
    analytics.topicBreakdown[log.topic] += log.problemCount || 1;
    
    // Track difficulty distribution
    if (!analytics.difficultyBreakdown[log.difficultyLevel]) {
      analytics.difficultyBreakdown[log.difficultyLevel] = 0;
    }
    analytics.difficultyBreakdown[log.difficultyLevel] += log.problemCount || 1;
  });
  
  // Generate heatmap data
  const today = new Date();
  const last365Days = Array.from({ length: 365 }, (_, i) => {
    const date = subDays(today, 364 - i);
    return format(date, 'yyyy-MM-dd');
  });
  
  analytics.heatmapData = last365Days.map(dateStr => {
    const logsForDate = logs.filter(log => {
      return format(new Date(log.date), 'yyyy-MM-dd') === dateStr;
    });
    
    const count = logsForDate.reduce((sum, log) => sum + (log.problemCount || 1), 0);
    
    return {
      date: dateStr,
      count: count
    };
  });
  
  // Generate weekly progress data
  const weekMap = new Map<string, { problems: number; time: number }>();
  
  logs.forEach(log => {
    const date = new Date(log.date);
    const week = getCurrentWeekFromDate(date);
    
    if (!weekMap.has(week)) {
      weekMap.set(week, { problems: 0, time: 0 });
    }
    
    const weekData = weekMap.get(week)!;
    weekData.problems += log.problemCount || 1;
    weekData.time += log.timeSpent;
  });
  
  analytics.weeklyProgress = Array.from(weekMap.entries())
    .map(([week, data]) => ({
      week,
      problems: data.problems,
      time: data.time
    }))
    .sort((a, b) => a.week.localeCompare(b.week));
  
  // Topic mastery tracking
  const topicDifficultyPoints: Record<Topic, { points: number, count: number }> = {
    'arrays': { points: 0, count: 0 },
    'strings': { points: 0, count: 0 },
    'linkedlist': { points: 0, count: 0 },
    'trees': { points: 0, count: 0 },
    'graphs': { points: 0, count: 0 },
    'dp': { points: 0, count: 0 },
    'greedy': { points: 0, count: 0 },
    'backtracking': { points: 0, count: 0 },
    'other': { points: 0, count: 0 }
  };
  
  logs.forEach(log => {
    // Calculate difficulty points based on difficulty level
    let difficultyValue: number;
    switch (log.difficultyLevel) {
      case "hard":
        difficultyValue = 3;
        break;
      case "medium":
        difficultyValue = 2;
        break;
      default:
        difficultyValue = 1;
    }
    
    topicDifficultyPoints[log.topic].points += difficultyValue * log.timeSpent;
    topicDifficultyPoints[log.topic].count += log.problemCount || 1;
  });
  
  // Calculate topic mastery percentages (0-100)
  Object.keys(topicDifficultyPoints).forEach(topic => {
    const topicKey = topic as Topic;
    const { points, count } = topicDifficultyPoints[topicKey];
    if (count > 0) {
      // Convert to a 0-100 scale with diminishing returns for higher values
      const rawScore = points / (count * 5); // Normalize by count and max difficulty
      analytics.topicMastery[topicKey] = Math.min(Math.round(Math.log(rawScore + 1) * 25), 100);
    } else {
      analytics.topicMastery[topicKey] = 0;
    }
  });
  
  // Calculate suggested focus areas - topics with lowest mastery
  analytics.suggestedFocus = Object.entries(analytics.topicMastery)
    .filter(([_, score]) => score < 50) // Only suggest topics below 50% mastery
    .sort((a, b) => a[1] - b[1]) // Sort by ascending score
    .slice(0, 3) // Take top 3 lowest
    .map(([topic]) => topic as Topic);
  
  // If we don't have 3 suggestions, add topics with lowest problem counts
  if (analytics.suggestedFocus.length < 3) {
    const remainingTopics = Object.entries(analytics.topicBreakdown)
      .filter(([topic]) => !analytics.suggestedFocus.includes(topic as Topic))
      .sort((a, b) => a[1] - b[1]) // Sort by ascending count
      .slice(0, 3 - analytics.suggestedFocus.length)
      .map(([topic]) => topic as Topic);
    
    analytics.suggestedFocus = [...analytics.suggestedFocus, ...remainingTopics];
  }
  
  // Streak calculation
  const streakData = calculateStreak(logs);
  analytics.streak = streakData.currentStreak;
  analytics.longestStreak = streakData.longestStreak;
  analytics.lastActive = streakData.lastActiveDate;
  
  return analytics;
}
