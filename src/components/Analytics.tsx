
import { useMemo } from "react";
import { LogEntry, Topic } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClockIcon, TrendingUpIcon, CheckIcon, CalendarIcon } from "lucide-react";
import { generateAnalytics, formatMinutes, getMasteryLabel, getMasteryColorClass } from "@/utils/analytics";
import HeatmapChart from "@/components/HeatmapChart";

interface AnalyticsProps {
  logs: LogEntry[];
}

export default function Analytics({ logs }: AnalyticsProps) {
  const analytics = useMemo(() => generateAnalytics(logs), [logs]);
  
  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No logs yet. Start tracking your progress by creating logs!</p>
      </div>
    );
  }

  const topicMasteryData = Object.entries(analytics.topicMastery)
    .filter(([_, score]) => score > 0)
    .map(([topic, score]) => ({
      name: topic.charAt(0).toUpperCase() + topic.slice(1),
      score,
      label: getMasteryLabel(score)
    }))
    .sort((a, b) => b.score - a.score);

  // Data for time distribution chart
  const timeDistributionData = Object.entries(analytics.topicBreakdown)
    .filter(([_, count]) => count > 0)
    .map(([topic, count]) => {
      const topicLogs = logs.filter(log => log.topic === topic as Topic);
      const totalTime = topicLogs.reduce((sum, log) => sum + log.timeSpent, 0);
      
      return {
        name: topic.charAt(0).toUpperCase() + topic.slice(1),
        time: Math.round(totalTime / 60), // Convert to hours
        problems: count
      };
    })
    .sort((a, b) => b.time - a.time);

  // Weekly progress trend
  const weeklyTrendData = analytics.weeklyProgress
    .slice(-12) // Last 12 weeks
    .map(week => ({
      name: `Week ${week.week.split('-')[1]}`,
      problems: week.problems,
      time: Math.round(week.time / 60) // Convert to hours
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

  // Topic coverage chart
  const topicCoverageData = Object.entries(analytics.topicBreakdown)
    .map(([topic, count]) => ({
      name: topic.charAt(0).toUpperCase() + topic.slice(1),
      value: count
    }))
    .filter(item => item.value > 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.streak} days</div>
            <p className="text-xs text-muted-foreground">
              Longest: {analytics.longestStreak} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
            <CheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProblems}</div>
            <p className="text-xs text-muted-foreground">
              Average: {(analytics.totalProblems / (analytics.weeklyProgress.length || 1)).toFixed(1)} problems per week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMinutes(analytics.totalTime)}</div>
            <p className="text-xs text-muted-foreground">
              Average: {formatMinutes(analytics.totalTime / (analytics.weeklyProgress.length || 1))} per week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Focus Areas</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.suggestedFocus.map(topic => (
                <Badge key={topic} className={`tag-${topic}`}>
                  {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Suggested focus areas
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Heatmap chart */}
      <HeatmapChart data={analytics.heatmapData} className="w-full" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Coverage */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Topic Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicCoverageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {topicCoverageData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={TOPIC_COLORS[entry.name.toLowerCase() as Topic] || "#8884d8"} 
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

        {/* Time Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Time Distribution by Topic</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timeDistributionData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip 
                  formatter={(value: number) => [`${value} hours`, "Time spent"]}
                />
                <Bar dataKey="time" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Weekly Progress Trend */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Progress Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" />
                <Tooltip />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="problems" 
                  name="Problems" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="time" 
                  name="Hours" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Mastery Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Mastery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topicMasteryData.map((topic) => (
              <div key={topic.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">{topic.name}</span>
                    <Badge variant="outline" className={`ml-2 ${getMasteryColorClass(topic.score)}`}>
                      {topic.label}
                    </Badge>
                  </div>
                  <span className="text-sm">{topic.score}%</span>
                </div>
                <Progress value={topic.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
