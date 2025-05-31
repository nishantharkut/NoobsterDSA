
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  EyeOff
} from "lucide-react";
import { Problem, ProgrammingLanguage, TestCase } from "@/types/learning";

interface CodeEditorProps {
  problem: Problem;
  language: ProgrammingLanguage;
  onSubmit: (code: string, isCorrect: boolean, attempts: number, hintsUsed: number) => void;
  onLanguageChange: (language: ProgrammingLanguage) => void;
}

const CodeEditor = ({ problem, language, onSubmit, onLanguageChange }: CodeEditorProps) => {
  const [code, setCode] = useState(problem.starterCode[language] || "");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; input: string; expected: string; actual: string; }[]>([]);
  const [currentHint, setCurrentHint] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setCode(problem.starterCode[language] || "");
  }, [language, problem]);

  const runCode = async () => {
    setIsRunning(true);
    setAttempts(prev => prev + 1);
    
    // Simulate code execution and testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const visibleTestCases = problem.testCases.filter(tc => !tc.isHidden).slice(0, 3);
    const results = visibleTestCases.map(testCase => {
      // Simulate test execution
      const passed = Math.random() > 0.3; // Random for demo
      return {
        passed,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: passed ? testCase.expectedOutput : "Different output"
      };
    });
    
    setTestResults(results);
    setIsRunning(false);
    
    const allPassed = results.every(r => r.passed);
    if (allPassed) {
      onSubmit(code, true, attempts + 1, hintsUsed);
    } else if (attempts >= 1) {
      // Show helpful message after second failure
    }
  };

  const getNextHint = () => {
    if (currentHint < problem.hints.length) {
      setCurrentHint(prev => prev + 1);
      setHintsUsed(prev => prev + 1);
      setShowHints(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "easy": return "bg-blue-100 text-blue-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Problem Description */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{problem.title}</CardTitle>
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: problem.description }} />
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                ~{problem.timeEstimate} min
              </div>
              <div>Track: {problem.track}</div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Concepts Used:</h4>
              <div className="flex flex-wrap gap-2">
                {problem.conceptsUsed.map((concept, index) => (
                  <Badge key={index} variant="outline">{concept}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hints Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Hints ({hintsUsed}/{problem.hints.length})
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          {showHints && (
            <CardContent className="space-y-3">
              {problem.hints.slice(0, currentHint).map((hint, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm"><strong>Hint {index + 1}:</strong> {hint}</p>
                </div>
              ))}
              
              {currentHint < problem.hints.length && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={getNextHint}
                  className="w-full"
                >
                  Get Next Hint
                </Button>
              )}
              
              {attempts >= 2 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSolution(!showSolution)}
                  className="w-full text-orange-600"
                >
                  {showSolution ? "Hide Solution" : "View Solution"}
                </Button>
              )}
            </CardContent>
          )}
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Test Results
                {testResults.every(r => r.passed) ? (
                  <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 ml-2 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.passed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Test Case {index + 1}</span>
                    {result.passed ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    <div><strong>Input:</strong> {result.input}</div>
                    <div><strong>Expected:</strong> {result.expected}</div>
                    {!result.passed && (
                      <div><strong>Your Output:</strong> {result.actual}</div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Code Editor */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Code Editor</CardTitle>
              <select 
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as ProgrammingLanguage)}
                className="px-3 py-1 border rounded-md"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm min-h-[400px] resize-none"
              placeholder="Write your solution here..."
            />
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Attempts: {attempts}
              </div>
              <Button 
                onClick={runCode} 
                disabled={isRunning || !code.trim()}
                className="flex items-center"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Code
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Solution (shown after multiple attempts) */}
        {showSolution && (
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{problem.solution[language]}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
