
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WeeklyGoal } from "@/types";
import { getCurrentWeekNumber } from "@/utils/analytics";

interface GoalCompletionProps {
  goals: WeeklyGoal[];
}

export default function GoalCompletion({ goals }: GoalCompletionProps) {
  const currentWeek = getCurrentWeekNumber();
  const currentGoal = goals.find(goal => goal.week === currentWeek);
  
  if (!currentGoal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Goal Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No goals set for this week.</p>
        </CardContent>
      </Card>
    );
  }

  const problemProgress = Math.min(
    100, 
    Math.round((currentGoal.achieved.problemCount / currentGoal.targetProblemCount) * 100) || 0
  );
  
  const timeProgress = Math.min(
    100, 
    Math.round((currentGoal.achieved.timeSpent / currentGoal.targetTime) * 100) || 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goal Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Problems</span>
            <span>{currentGoal.achieved.problemCount} of {currentGoal.targetProblemCount}</span>
          </div>
          <Progress value={problemProgress} className="h-2" />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Time Spent</span>
            <span>{Math.round(currentGoal.achieved.timeSpent / 60)} of {Math.round(currentGoal.targetTime / 60)} hours</span>
          </div>
          <Progress value={timeProgress} className="h-2" />
        </div>
        
        {currentGoal.focusAreas && currentGoal.focusAreas.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-sm">Focus Areas:</div>
            <div className="flex flex-wrap gap-1">
              {currentGoal.focusAreas.map(area => (
                <div 
                  key={area} 
                  className={`px-2 py-1 rounded text-xs tag-${area} bg-opacity-20`}
                >
                  {area.charAt(0).toUpperCase() + area.slice(1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
