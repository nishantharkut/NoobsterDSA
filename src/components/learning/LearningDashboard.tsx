
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  Target, 
  BookOpen, 
  Code, 
  Trophy,
  Clock,
  ArrowRight,
  CheckCircle,
  Lock
} from "lucide-react";
import { UserProgress, LearningModule } from "@/types/learning";

interface LearningDashboardProps {
  userProgress: UserProgress;
  modules: LearningModule[];
  onModuleClick: (moduleId: string) => void;
  onProblemClick: (problemId: string) => void;
}

const LearningDashboard = ({ 
  userProgress, 
  modules, 
  onModuleClick, 
  onProblemClick 
}: LearningDashboardProps) => {
  const currentModule = modules.find(m => m.track === userProgress.currentTrack);
  const completedModules = modules.filter(m => m.completionPercentage === 100);
  const weekProgress = (userProgress.totalProblemsSolved % 7) / 7 * 100;

  const badges = [
    { name: "First Steps", icon: "🎯", unlocked: userProgress.totalProblemsSolved >= 1 },
    { name: "Streak Starter", icon: "🔥", unlocked: userProgress.streakDays >= 3 },
    { name: "Problem Solver", icon: "💡", unlocked: userProgress.totalProblemsSolved >= 10 },
    { name: "Dedicated Learner", icon: "📚", unlocked: userProgress.streakDays >= 7 },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-6 h-6 text-orange-500 mr-2" />
              <span className="text-2xl font-bold">{userProgress.streakDays}</span>
            </div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{userProgress.totalProblemsSolved}</span>
            </div>
            <p className="text-sm text-muted-foreground">Problems Solved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold">{userProgress.badges.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{completedModules.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Modules Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>This week's goal</span>
              <span>{userProgress.totalProblemsSolved % 7}/{userProgress.weeklyGoal} problems</span>
            </div>
            <Progress value={weekProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Current Learning Track */}
      {currentModule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Continue Learning
              </div>
              <Badge variant="secondary">{currentModule.track}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{currentModule.title}</h3>
                <p className="text-muted-foreground">{currentModule.subtitle}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(currentModule.completionPercentage)}%</span>
                </div>
                <Progress value={currentModule.completionPercentage} />
              </div>
              <Button 
                onClick={() => onModuleClick(currentModule.id)} 
                className="w-full"
              >
                Continue Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Tracks Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Learning Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => (
            <Card 
              key={module.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                module.isLocked ? 'opacity-60' : 'hover:scale-105'
              }`}
              onClick={() => !module.isLocked && onModuleClick(module.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  {module.isLocked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : module.completionPercentage === 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Code className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{module.subtitle}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{Math.round(module.completionPercentage)}%</span>
                  </div>
                  <Progress value={module.completionPercentage} className="h-2" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{module.problems.length} problems</span>
                  <span>~{module.estimatedTime}h</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index}
                className={`text-center p-3 rounded-lg border ${
                  badge.unlocked 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-sm font-medium">{badge.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningDashboard;
