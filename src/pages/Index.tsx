
import { useState, useEffect } from "react";
import { UserProgress, LearningModule, Problem } from "@/types/learning";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import LearningDashboard from "@/components/learning/LearningDashboard";
import CodeEditor from "@/components/coding/CodeEditor";
import { useToast } from "@/components/ui/use-toast";
import { loadFromLocalStorage, saveToLocalStorage } from "@/utils/streakTracking";

const Index = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(() => {
    return loadFromLocalStorage("userProgress", null);
  });
  
  const [currentView, setCurrentView] = useState<"dashboard" | "problem" | "module">("dashboard");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  
  const { toast } = useToast();

  // Sample data - in a real app this would come from an API
  const [modules] = useState<LearningModule[]>([
    {
      id: "arrays-strings-module",
      track: "arrays-strings",
      title: "Arrays & Strings",
      subtitle: "Master the building blocks of programming",
      description: "Learn fundamental data structures and string manipulation techniques",
      estimatedTime: 8,
      prerequisiteModules: [],
      problems: ["two-sum", "valid-palindrome", "best-time-stock"],
      theoryContent: "Arrays and strings theory content...",
      isLocked: false,
      completionPercentage: userProgress?.currentTrack === "arrays-strings" ? 65 : 0
    },
    {
      id: "linked-lists-module",
      track: "linked-lists",
      title: "Linked Lists",
      subtitle: "Connect the dots with dynamic data",
      description: "Understanding pointers and dynamic data structures",
      estimatedTime: 6,
      prerequisiteModules: ["arrays-strings-module"],
      problems: ["reverse-linked-list", "merge-two-lists"],
      theoryContent: "Linked lists theory content...",
      isLocked: userProgress?.currentTrack !== "linked-lists",
      completionPercentage: 0
    }
  ]);

  const [sampleProblem] = useState<Problem>({
    id: "two-sum",
    title: "Two Sum",
    description: `
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p>
      <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
      <h4>Example:</h4>
      <pre>Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9</pre>
    `,
    difficulty: "easy",
    track: "arrays-strings",
    hints: [
      "Think about what information you need to store as you iterate through the array",
      "A hash map can help you find complements efficiently",
      "For each number, check if its complement (target - current number) exists in your hash map"
    ],
    starterCode: {
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
      javascript: `function twoSum(nums, target) {
    // Your code here
}`,
      java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
    return new int[]{};
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    return {};
}`
    },
    solution: {
      python: `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
    const numMap = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        numMap.set(nums[i], i);
    }
    return [];
}`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> numMap = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (numMap.containsKey(complement)) {
            return new int[]{numMap.get(complement), i};
        }
        numMap.put(nums[i], i);
    }
    return new int[]{};
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numMap;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (numMap.find(complement) != numMap.end()) {
            return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    return {};
}`
    },
    testCases: [
      { id: "1", input: "[2,7,11,15], 9", expectedOutput: "[0,1]", isHidden: false },
      { id: "2", input: "[3,2,4], 6", expectedOutput: "[1,2]", isHidden: false },
      { id: "3", input: "[3,3], 6", expectedOutput: "[0,1]", isHidden: false }
    ],
    timeEstimate: 15,
    conceptsUsed: ["Hash Map", "Array Traversal", "Two Pointers"]
  });

  useEffect(() => {
    if (userProgress) {
      saveToLocalStorage("userProgress", userProgress);
    }
  }, [userProgress]);

  const handleOnboardingComplete = (userData: Partial<UserProgress>) => {
    const newUserProgress: UserProgress = {
      userId: "user-1",
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
      title: "Welcome to your DSA journey!",
      description: "Let's start with your first learning track.",
    });
  };

  const handleModuleClick = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module && !module.isLocked) {
      setSelectedModule(module);
      setCurrentView("module");
    }
  };

  const handleProblemClick = (problemId: string) => {
    setSelectedProblem(sampleProblem); // In real app, fetch by problemId
    setCurrentView("problem");
  };

  const handleCodeSubmit = (code: string, isCorrect: boolean, attempts: number, hintsUsed: number) => {
    if (isCorrect && userProgress) {
      const updatedProgress = {
        ...userProgress,
        totalProblemsSolved: userProgress.totalProblemsSolved + 1,
        totalProblemsAttempted: userProgress.totalProblemsAttempted + 1,
        solvedProblems: [...userProgress.solvedProblems, selectedProblem!.id]
      };
      
      setUserProgress(updatedProgress);
      
      toast({
        title: "🎉 Problem Solved!",
        description: `Great job! You solved "${selectedProblem!.title}" in ${attempts} attempts.`,
      });
      
      // Return to dashboard after solving
      setTimeout(() => {
        setCurrentView("dashboard");
        setSelectedProblem(null);
      }, 2000);
    } else if (userProgress) {
      const updatedProgress = {
        ...userProgress,
        totalProblemsAttempted: userProgress.totalProblemsAttempted + 1
      };
      setUserProgress(updatedProgress);
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
          <div className="border-b p-4">
            <button 
              onClick={() => setCurrentView("dashboard")}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>
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
        <div className="min-h-screen bg-background p-6">
          <button 
            onClick={() => setCurrentView("dashboard")}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </button>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{selectedModule.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{selectedModule.subtitle}</p>
            {/* Module content would go here */}
            <button 
              onClick={() => handleProblemClick("two-sum")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Start First Problem
            </button>
          </div>
        </div>
      ) : null;

    default:
      return (
        <div className="min-h-screen bg-background">
          <div className="border-b p-4">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold">Code Growth Tracker</h1>
              <p className="text-muted-foreground">Master DSA from Zero to Hero</p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto">
            <LearningDashboard
              userProgress={userProgress}
              modules={modules}
              onModuleClick={handleModuleClick}
              onProblemClick={handleProblemClick}
            />
          </div>
        </div>
      );
  }
};

export default Index;
