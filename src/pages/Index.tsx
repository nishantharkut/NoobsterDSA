
import { useState, useEffect } from "react";
import { UserProgress, LearningModule, Problem } from "@/types/learning";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import LearningDashboard from "@/components/learning/LearningDashboard";
import CodeEditor from "@/components/coding/CodeEditor";
import { useToast } from "@/components/ui/use-toast";
import { loadFromLocalStorage, saveToLocalStorage } from "@/utils/streakTracking";
import { sampleProblems } from "@/data/sampleProblems";

const Index = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(() => {
    return loadFromLocalStorage("userProgress", null);
  });
  
  const [currentView, setCurrentView] = useState<"dashboard" | "problem" | "module">("dashboard");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  
  const { toast } = useToast();

  // Sample data - enhanced with more realistic content
  const [modules] = useState<LearningModule[]>([
    {
      id: "arrays-strings-module",
      track: "arrays-strings",
      title: "Arrays & Strings",
      subtitle: "Master the building blocks of programming",
      description: "Learn fundamental data structures including arrays, strings, and basic manipulation techniques. Perfect for beginners starting their DSA journey.",
      estimatedTime: 12,
      prerequisiteModules: [],
      problems: ["two-sum", "valid-palindrome", "best-time-stock", "contains-duplicate"],
      theoryContent: "Arrays and strings are the foundation of data structures...",
      isLocked: false,
      completionPercentage: userProgress?.currentTrack === "arrays-strings" ? 65 : 0
    },
    {
      id: "linked-lists-module",
      track: "linked-lists",
      title: "Linked Lists",
      subtitle: "Connect the dots with dynamic data",
      description: "Understanding pointers and dynamic data structures. Learn to manipulate linked lists and solve classic problems.",
      estimatedTime: 8,
      prerequisiteModules: ["arrays-strings-module"],
      problems: ["reverse-linked-list", "merge-two-lists", "cycle-detection"],
      theoryContent: "Linked lists are dynamic data structures...",
      isLocked: userProgress?.currentTrack === "arrays-strings" && userProgress?.totalProblemsSolved < 3,
      completionPercentage: 0
    },
    {
      id: "stacks-queues-module",
      track: "stacks-queues",
      title: "Stacks & Queues",
      subtitle: "LIFO and FIFO data structures",
      description: "Master stack and queue operations, and learn when to use each data structure effectively.",
      estimatedTime: 6,
      prerequisiteModules: ["linked-lists-module"],
      problems: ["valid-parentheses", "implement-queue", "min-stack"],
      theoryContent: "Stacks and queues are essential data structures...",
      isLocked: true,
      completionPercentage: 0
    },
    {
      id: "hash-tables-module",
      track: "hash-tables",
      title: "Hash Tables",
      subtitle: "Fast lookups and data organization",
      description: "Learn about hash functions, collision resolution, and efficient data storage and retrieval.",
      estimatedTime: 10,
      prerequisiteModules: ["arrays-strings-module"],
      problems: ["group-anagrams", "top-k-frequent", "word-pattern"],
      theoryContent: "Hash tables provide O(1) average lookup time...",
      isLocked: true,
      completionPercentage: 0
    },
    {
      id: "binary-trees-module",
      track: "binary-trees",
      title: "Binary Trees",
      subtitle: "Hierarchical data structures",
      description: "Explore tree traversals, binary tree properties, and fundamental tree algorithms.",
      estimatedTime: 14,
      prerequisiteModules: ["linked-lists-module"],
      problems: ["tree-traversal", "max-depth", "symmetric-tree"],
      theoryContent: "Binary trees are hierarchical data structures...",
      isLocked: true,
      completionPercentage: 0
    },
    {
      id: "dynamic-programming-module",
      track: "dynamic-programming",
      title: "Dynamic Programming",
      subtitle: "Optimize with memoization",
      description: "Master the art of breaking down complex problems and avoiding redundant calculations.",
      estimatedTime: 16,
      prerequisiteModules: ["binary-trees-module"],
      problems: ["fibonacci", "climbing-stairs", "coin-change"],
      theoryContent: "Dynamic programming optimizes recursive solutions...",
      isLocked: true,
      completionPercentage: 0
    }
  ]);

  useEffect(() => {
    if (userProgress) {
      saveToLocalStorage("userProgress", userProgress);
    }
  }, [userProgress]);

  const handleOnboardingComplete = (userData: Partial<UserProgress>) => {
    const newUserProgress: UserProgress = {
      userId: `user-${Date.now()}`,
      solvedProblems: [],
      currentTrack: "arrays-strings",
      preferredLanguage: userData.preferredLanguage || "python",
      streakDays: 0,
      totalProblemsAttempted: 0,
      totalProblemsSolved: 0,
      badges: [],
      weeklyGoal: userData.timeCommitment === 15 ? 3 : userData.timeCommitment === 30 ? 5 : 7,
      onboardingCompleted: true,
      experienceLevel: userData.experienceLevel || "complete-beginner",
      learningGoal: userData.learningGoal || "personal",
      timeCommitment: userData.timeCommitment || 30
    };
    
    setUserProgress(newUserProgress);
    toast({
      title: "🎉 Welcome to your DSA journey!",
      description: "Let's start with Arrays & Strings - the foundation of all programming!",
    });
  };

  const handleModuleClick = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module && !module.isLocked) {
      setSelectedModule(module);
      setCurrentView("module");
    } else if (module?.isLocked) {
      toast({
        title: "Module Locked",
        description: "Complete the prerequisite modules to unlock this content.",
        variant: "destructive"
      });
    }
  };

  const handleProblemClick = (problemId: string) => {
    const problem = sampleProblems.find(p => p.id === problemId);
    if (problem) {
      setSelectedProblem(problem);
      setCurrentView("problem");
    } else {
      // Fallback to first problem if specific one not found
      setSelectedProblem(sampleProblems[0]);
      setCurrentView("problem");
    }
  };

  const handleCodeSubmit = (code: string, isCorrect: boolean, attempts: number, hintsUsed: number) => {
    if (isCorrect && userProgress && selectedProblem) {
      const newStreakDays = userProgress.streakDays + (userProgress.solvedProblems.length === 0 ? 1 : 0);
      const updatedProgress = {
        ...userProgress,
        totalProblemsSolved: userProgress.totalProblemsSolved + 1,
        totalProblemsAttempted: userProgress.totalProblemsAttempted + 1,
        solvedProblems: [...userProgress.solvedProblems, selectedProblem.id],
        streakDays: newStreakDays
      };
      
      setUserProgress(updatedProgress);
      
      // Check for new badges
      const badges = [];
      if (updatedProgress.totalProblemsSolved === 1) {
        badges.push({ id: "first-solve", name: "First Steps", description: "Solved first problem", icon: "⭐", unlockedAt: new Date() });
      }
      if (updatedProgress.streakDays === 3) {
        badges.push({ id: "streak-3", name: "Streak Starter", description: "3-day streak", icon: "🔥", unlockedAt: new Date() });
      }
      if (updatedProgress.totalProblemsSolved === 10) {
        badges.push({ id: "problem-solver", name: "Problem Solver", description: "10 problems solved", icon: "🎯", unlockedAt: new Date() });
      }
      
      if (badges.length > 0) {
        setUserProgress(prev => prev ? { ...prev, badges: [...prev.badges, ...badges] } : prev);
        toast({
          title: `🏆 New Badge${badges.length > 1 ? 's' : ''} Unlocked!`,
          description: badges.map(b => b.name).join(', '),
        });
      }
      
      toast({
        title: "🎉 Problem Solved!",
        description: `Excellent work! You solved "${selectedProblem.title}" in ${attempts} attempts using ${hintsUsed} hints.`,
      });
      
      // Return to dashboard after a short delay
      setTimeout(() => {
        setCurrentView("dashboard");
        setSelectedProblem(null);
      }, 3000);
    } else if (userProgress) {
      const updatedProgress = {
        ...userProgress,
        totalProblemsAttempted: userProgress.totalProblemsAttempted + 1
      };
      setUserProgress(updatedProgress);
      
      if (attempts > 3) {
        toast({
          title: "Keep trying!",
          description: "Don't give up! Use the hints if you're stuck. Every attempt makes you stronger! 💪",
        });
      }
    }
  };

  const handleLanguageChange = (language: any) => {
    if (userProgress) {
      setUserProgress({
        ...userProgress,
        preferredLanguage: language
      });
    }
  };

  // Show onboarding if user hasn't completed it
  if (!userProgress?.onboardingCompleted) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  // Render current view
  switch (currentView) {
    case "problem":
      return selectedProblem ? (
        <div className="min-h-screen bg-background">
          <div className="border-b p-4 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button 
                onClick={() => setCurrentView("dashboard")}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <div className="text-sm text-muted-foreground">
                Problem {sampleProblems.findIndex(p => p.id === selectedProblem.id) + 1} of {sampleProblems.length}
              </div>
            </div>
          </div>
          <CodeEditor
            problem={selectedProblem}
            language={userProgress.preferredLanguage}
            onSubmit={handleCodeSubmit}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      ) : null;

    case "module":
      return selectedModule ? (
        <div className="min-h-screen bg-background">
          <div className="border-b p-4 bg-white shadow-sm">
            <button 
              onClick={() => setCurrentView("dashboard")}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selectedModule.title}
              </h1>
              <p className="text-xl text-muted-foreground">{selectedModule.subtitle}</p>
              <p className="text-muted-foreground max-w-2xl mx-auto">{selectedModule.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedModule.problems.length}</div>
                <div className="text-sm text-muted-foreground">Practice Problems</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">~{selectedModule.estimatedTime}h</div>
                <div className="text-sm text-muted-foreground">Estimated Time</div>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => handleProblemClick(selectedModule.problems[0])}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Start First Problem →
              </button>
            </div>
          </div>
        </div>
      ) : null;

    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CodeMaster DSA
                  </h1>
                  <p className="text-muted-foreground">Master Data Structures & Algorithms from Zero to Hero</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Welcome back!</div>
                    <div className="text-xs text-muted-foreground">
                      {userProgress.experienceLevel.replace('-', ' ')} level
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {userProgress.preferredLanguage.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <LearningDashboard
            userProgress={userProgress}
            modules={modules}
            onModuleClick={handleModuleClick}
            onProblemClick={handleProblemClick}
          />
        </div>
      );
  }
};

export default Index;
