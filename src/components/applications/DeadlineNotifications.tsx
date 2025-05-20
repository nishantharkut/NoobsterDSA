
import React, { useMemo } from 'react';
import { ApplicationEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, addDays, isBefore, isAfter, differenceInDays } from 'date-fns';
import { Bell, ArrowUpRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DeadlineNotificationsProps {
  applications: ApplicationEntry[];
  onView: (application: ApplicationEntry) => void;
}

const DeadlineNotifications: React.FC<DeadlineNotificationsProps> = ({ 
  applications,
  onView
}) => {
  // Calculate upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const next7Days = addDays(now, 7);
    
    return applications
      .filter(app => 
        app.deadline && 
        isAfter(new Date(app.deadline), now) && 
        isBefore(new Date(app.deadline), next7Days) &&
        app.status !== 'rejected' && 
        app.status !== 'declined' &&
        app.status !== 'accepted'
      )
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
  }, [applications]);
  
  // Calculate overdue applications (user hasn't applied yet, but deadline has passed)
  const overdueApplications = useMemo(() => {
    const now = new Date();
    
    return applications
      .filter(app => 
        app.deadline && 
        isBefore(new Date(app.deadline), now) && 
        app.status === 'to_apply'
      )
      .sort((a, b) => new Date(b.deadline!).getTime() - new Date(a.deadline!).getTime());
  }, [applications]);
  
  // Calculate applications with no deadlines (might want to follow up)
  const noDeadlineApplications = useMemo(() => {
    return applications
      .filter(app => 
        !app.deadline && 
        ['applied', 'oa_received', 'interview_scheduled', 'interview_completed'].includes(app.status)
      );
  }, [applications]);
  
  // If no notifications, render a minimal component
  if (upcomingDeadlines.length === 0 && overdueApplications.length === 0 && noDeadlineApplications.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-md">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No upcoming deadlines or notifications.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-md">
          <Bell className="mr-2 h-4 w-4" />
          Notifications
          {(upcomingDeadlines.length > 0 || overdueApplications.length > 0) && (
            <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
              {upcomingDeadlines.length + overdueApplications.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-56">
        <CardContent>
          {upcomingDeadlines.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Upcoming Deadlines</h3>
              <div className="space-y-2">
                {upcomingDeadlines.map((app) => {
                  const daysRemaining = differenceInDays(new Date(app.deadline!), new Date());
                  
                  return (
                    <div 
                      key={app.id} 
                      className="flex items-start justify-between rounded-lg border p-2"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{app.companyName} - {app.role}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarDays className="mr-1 h-3 w-3" />
                          <span>
                            Due {format(new Date(app.deadline!), 'MMM d')} 
                            <span className="font-semibold text-amber-600 ml-1">
                              ({daysRemaining === 0 ? 'Today' : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`})
                            </span>
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => onView(app)}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {overdueApplications.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-semibold">Overdue Applications</h3>
              <div className="space-y-2">
                {overdueApplications.map((app) => {
                  const daysOverdue = differenceInDays(new Date(), new Date(app.deadline!));
                  
                  return (
                    <div 
                      key={app.id} 
                      className="flex items-start justify-between rounded-lg border border-red-100 bg-red-50 p-2 dark:border-red-800/30 dark:bg-red-900/10"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{app.companyName} - {app.role}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarDays className="mr-1 h-3 w-3" />
                          <span>
                            Due {format(new Date(app.deadline!), 'MMM d')} 
                            <span className="font-semibold text-red-600 ml-1">
                              (Overdue by {daysOverdue} day{daysOverdue !== 1 ? 's' : ''})
                            </span>
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => onView(app)}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {noDeadlineApplications.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-semibold">Missing Deadlines</h3>
              <div className="space-y-2">
                {noDeadlineApplications.slice(0, 3).map((app) => (
                  <div 
                    key={app.id} 
                    className="flex items-start justify-between rounded-lg border p-2"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{app.companyName} - {app.role}</p>
                      <p className="text-xs text-muted-foreground">
                        Consider following up or setting a deadline
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => onView(app)}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {noDeadlineApplications.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{noDeadlineApplications.length - 3} more applications without deadlines
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default DeadlineNotifications;
