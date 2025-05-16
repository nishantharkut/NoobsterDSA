import { LogEntry, AnalyticsData, Topic } from "@/types";
import { format, subDays } from 'date-fns';
import { calculateStreak } from "./streakTracking";

export function generateAnalytics(logs: LogEntry[]): AnalyticsData {
  const analytics: AnalyticsData = {
    totalMinutes: 0,
    totalLogs: 0,
    totalDifficulty: 0,
    averageDifficulty: 0,
    topicDistribution: {},
    topicProficiency: {},
    recentDailyMinutes: [],
    weekdayDistribution: [0, 0, 0, 0, 0, 0, 0],
    currentStreak: 0,
    longestStreak: 0,
    lastActive: null,
    minutesByMonth: {}
  };

  if (logs.length === 0) {
    return analytics;
  }

  // Get unique dates from logs
  const uniqueDates = new Set<string>();
  
  // Track total metrics
  logs.forEach(log => {
    uniqueDates.add(format(new Date(log.date), 'yyyy-MM-dd'));
    
    analytics.totalMinutes += log.duration;
    analytics.totalDifficulty += log.difficulty;
    
    // Track topic distribution
    if (!analytics.topicDistribution[log.topic]) {
      analytics.topicDistribution[log.topic] = 0;
    }
    analytics.topicDistribution[log.topic]++;
    
    // Track weekday distribution
    const dayIndex = new Date(log.date).getDay();
    analytics.weekdayDistribution[dayIndex]++;
    
    // Track minutes by month
    const monthKey = format(new Date(log.date), 'MMM yyyy');
    if (!analytics.minutesByMonth[monthKey]) {
      analytics.minutesByMonth[monthKey] = 0;
    }
    analytics.minutesByMonth[monthKey] += log.duration;
  });
  
  analytics.totalLogs = logs.length;
  analytics.averageDifficulty = analytics.totalDifficulty / analytics.totalLogs;
  
  // Generate recent daily minutes (last 30 days)
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    return format(date, 'yyyy-MM-dd');
  });
  
  analytics.recentDailyMinutes = last30Days.map(dateStr => {
    const logForDate = logs.filter(log => {
      return format(new Date(log.date), 'yyyy-MM-dd') === dateStr;
    });
    
    const minutes = logForDate.reduce((sum, log) => sum + log.duration, 0);
    
    return {
      date: dateStr,
      minutes
    };
  });
  
  // Streak tracking
  const streakData = calculateStreak(logs);
  analytics.currentStreak = streakData.currentStreak;
  analytics.longestStreak = streakData.longestStreak;
  analytics.lastActive = streakData.lastActiveDate;

  // Topic proficiency tracking - Initialize with all topics properly
  const topicDifficultyPoints: Record<Topic, { points: number, count: number }> = {
    'arrays': { points: 0, count: 0 },
    'strings': { points: 0, count: 0 },
    'linkedlist': { points: 0, count: 0 },
    'trees': { points: 0, count: 0 },
    'graphs': { points: 0, count: 0 },
    'dp': { points: 0, count: 0 },
    'greedy': { points: 0, count: 0 },
    'backtracking': { points: 0, count: 0 }
  };
  
  logs.forEach(log => {
    if (!topicDifficultyPoints[log.topic]) {
      topicDifficultyPoints[log.topic] = { points: 0, count: 0 };
    }
    
    // Higher difficulty = more points
    topicDifficultyPoints[log.topic].points += log.difficulty * log.duration;
    topicDifficultyPoints[log.topic].count += 1;
  });
  
  // Calculate proficiency scores (higher score = higher proficiency)
  Object.keys(topicDifficultyPoints).forEach(topic => {
    const topicKey = topic as Topic;
    const { points, count } = topicDifficultyPoints[topicKey];
    if (count > 0) {
      analytics.topicProficiency[topicKey] = +(points / count).toFixed(1);
    } else {
      analytics.topicProficiency[topicKey] = 0;
    }
  });
  
  return analytics;
}

