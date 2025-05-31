
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Zap, 
  Award,
  Crown,
  Shield,
  Gem,
  Rocket
} from "lucide-react";
import { UserProgress } from "@/types/learning";

interface BadgeSystemProps {
  userProgress: UserProgress;
}

const BadgeSystem = ({ userProgress }: BadgeSystemProps) => {
  const badges = [
    {
      id: "first-solve",
      name: "First Steps",
      description: "Solve your first problem",
      icon: Star,
      unlocked: userProgress.totalProblemsSolved >= 1,
      progress: Math.min(userProgress.totalProblemsSolved, 1),
      target: 1,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 border-yellow-200"
    },
    {
      id: "streak-3",
      name: "Streak Starter",
      description: "Maintain a 3-day coding streak",
      icon: Flame,
      unlocked: userProgress.streakDays >= 3,
      progress: Math.min(userProgress.streakDays, 3),
      target: 3,
      color: "text-orange-500",
      bgColor: "bg-orange-50 border-orange-200"
    },
    {
      id: "problem-solver",
      name: "Problem Solver",
      description: "Solve 10 problems",
      icon: Target,
      unlocked: userProgress.totalProblemsSolved >= 10,
      progress: Math.min(userProgress.totalProblemsSolved, 10),
      target: 10,
      color: "text-green-500",
      bgColor: "bg-green-50 border-green-200"
    },
    {
      id: "week-warrior",
      name: "Week Warrior",
      description: "Maintain a 7-day coding streak",
      icon: Shield,
      unlocked: userProgress.streakDays >= 7,
      progress: Math.min(userProgress.streakDays, 7),
      target: 7,
      color: "text-blue-500",
      bgColor: "bg-blue-50 border-blue-200"
    },
    {
      id: "speed-demon",
      name: "Speed Demon",
      description: "Solve a problem in under 10 minutes",
      icon: Zap,
      unlocked: false, // This would be tracked separately
      progress: 0,
      target: 1,
      color: "text-purple-500",
      bgColor: "bg-purple-50 border-purple-200"
    },
    {
      id: "dedicated-learner",
      name: "Dedicated Learner",
      description: "Complete your first learning track",
      icon: Award,
      unlocked: false, // Based on completed tracks
      progress: 0,
      target: 1,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 border-indigo-200"
    },
    {
      id: "consistency-king",
      name: "Consistency King",
      description: "Maintain a 30-day coding streak",
      icon: Crown,
      unlocked: userProgress.streakDays >= 30,
      progress: Math.min(userProgress.streakDays, 30),
      target: 30,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 border-yellow-300"
    },
    {
      id: "century-club",
      name: "Century Club",
      description: "Solve 100 problems",
      icon: Gem,
      unlocked: userProgress.totalProblemsSolved >= 100,
      progress: Math.min(userProgress.totalProblemsSolved, 100),
      target: 100,
      color: "text-pink-500",
      bgColor: "bg-pink-50 border-pink-200"
    },
    {
      id: "rocket-scientist",
      name: "Rocket Scientist",
      description: "Master advanced algorithms",
      icon: Rocket,
      unlocked: false, // Based on advanced track completion
      progress: 0,
      target: 1,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 border-cyan-200"
    }
  ];

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const nextBadges = badges.filter(badge => !badge.unlocked).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Earned Badges ({unlockedBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unlockedBadges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedBadges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border-2 ${badge.bgColor} transition-all hover:scale-105`}
                  >
                    <div className="text-center space-y-2">
                      <div className={`inline-flex p-3 rounded-full bg-white ${badge.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      <Badge className="bg-green-100 text-green-800">Unlocked!</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">Complete your first challenge to earn your first badge!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Badges to Unlock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Next Badges to Unlock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nextBadges.map((badge) => {
              const IconComponent = badge.icon;
              const progressPercentage = (badge.progress / badge.target) * 100;
              
              return (
                <div
                  key={badge.id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50 transition-all hover:bg-gray-100"
                >
                  <div className="text-center space-y-3">
                    <div className="inline-flex p-3 rounded-full bg-gray-200 text-gray-400">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-700">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{badge.progress}/{badge.target}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {badge.target - badge.progress} more to unlock
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badge Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{unlockedBadges.length}</div>
              <div className="text-sm text-muted-foreground">Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{badges.length - unlockedBadges.length}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((unlockedBadges.length / badges.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeSystem;
