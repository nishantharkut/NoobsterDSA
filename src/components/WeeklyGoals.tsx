
import { useState } from "react";
import { WeeklyGoal, Topic, LogEntry } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getCurrentWeekNumber, calculateWeeklyGoalProgress, formatMinutes } from "@/utils/analytics";
import { v4 as uuidv4 } from "uuid";

interface WeeklyGoalsProps {
  goals: WeeklyGoal[];
  logs: LogEntry[];
  onSaveGoal: (goal: WeeklyGoal) => void;
  onDeleteGoal: (id: string) => void;
}

export default function WeeklyGoals({ goals, logs, onSaveGoal, onDeleteGoal }: WeeklyGoalsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [currentGoal, setCurrentGoal] = useState<Partial<WeeklyGoal>>({
    id: "",
    week: getCurrentWeekNumber(),
    topics: [],
    targetProblemCount: 10,
    targetTime: 300, // 5 hours
    achieved: {
      problemCount: 0,
      timeSpent: 0,
    },
    notes: "",
  });

  const handleNewGoal = () => {
    setCurrentGoal({
      id: uuidv4(),
      week: getCurrentWeekNumber(),
      topics: [],
      targetProblemCount: 10,
      targetTime: 300,
      achieved: {
        problemCount: 0,
        timeSpent: 0,
      },
      notes: "",
    });
    setSelectedTopics([]);
    setIsDialogOpen(true);
  };

  const handleEditGoal = (goal: WeeklyGoal) => {
    setCurrentGoal(goal);
    setSelectedTopics(goal.topics);
    setIsDialogOpen(true);
  };

  const handleTopicChange = (topic: Topic) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        return [...prev, topic];
      }
    });
  };

  const handleSaveGoal = () => {
    if (currentGoal) {
      onSaveGoal({
        ...currentGoal as WeeklyGoal,
        topics: selectedTopics,
      });
      setIsDialogOpen(false);
    }
  };

  const getWeekDisplay = (weekStr: string) => {
    const [year, week] = weekStr.split('-').map(Number);
    const startDate = new Date(year, 0, 1 + (week - 1) * 7);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const endMonth = endDate.toLocaleString('default', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${year}`;
    } else {
      return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${year}`;
    }
  };

  // Process the goals with achievements
  const processedGoals = goals
    .map(goal => calculateWeeklyGoalProgress(goal, logs))
    .sort((a, b) => b.week.localeCompare(a.week)); // newest first

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Weekly Goals</h2>
        <Button onClick={handleNewGoal}>Create New Goal</Button>
      </div>
      
      {processedGoals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No weekly goals yet. Set your first goal to track your progress!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processedGoals.map((goal) => {
            const problemProgress = Math.min(Math.round((goal.achieved.problemCount / goal.targetProblemCount) * 100), 100);
            const timeProgress = Math.min(Math.round((goal.achieved.timeSpent / goal.targetTime) * 100), 100);
            
            return (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Week of {getWeekDisplay(goal.week)}</span>
                    {goal.week === getCurrentWeekNumber() && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Current</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {goal.topics.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {goal.topics.map(topic => (
                          <Badge key={topic} variant="outline" className={`tag-${topic}`}>
                            {topic.charAt(0).toUpperCase() + topic.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span>All topics</span>
                    )}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Problems: {goal.achieved.problemCount} / {goal.targetProblemCount}</span>
                      <span className={problemProgress >= 100 ? "text-green-600 font-medium" : ""}>
                        {problemProgress}%
                      </span>
                    </div>
                    <Progress value={problemProgress} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Time: {formatMinutes(goal.achieved.timeSpent)} / {formatMinutes(goal.targetTime)}</span>
                      <span className={timeProgress >= 100 ? "text-green-600 font-medium" : ""}>
                        {timeProgress}%
                      </span>
                    </div>
                    <Progress value={timeProgress} className="h-2" />
                  </div>
                  
                  {goal.notes && (
                    <div className="mt-4 text-sm">
                      <div className="font-medium mb-1">Notes:</div>
                      <p className="text-muted-foreground">{goal.notes}</p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm" onClick={() => handleEditGoal(goal)}>
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDeleteGoal(goal.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentGoal.id ? "Edit Goal" : "Create Goal"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="week">Week</Label>
              <Select 
                value={currentGoal.week} 
                onValueChange={(value) => setCurrentGoal({ ...currentGoal, week: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  {[0, -1, -2, -3, -4].map((offset) => {
                    const date = new Date();
                    date.setDate(date.getDate() + offset * 7);
                    const week = getCurrentWeekNumber();
                    return (
                      <SelectItem key={week} value={week}>
                        {getWeekDisplay(week)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Focus Topics (optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["arrays", "strings", "linkedlist", "trees", "graphs", "dp", "greedy", "backtracking"] as Topic[]).map((topic) => (
                  <Button
                    key={topic}
                    type="button"
                    variant={selectedTopics.includes(topic) ? "default" : "outline"}
                    className={`justify-start text-left ${selectedTopics.includes(topic) ? "" : "opacity-70"}`}
                    onClick={() => handleTopicChange(topic)}
                  >
                    <span className="capitalize">{topic}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Leave empty to include all topics</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetProblemCount">Target Problem Count</Label>
              <Input
                id="targetProblemCount"
                type="number"
                min={1}
                value={currentGoal.targetProblemCount}
                onChange={(e) => setCurrentGoal({ 
                  ...currentGoal, 
                  targetProblemCount: parseInt(e.target.value) || 0 
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetTime">Target Time (minutes)</Label>
              <Input
                id="targetTime"
                type="number"
                min={1}
                value={currentGoal.targetTime}
                onChange={(e) => setCurrentGoal({ 
                  ...currentGoal, 
                  targetTime: parseInt(e.target.value) || 0 
                })}
              />
              <p className="text-xs text-muted-foreground">{formatMinutes(currentGoal.targetTime || 0)}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={currentGoal.notes}
                onChange={(e) => setCurrentGoal({ ...currentGoal, notes: e.target.value })}
                rows={3}
                placeholder="What do you want to accomplish this week?"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoal}>
              Save Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
