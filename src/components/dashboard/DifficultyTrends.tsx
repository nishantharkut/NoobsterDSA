
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { LogEntry, DifficultyLevel } from "@/types";
import { format, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';

interface DifficultyTrendsProps {
  logs: LogEntry[];
  weeks?: number;
}

export default function DifficultyTrends({ logs, weeks = 4 }: DifficultyTrendsProps) {
  // Generate data for the chart
  const trendsData = React.useMemo(() => {
    const now = new Date();
    const weeksData = [];
    
    // Create data for each of the past weeks
    for (let i = 0; i < weeks; i++) {
      const weekStart = startOfWeek(subWeeks(now, i));
      const weekEnd = endOfWeek(weekStart);
      
      // Filter logs for this week
      const weekLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
      });
      
      // Count problems by difficulty
      const easy = weekLogs.filter(log => log.difficultyLevel === 'easy')
        .reduce((sum, log) => sum + log.problemCount, 0);
      const medium = weekLogs.filter(log => log.difficultyLevel === 'medium')
        .reduce((sum, log) => sum + log.problemCount, 0);
      const hard = weekLogs.filter(log => log.difficultyLevel === 'hard')
        .reduce((sum, log) => sum + log.problemCount, 0);
      
      weeksData.push({
        week: format(weekStart, "'W'w"),
        easy,
        medium,
        hard,
        total: easy + medium + hard
      });
    }
    
    return weeksData.reverse();
  }, [logs, weeks]);

  const DIFFICULTY_COLORS = {
    easy: "#10b981", // green
    medium: "#f59e0b", // yellow
    hard: "#ef4444", // red
  };

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Difficulty Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendsData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="easy" 
              name="Easy" 
              stroke={DIFFICULTY_COLORS.easy} 
              strokeWidth={2} 
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="medium" 
              name="Medium" 
              stroke={DIFFICULTY_COLORS.medium} 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="hard" 
              name="Hard" 
              stroke={DIFFICULTY_COLORS.hard} 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
