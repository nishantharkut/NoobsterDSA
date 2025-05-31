
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock,
  BarChart3,
  Award
} from "lucide-react";
import { UserProgress } from "@/types/learning";

interface ProgressAnalyticsProps {
  userProgress: UserProgress;
}

const ProgressAnalytics = ({ userProgress }: ProgressAnalyticsProps) => {
  const solvedToday = 2; // Mock data
  const weeklyTarget = userProgress.weeklyGoal;
  const solvedThisWeek = userProgress.totalProblemsSolved % 7;
  const weeklyProgress = (solvedThisWeek / weeklyTarget) * 100;
  const averageTime = 23; // minutes
  const successRate = userProgress.totalProblemsSolved > 0 
    ? (userProgress.totalProblemsSolved / userProgress.totalProblemsAttempted) * 100 
    : 0;

  const getStreakMessage = (days: number) => {
    if (days === 0) return "Start your coding journey today!";
    if (days < 3) return "Keep going! You're building momentum.";
    if (days < 7) return "Great consistency! You're on fire! 🔥";
    if (days < 30) return "Amazing streak! You're a coding machine! ⚡";
    return "Legendary consistency! You're unstoppable! 🏆";
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Current Streak</p>
                <p className="text-2xl font-bold">{userProgress.streakDays} days</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Success Rate</p>
                <p className="text-2xl font-bold">{Math.round(successRate)}%</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Problems Solved</p>
                <p className="text-2xl font-bold">{userProgress.totalProblemsSolved}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg. Time</p>
                <p className="text-2xl font-bold">{averageTime}m</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">This Week's Goal</span>
              <Badge variant={weeklyProgress >= 100 ? "default" : "secondary"}>
                {solvedThisWeek}/{weeklyTarget} problems
              </Badge>
            </div>
            <Progress value={Math.min(weeklyProgress, 100)} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {weeklyProgress >= 100 
                ? "🎉 Weekly goal achieved! Keep up the great work!"
                : `${weeklyTarget - solvedThisWeek} more problems to reach your weekly goal`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Streak Motivation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Streak Motivation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl">
              {userProgress.streakDays === 0 ? "🌱" :
               userProgress.streakDays < 3 ? "🔥" :
               userProgress.streakDays < 7 ? "🚀" :
               userProgress.streakDays < 30 ? "⚡" : "🏆"}
            </div>
            <p className="font-medium">{getStreakMessage(userProgress.streakDays)}</p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{solvedToday}</div>
                <div className="text-xs text-muted-foreground">Today</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{solvedThisWeek}</div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{userProgress.totalProblemsSolved}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm">Your strongest topic</span>
              <Badge>Arrays & Strings</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm">Recommended next topic</span>
              <Badge variant="outline">Linked Lists</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm">Your preferred difficulty</span>
              <Badge className="bg-blue-100 text-blue-800">Easy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;
