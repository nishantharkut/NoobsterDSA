
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Play, 
  Clock,
  Users,
  Star,
  ArrowRight,
  Code,
  Target
} from "lucide-react";
import { LearningModule, UserProgress } from "@/types/learning";

interface LearningPathProps {
  modules: LearningModule[];
  userProgress: UserProgress;
  onModuleClick: (moduleId: string) => void;
  onProblemClick: (problemId: string) => void;
}

const LearningPath = ({ modules, userProgress, onModuleClick, onProblemClick }: LearningPathProps) => {
  const getTrackIcon = (track: string) => {
    switch (track) {
      case 'arrays-strings': return '📊';
      case 'linked-lists': return '🔗';
      case 'stacks-queues': return '📚';
      case 'hash-tables': return '🗃️';
      case 'binary-trees': return '🌳';
      case 'binary-search-trees': return '🔍';
      case 'graphs': return '🕸️';
      case 'dynamic-programming': return '⚡';
      case 'sorting-searching': return '🔢';
      case 'advanced-algorithms': return '🚀';
      default: return '💡';
    }
  };

  const getTrackColor = (track: string) => {
    const colors = {
      'arrays-strings': 'bg-blue-50 border-blue-200 text-blue-900',
      'linked-lists': 'bg-purple-50 border-purple-200 text-purple-900',
      'stacks-queues': 'bg-green-50 border-green-200 text-green-900',
      'hash-tables': 'bg-orange-50 border-orange-200 text-orange-900',
      'binary-trees': 'bg-emerald-50 border-emerald-200 text-emerald-900',
      'binary-search-trees': 'bg-cyan-50 border-cyan-200 text-cyan-900',
      'graphs': 'bg-indigo-50 border-indigo-200 text-indigo-900',
      'dynamic-programming': 'bg-yellow-50 border-yellow-200 text-yellow-900',
      'sorting-searching': 'bg-pink-50 border-pink-200 text-pink-900',
      'advanced-algorithms': 'bg-red-50 border-red-200 text-red-900'
    };
    return colors[track as keyof typeof colors] || 'bg-gray-50 border-gray-200 text-gray-900';
  };

  const getDifficultyBadge = (difficulty: string) => {
    const styles = {
      'beginner': 'bg-green-100 text-green-800 border-green-200',
      'easy': 'bg-blue-100 text-blue-800 border-blue-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'hard': 'bg-red-100 text-red-800 border-red-200'
    };
    return styles[difficulty as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-8">
      {/* Learning Path Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {modules.filter(m => m.completionPercentage === 100).length}/{modules.length} tracks completed
              </span>
            </div>
            <Progress 
              value={(modules.filter(m => m.completionPercentage === 100).length / modules.length) * 100} 
              className="h-3"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{userProgress.totalProblemsSolved}</div>
                <div className="text-xs text-muted-foreground">Problems Solved</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{userProgress.streakDays}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{userProgress.badges.length}</div>
                <div className="text-xs text-muted-foreground">Badges Earned</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{userProgress.weeklyGoal}</div>
                <div className="text-xs text-muted-foreground">Weekly Goal</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module, index) => {
          const isActive = module.track === userProgress.currentTrack;
          const isCompleted = module.completionPercentage === 100;
          const canAccess = !module.isLocked;
          
          return (
            <Card 
              key={module.id}
              className={`relative transition-all hover:shadow-lg ${
                isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              } ${!canAccess ? 'opacity-60' : 'cursor-pointer hover:scale-105'}`}
              onClick={() => canAccess && onModuleClick(module.id)}
            >
              {isActive && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Current
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getTrackIcon(module.track)}</div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{module.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {module.isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                    {!isCompleted && !module.isLocked && <Play className="w-5 h-5 text-blue-500" />}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {module.description}
                </p>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getTrackColor(module.track)}`}>
                  {module.track.replace('-', ' & ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(module.completionPercentage)}%</span>
                  </div>
                  <Progress value={module.completionPercentage} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    <span>{module.problems.length} problems</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>~{module.estimatedTime}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>2.1k learners</span>
                  </div>
                </div>
                
                {canAccess && (
                  <Button 
                    className="w-full flex items-center gap-2" 
                    variant={isActive ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onModuleClick(module.id);
                    }}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Review
                      </>
                    ) : isActive ? (
                      <>
                        <Play className="w-4 h-4" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        Start Learning
                      </>
                    )}
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                )}
                
                {module.isLocked && (
                  <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground">
                      Complete previous tracks to unlock
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recommended Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">Continue Current Track</h3>
                  <p className="text-sm text-blue-700">
                    Keep building momentum with {userProgress.currentTrack.replace('-', ' & ')}
                  </p>
                </div>
                <Button size="sm" onClick={() => {
                  const currentModule = modules.find(m => m.track === userProgress.currentTrack);
                  if (currentModule) onModuleClick(currentModule.id);
                }}>
                  Continue
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-green-900">Practice Problem</h3>
                  <p className="text-sm text-green-700">
                    Solve a quick problem to maintain your streak
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => onProblemClick("two-sum")}>
                  Practice
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPath;
