
import { LogEntry, StreakData } from "@/types";

// Helper function to format date to YYYY-MM-DD
export function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get today's date in YYYY-MM-DD format
export function getTodayDateString(): string {
  return formatDateToYYYYMMDD(new Date());
}

// Check if two dates are consecutive
function areDatesConsecutive(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

// Calculate current streak based on array of log entries
export function calculateStreak(logs: LogEntry[]): StreakData {
  if (!logs.length) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: ''
    };
  }

  // Get unique dates from logs
  const activeDates = Array.from(
    new Set(
      logs.map(log => formatDateToYYYYMMDD(new Date(log.date)))
    )
  ).sort();

  const today = getTodayDateString();
  const yesterday = formatDateToYYYYMMDD(
    new Date(new Date().setDate(new Date().getDate() - 1))
  );

  // Check if active today or yesterday to maintain streak
  const lastActiveDate = activeDates[activeDates.length - 1];
  const isActiveToday = lastActiveDate === today;
  const isActiveYesterday = lastActiveDate === yesterday;

  // If not active yesterday or today, streak is broken
  if (!isActiveToday && !isActiveYesterday) {
    return {
      currentStreak: 0,
      longestStreak: calculateLongestStreak(activeDates),
      lastActiveDate
    };
  }

  // Calculate current streak
  let currentStreak = 1;
  for (let i = activeDates.length - 2; i >= 0; i--) {
    if (areDatesConsecutive(activeDates[i], activeDates[i + 1])) {
      currentStreak++;
    } else {
      break;
    }
  }

  const longestStreak = Math.max(currentStreak, calculateLongestStreak(activeDates));

  return {
    currentStreak,
    longestStreak,
    lastActiveDate
  };
}

// Calculate longest streak from a sorted array of date strings
function calculateLongestStreak(dates: string[]): number {
  if (!dates.length) return 0;
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    if (areDatesConsecutive(dates[i-1], dates[i])) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
}

// Generate heatmap data from logs
export function generateHeatmapData(logs: LogEntry[]): Array<{date: string, count: number}> {
  // Group logs by date
  const dateGroups: Record<string, number> = {};
  
  logs.forEach(log => {
    const dateStr = formatDateToYYYYMMDD(new Date(log.date));
    if (!dateGroups[dateStr]) {
      dateGroups[dateStr] = 0;
    }
    dateGroups[dateStr] += log.problemCount;
  });
  
  // Get start date (365 days ago)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);
  
  // Generate complete date range with zeros for missing dates
  const result = [];
  const currentDate = new Date(startDate);
  const today = new Date();
  
  while (currentDate <= today) {
    const dateStr = formatDateToYYYYMMDD(currentDate);
    result.push({
      date: dateStr,
      count: dateGroups[dateStr] || 0
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
}

// Save data to localStorage with fallback
export function saveToLocalStorage(key: string, data: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
    return false;
  }
}

// Load data from localStorage with fallback
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage: ${error}`);
    return defaultValue;
  }
}

// Check if offline capability is supported
export function isOfflineSupported(): boolean {
  return 'localStorage' in window && 'serviceWorker' in navigator;
}

// Register service worker for PWA support
export async function registerServiceWorker(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('ServiceWorker registration successful with scope:', registration.scope);
      return true;
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
      return false;
    }
  }
  return false;
}
