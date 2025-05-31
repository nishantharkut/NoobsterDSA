
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Home,
  BarChart3,
  Trophy,
  Map,
  User
} from "lucide-react";
import { UserProgress, LearningModule } from "@/types/learning";
import ProgressAnalytics from "./ProgressAnalytics";
import BadgeSystem from "./BadgeSystem";
import LearningPath from "./LearningPath";

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
  const [activeTab, setActiveTab] = useState("overview");

  // Quick stats for the overview
  const completedModules = modules.filter(m => m.completionPercentage === 100);
  const currentModule = modules.find(m => m.track === userProgress.currentTrack);
  const weekProgress = (userProgress.totalProblemsSolved % 7) / userProgress.weeklyGoal * 100;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back to your DSA journey! 🚀
        </h1>
        <p className="text-muted-foreground">
          You're on a {userProgress.streakDays}-day streak and have solved {userProgress.totalProblemsSolved} problems!
        </p>
      </div>

      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="path" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Learning Path</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Badges</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Continue Learning Card */}
            {currentModule && (
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:scale-105 transition-all">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Continue Learning</h3>
                  <p className="text-blue-100 mb-4">{currentModule.title}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {Math.round(currentModule.completionPercentage)}% complete
                    </Badge>
                    <button 
                      onClick={() => onModuleClick(currentModule.id)}
                      className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Continue →
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Practice Card */}
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer hover:scale-105 transition-all">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Quick Practice</h3>
                <p className="text-green-100 mb-4">Solve a problem to maintain your streak</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {userProgress.streakDays} day streak
                  </Badge>
                  <button 
                    onClick={() => onProblemClick("two-sum")}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Practice →
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Goal Card */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Weekly Goal</h3>
                <p className="text-purple-100 mb-4">
                  {Math.min(userProgress.totalProblemsSolved % 7, userProgress.weeklyGoal)}/{userProgress.weeklyGoal} problems
                </p>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(weekProgress, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Solved: Two Sum</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Easy</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Started: Valid Palindrome</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Easy</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Earned: First Steps Badge</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Achievement</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userProgress.totalProblemsSolved}</div>
                    <div className="text-sm text-muted-foreground">Problems Solved</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userProgress.streakDays}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{userProgress.badges.length}</div>
                    <div className="text-sm text-muted-foreground">Badges Earned</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{completedModules.length}</div>
                    <div className="text-sm text-muted-foreground">Tracks Complete</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Learning Path Tab */}
        <TabsContent value="path">
          <LearningPath 
            modules={modules}
            userProgress={userProgress}
            onModuleClick={onModuleClick}
            onProblemClick={onProblemClick}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <ProgressAnalytics userProgress={userProgress} />
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges">
          <BadgeSystem userProgress={userProgress} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningDashboard;
