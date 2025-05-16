import { LogEntry, WeeklyGoal } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { formatMinutes, generateAnalytics } from "@/utils/analytics";
import { ClockIcon, TrendingUpIcon, CheckIcon, CalendarIcon } from "lucide-react";
import StreakCard from "./dashboard/StreakCard";
import RecentActivity from "./dashboard/RecentActivity";
import DifficultyTrends from "./dashboard/DifficultyTrends";
import GoalCompletion from "./dashboard/GoalCompletion";

interface DashboardProps {
  logs: LogEntry[];
  goals: WeeklyGoal[];
  recentDays?: number;
}

export default function Dashboard({ logs, goals, recentDays = 30 }: DashboardProps) {
  // Filter logs for recent data
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - recentDays);
  
  const recentLogs = logs.filter((log) => new Date(log.date) >= recentDate);
  
  // Generate analytics
  const allTimeAnalytics = generateAnalytics(logs);
  const recentAnalytics = generateAnalytics(recentLogs);

  // Check if we have any data to display
  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No logs yet. Start tracking your progress by creating logs!</p>
      </div>
    );
  }

  // Format data for charts
  const topicChartData = Object.entries(allTimeAnalytics.topicBreakdown)
    .filter(([_, count]) => count > 0)
    .map(([topic, count]) => ({
      name: topic.charAt(0).toUpperCase() + topic.slice(1),
      value: count,
    }));

  const difficultyChartData = Object.entries(allTimeAnalytics.difficultyBreakdown)
    .filter(([_, count]) => count > 0)
    .map(([difficulty, count]) => ({
      name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      value: count,
    }));

  const weeklyProgressData = allTimeAnalytics.weeklyProgress
    .slice(-8) // Last 8 weeks
    .map((week) => ({
      name: `Week ${week.week.split('-')[1]}`,
      problems: week.problems,
      time: Math.round(week.time / 60), // Convert to hours for better visualization
    }));

  // Custom colors
  const TOPIC_COLORS = {
    arrays: "hsl(var(--arrays))",
    strings: "hsl(var(--strings))",
    linkedlist: "hsl(var(--linkedlist))",
    trees: "hsl(var(--trees))",
    graphs: "hsl(var(--graphs))",
    dp: "hsl(var(--dp))",
    greedy: "hsl(var(--greedy))",
    backtracking: "hsl(var(--backtracking))",
    other: "hsl(var(--muted))",
  };

  const DIFFICULTY_COLORS = {
    easy: "#10b981", // green
    medium: "#f59e0b", // yellow
    hard: "#ef4444", // red
  };

  // Get the most practiced topic
  const sortedTopics = [...Object.entries(allTimeAnalytics.topicBreakdown)]
    .sort((a, b) => b[1] - a[1]);
  const topTopic = sortedTopics.length > 0 ? sortedTopics[0][0] : null;

  return (
    <div className="space-y-8">
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StreakCard 
          currentStreak={allTimeAnalytics.streak}
          longestStreak={allTimeAnalytics.longestStreak}
          lastActiveDate={allTimeAnalytics.lastActive}
        />
        
        {/* Total Problems Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
            <CheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTimeAnalytics.totalProblems}</div>
            {recentAnalytics.totalProblems > 0 && (
              <p className="text-xs text-muted-foreground">
                {recentAnalytics.totalProblems} in the last {recentDays} days
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Total Time Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMinutes(allTimeAnalytics.totalTime)}</div>
            {recentAnalytics.totalTime > 0 && (
              <p className="text-xs text-muted-foreground">
                {formatMinutes(recentAnalytics.totalTime)} in the last {recentDays} days
              </p>
            )}
          </CardContent>
        </Card>

        {/* Most Practiced Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Most Practiced</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {topTopic ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`tag-${topTopic}`}>
                    {topTopic.charAt(0).toUpperCase() + topTopic.slice(1)}
                  </Badge>
                  <span className="text-xl font-bold">{allTimeAnalytics.topicBreakdown[topTopic]}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">problems solved</p>
              </>
            ) : (
              <div className="text-muted-foreground">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Middle section with Topic distribution and Goal Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Topic Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {topicChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={TOPIC_COLORS[entry.name.toLowerCase()] || "#8884d8"} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} problems`, "Problems solved"]}
                  labelFormatter={(value) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Goal Completion */}
        <div className="col-span-1">
          <GoalCompletion goals={goals} />
        </div>
      </div>

      {/* Bottom section with Difficulty distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Difficulty Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {difficultyChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={DIFFICULTY_COLORS[entry.name.toLowerCase()] || "#8884d8"} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} problems`, "Problems solved"]}
                  labelFormatter={(value) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="col-span-1">
          <RecentActivity logs={logs} />
        </div>
      </div>

      {/* Difficulty Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <DifficultyTrends logs={logs} />
      </div>

      {/* Weekly Progress */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyProgressData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === "problems") return [`${value} problems`, "Problems Solved"];
                  if (name === "time") return [`${value} hours`, "Hours Spent"];
                  return [value, name];
                }}
              />
              <Bar yAxisId="left" dataKey="problems" fill="hsl(var(--primary))" name="Problems" />
              <Bar yAxisId="right" dataKey="time" fill="hsl(var(--secondary))" name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
