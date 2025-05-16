
import { PlatformPattern, Platform, DifficultyLevel } from '@/types';

// Platform detection patterns
export const platformPatterns: PlatformPattern[] = [
  {
    platform: 'leetcode',
    urlPattern: /leetcode\.com\/problems\//i,
    difficultyExtractor: (url: string) => {
      // LeetCode difficulty can be extracted from the URL or page content
      // This is a simple implementation; in real-world, we might need more complex logic
      if (url.includes('/easy/')) return 'easy';
      if (url.includes('/medium/')) return 'medium';
      if (url.includes('/hard/')) return 'hard';
      return null;
    }
  },
  {
    platform: 'codeforces',
    urlPattern: /codeforces\.com\/problemset\/problem\//i,
    difficultyExtractor: (url: string) => {
      // Extract rating from URL if present, or default to medium
      // In Codeforces, problems are rated by numbers (800, 900, etc.)
      // We'll map ranges to our difficulty levels
      const match = url.match(/\/(\d+)\/\w+$/);
      if (match) {
        const rating = parseInt(match[1]);
        if (rating < 1300) return 'easy';
        if (rating < 1900) return 'medium';
        return 'hard';
      }
      return null;
    }
  },
  {
    platform: 'hackerrank',
    urlPattern: /hackerrank\.com\/challenges\//i
  },
  {
    platform: 'codechef',
    urlPattern: /codechef\.com\/problems\//i
  },
  {
    platform: 'atcoder',
    urlPattern: /atcoder\.jp\/contests\/.+\/tasks\//i,
    difficultyExtractor: (url: string) => {
      // AtCoder problems are labeled A, B, C, etc.
      // A, B are usually easy, C, D medium, E, F, etc. hard
      const match = url.match(/tasks\/([A-Za-z]+)/);
      if (match) {
        const task = match[1].toUpperCase();
        if (['A', 'B'].includes(task)) return 'easy';
        if (['C', 'D'].includes(task)) return 'medium';
        return 'hard';
      }
      return null;
    }
  },
  {
    platform: 'geeksforgeeks',
    urlPattern: /geeksforgeeks\.org\/problems\//i
  }
];

// Function to detect platform and difficulty from URL
export function detectPlatformAndDifficulty(url: string): {
  platform: Platform | null;
  difficulty: DifficultyLevel | null;
} {
  if (!url) {
    return { platform: null, difficulty: null };
  }

  for (const pattern of platformPatterns) {
    if (pattern.urlPattern.test(url)) {
      const difficulty = pattern.difficultyExtractor ? pattern.difficultyExtractor(url) : null;
      return { platform: pattern.platform, difficulty };
    }
  }

  return { platform: null, difficulty: null };
}

// Function to extract problem title from URL
export function extractProblemTitle(url: string): string {
  if (!url) return '';

  try {
    // Extract the last segment of the URL path and replace hyphens with spaces
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (!lastSegment) return '';
    
    // Clean up the title: replace hyphens with spaces, remove file extensions
    return lastSegment
      .replace(/\.html?$/, '')
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch (e) {
    console.error('Error extracting problem title:', e);
    return '';
  }
}

// Function to generate suggested tags from URL and title
export function suggestTags(url: string, title: string): string[] {
  const tags: Set<string> = new Set();
  
  // Extract tags from URL
  const urlLower = url.toLowerCase();
  
  // Common problem types in URLs
  const problemTypes = [
    'array', 'string', 'linked-list', 'binary-tree', 'tree', 'graph',
    'dp', 'dynamic-programming', 'greedy', 'backtracking', 'recursion',
    'sorting', 'search', 'binary-search', 'dfs', 'bfs', 'union-find',
    'stack', 'queue', 'heap', 'hash', 'map', 'set', 'two-pointer',
    'sliding-window', 'bit', 'math', 'matrix', 'simulation'
  ];
  
  // Check if any problem type is in the URL
  for (const type of problemTypes) {
    if (urlLower.includes(type)) {
      tags.add(type);
    }
  }
  
  // Extract tags from title
  if (title) {
    const titleLower = title.toLowerCase();
    for (const type of problemTypes) {
      if (titleLower.includes(type.replace('-', ' '))) {
        tags.add(type);
      }
    }
  }
  
  return Array.from(tags);
}
