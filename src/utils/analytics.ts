
import { LogEntry, WeeklyGoal, Topic, DifficultyLevel, Analytics } from "@/types";
import { generateHeatmapData, calculateStreak } from "./streakTracking";

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
    weeklyProgress: [],
    streak: 0,
    longestStreak: 0,
    topicMastery: {} as Record<Topic, number>,
    suggestedFocus: [],
    heatmapData: [],
    lastActive: ''
  };

  // Initialize topic and difficulty counts
  const topics: Topic[] = ["arrays", "strings", "linkedlist", "trees", "graphs", "dp", "greedy", "backtracking", "other"];
  const difficulties: DifficultyLevel[] = ["easy", "medium", "hard"];
  
  topics.forEach(topic => {
    analytics.topicBreakdown[topic] = 0;
    analytics.topicMastery[topic] = 0;
  });
  
  difficulties.forEach(difficulty => {
    analytics.difficultyBreakdown[difficulty] = 0;
  });

  if (logs.length === 0) {
    return analytics;
  }

  // Week-based organization
  const weekLogs: Record<string, { problems: number, time: number }> = {};

  // Calculate streak
  const streakData = calculateStreak(logs);
  analytics.streak = streakData.currentStreak;
  analytics.longestStreak = streakData.longestStreak;
  analytics.lastActive = streakData.lastActiveDate;

  // Topic proficiency tracking - FIX: Initialize with all topics properly
  const topicDifficultyPoints: Record<Topic, { points: number, count: number }> = {} as Record<Topic, { points: number, count: number }>;
  topics.forEach(topic => {
    topicDifficultyPoints[topic] = { points: 0, count: 0 };
  });

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

    // Calculate topic mastery based on difficulty
    let difficultyPoints = 1; // Default points
    if (log.difficultyLevel === 'medium') difficultyPoints = 2;
    if (log.difficultyLevel === 'hard') difficultyPoints = 3;

    topicDifficultyPoints[log.topic].points += (difficultyPoints * log.problemCount);
    topicDifficultyPoints[log.topic].count += log.problemCount;
  });

  // Convert weekly logs to array and sort by week
  analytics.weeklyProgress = Object.entries(weekLogs)
    .map(([week, data]) => ({
      week,
      problems: data.problems,
      time: data.time,
    }))
    .sort((a, b) => a.week.localeCompare(b.week));

  // Calculate topic mastery (0-100 scale)
  topics.forEach(topic => {
    const { points, count } = topicDifficultyPoints[topic];
    if (count > 0) {
      // Base mastery: proportion of max difficulty points (3 per problem)
      const baseMastery = (points / (count * 3)) * 70;
      
      // Volume bonus: more problems solved in a topic increases mastery
      const volumeBonus = Math.min(30, count * 0.5);
      
      analytics.topicMastery[topic] = Math.round(baseMastery + volumeBonus);
    }
  });

  // Generate suggested focus areas (topics with lowest mastery that have been started)
  const startedTopics = topics.filter(topic => topicDifficultyPoints[topic].count > 0);
  analytics.suggestedFocus = [...startedTopics]
    .sort((a, b) => analytics.topicMastery[a] - analytics.topicMastery[b])
    .slice(0, 3);
  
  // If there are fewer than 3 suggested topics, add topics that haven't been started
  const unusedTopics = topics.filter(topic => topicDifficultyPoints[topic].count === 0);
  if (analytics.suggestedFocus.length < 3) {
    analytics.suggestedFocus = [
      ...analytics.suggestedFocus,
      ...unusedTopics.slice(0, 3 - analytics.suggestedFocus.length)
    ];
  }

  // Generate heatmap data
  analytics.heatmapData = generateHeatmapData(logs);

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

  // Calculate streak days for this week
  const uniqueDaysInWeek = new Set(
    weekLogs.map(log => new Date(log.date).toDateString())
  );
  
  return {
    ...goal,
    achieved,
    streakDays: uniqueDaysInWeek.size
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

// Calculate progress percentage for goals
export function calculateProgressPercentage(achieved: number, target: number): number {
  if (target <= 0) return 0;
  const percentage = (achieved / target) * 100;
  return Math.min(100, Math.round(percentage));
}

// Get mastery level label based on score
export function getMasteryLabel(score: number): string {
  if (score >= 90) return 'Expert';
  if (score >= 75) return 'Advanced';
  if (score >= 50) return 'Intermediate';
  if (score >= 25) return 'Beginner';
  return 'Novice';
}

// Get color class based on mastery score
export function getMasteryColorClass(score: number): string {
  if (score >= 90) return 'text-success';
  if (score >= 75) return 'text-teal';
  if (score >= 50) return 'text-info';
  if (score >= 25) return 'text-warning';
  return 'text-muted-foreground';
}
