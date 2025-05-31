
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trophy,
  Code,
  BookOpen,
  Target
} from "lucide-react";
import { Problem, ProgrammingLanguage } from "@/types/learning";
import { useToast } from "@/components/ui/use-toast";

interface CodeEditorProps {
  problem: Problem;
  language: ProgrammingLanguage;
  onSubmit: (code: string, isCorrect: boolean, attempts: number, hintsUsed: number) => void;
  onLanguageChange: (language: ProgrammingLanguage) => void;
}

const CodeEditor = ({ problem, language, onSubmit, onLanguageChange }: CodeEditorProps) => {
  const [code, setCode] = useState(problem.starterCode[language]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [testResults, setTestResults] = useState<boolean[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    setCode(problem.starterCode[language]);
  }, [language, problem]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'easy': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setAttempts(prev => prev + 1);
    
    // Simulate code execution and testing
    setTimeout(() => {
      const results = problem.testCases.map(() => Math.random() > 0.3);
      setTestResults(results);
      
      const allPassed = results.every(result => result);
      const passedCount = results.filter(result => result).length;
      
      if (allPassed) {
        setOutput(`✅ All test cases passed! (${passedCount}/${results.length})\n\nGreat job! Your solution is correct.`);
        toast({
          title: "🎉 Success!",
          description: `All test cases passed in ${attempts + 1} attempts!`,
        });
        onSubmit(code, true, attempts + 1, hintsUsed);
      } else {
        setOutput(`❌ ${passedCount}/${results.length} test cases passed.\n\nSome test cases failed. Review your logic and try again.`);
        
        if (attempts >= 1 && !showHint) {
          toast({
            title: "Need help?",
            description: "Try using a hint to guide your solution!",
          });
        }
      }
      
      setIsRunning(false);
    }, 1500);
  };

  const useHint = () => {
    if (currentHint < problem.hints.length) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      toast({
        title: "💡 Hint revealed",
        description: problem.hints[currentHint],
      });
      setCurrentHint(prev => prev + 1);
    }
  };

  const resetCode = () => {
    setCode(problem.starterCode[language]);
    setOutput("");
    setTestResults([]);
    setShowHint(false);
    toast({
      title: "Code reset",
      description: "Starter code has been restored.",
    });
  };

  const showSolution = () => {
    setCode(problem.solution[language]);
    toast({
      title: "Solution revealed",
      description: "Study the solution and understand the approach.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-screen bg-gray-50">
      {/* Problem Description */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{problem.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(timeSpent)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: problem.description }}
            />
          </CardContent>
        </Card>

        {/* Test Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Test Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {problem.testCases.map((testCase, index) => (
                <div 
                  key={testCase.id} 
                  className={`p-3 rounded-lg border ${
                    testResults[index] === true ? 'bg-green-50 border-green-200' :
                    testResults[index] === false ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Test Case {index + 1}</span>
                    {testResults[index] === true && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {testResults[index] === false && <XCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="text-sm">
                    <div><strong>Input:</strong> {testCase.input}</div>
                    <div><strong>Expected:</strong> {testCase.expectedOutput}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Hints ({hintsUsed}/{problem.hints.length} used)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showHint && hintsUsed > 0 ? (
              <div className="space-y-2">
                {problem.hints.slice(0, hintsUsed).map((hint, index) => (
                  <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Hint {index + 1}</span>
                    </div>
                    <p className="text-sm text-blue-700">{hint}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Use hints when you're stuck!</p>
            )}
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={useHint}
                disabled={currentHint >= problem.hints.length}
                className="flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Get Hint
              </Button>
              <Button 
                variant="outline" 
                onClick={showSolution}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Show Solution
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Editor */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Code Editor
              </CardTitle>
              <Tabs value={language} onValueChange={(v) => onLanguageChange(v as ProgrammingLanguage)}>
                <TabsList>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="java">Java</TabsTrigger>
                  <TabsTrigger value="cpp">C++</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm min-h-[300px] resize-none"
              placeholder="Write your solution here..."
            />
            
            <div className="flex gap-2 mt-4">
              <Button onClick={runCode} disabled={isRunning} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
              <Button variant="outline" onClick={resetCode} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[150px]">
              {output || "Click 'Run Code' to see the output here..."}
            </div>
          </CardContent>
        </Card>

        {/* Progress Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Session Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{attempts}</div>
                <div className="text-sm text-muted-foreground">Attempts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{hintsUsed}</div>
                <div className="text-sm text-muted-foreground">Hints Used</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{formatTime(timeSpent)}</div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeEditor;
