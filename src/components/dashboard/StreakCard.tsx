
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export default function StreakCard({ currentStreak, longestStreak, lastActiveDate }: StreakCardProps) {
  // Calculate days since last active
  const daysSinceActive = lastActiveDate ? 
    formatDistanceToNow(new Date(lastActiveDate), { addSuffix: true }) : 
    'No activity yet';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{currentStreak} days</div>
          {currentStreak > 0 && (
            <div className="flex">
              {[...Array(Math.min(currentStreak, 5))].map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 h-2 rounded-full bg-primary mx-0.5"
                />
              ))}
              {currentStreak > 5 && <div className="text-xs self-end ml-1">+{currentStreak - 5}</div>}
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1 flex justify-between">
          <span>Longest: {longestStreak} days</span>
          <span>Last active: {daysSinceActive}</span>
        </div>
      </CardContent>
    </Card>
  );
}
