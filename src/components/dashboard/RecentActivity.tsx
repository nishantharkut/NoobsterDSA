
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMinutes } from "@/utils/analytics";
import { formatDistanceToNow } from 'date-fns';
import { LogEntry } from "@/types";

interface RecentActivityProps {
  logs: LogEntry[];
  limit?: number;
}

export default function RecentActivity({ logs, limit = 5 }: RecentActivityProps) {
  // Sort logs by date (most recent first) and take the most recent ones
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  if (recentLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent activity.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {recentLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={`tag-${log.topic} whitespace-nowrap`}>
                    {log.topic.charAt(0).toUpperCase() + log.topic.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="whitespace-nowrap">
                    {log.difficultyLevel.charAt(0).toUpperCase() + log.difficultyLevel.slice(1)}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.date), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {log.problemCount} problem{log.problemCount !== 1 ? 's' : ''}
                </span>
                <span className="text-sm">{formatMinutes(log.timeSpent)}</span>
              </div>
              {log.notes && (
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {log.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
