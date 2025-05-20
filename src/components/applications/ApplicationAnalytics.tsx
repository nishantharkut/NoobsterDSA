
import React, { useMemo } from 'react';
import { ApplicationEntry, ApplicationStatus, ApplicationType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, LineChart, PieChart } from '@/components/ui/chart';
import { differenceInDays, isAfter, isBefore, parseISO, subDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { FileChart, Briefcase, Calendar, Clock, TrendingUp } from 'lucide-react';

interface ApplicationAnalyticsProps {
  applications: ApplicationEntry[];
}

const ApplicationAnalytics: React.FC<ApplicationAnalyticsProps> = ({ applications }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    // Filter today's applications
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const applicationsWithDates = applications.filter(app => app.appliedDate);
    const totalApplications = applications.length;
    const activeApplications = applications.filter(app => 
      !['accepted', 'rejected', 'declined'].includes(app.status)
    ).length;
    
    const upcomingDeadlines = applications.filter(app => 
      app.deadline && isAfter(new Date(app.deadline), now) && 
      isBefore(new Date(app.deadline), subDays(now, -7))
    ).length;
    
    // Status breakdown
    const statusCounts: Record<ApplicationStatus, number> = {
      to_apply: 0,
      applied: 0,
      oa_received: 0,
      interview_scheduled: 0,
      interview_completed: 0,
      offer_received: 0,
      accepted: 0,
      rejected: 0,
      declined: 0
    };
    
    applications.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });
    
    // Type breakdown
    const typeCounts = {
      job: applications.filter(app => app.type === 'job').length,
      internship: applications.filter(app => app.type === 'internship').length
    };
    
    // Priority breakdown
    const priorityCounts = {
      high: applications.filter(app => app.priority === 'high').length,
      medium: applications.filter(app => app.priority === 'medium').length,
      low: applications.filter(app => app.priority === 'low').length
    };
    
    // Response rates
    const responded = applications.filter(app => 
      ['oa_received', 'interview_scheduled', 'interview_completed', 'offer_received', 'accepted', 'rejected'].includes(app.status)
    ).length;
    
    const responseRate = totalApplications > 0 ? (responded / totalApplications) * 100 : 0;
    
    // Success rate (offers received / total completed applications)
    const completedApplications = applications.filter(app => 
      ['offer_received', 'accepted', 'rejected', 'declined'].includes(app.status)
    ).length;
    
    const offersReceived = statusCounts.offer_received + statusCounts.accepted + statusCounts.declined;
    const successRate = completedApplications > 0 ? (offersReceived / completedApplications) * 100 : 0;
    
    // Average response time (days between applied and first response)
    let totalResponseTime = 0;
    let applicationsWithResponseTime = 0;
    
    applications.forEach(app => {
      if (app.appliedDate && ['oa_received', 'interview_scheduled', 'interview_completed', 'offer_received', 'accepted', 'rejected'].includes(app.status)) {
        const responseDate = app.interviews && app.interviews.length > 0 
          ? new Date(app.interviews[0].date) 
          : now;
        
        const responseTime = differenceInDays(responseDate, new Date(app.appliedDate));
        if (responseTime >= 0) {
          totalResponseTime += responseTime;
          applicationsWithResponseTime++;
        }
      }
    });
    
    const averageResponseTime = applicationsWithResponseTime > 0 
      ? totalResponseTime / applicationsWithResponseTime 
      : 0;
    
    return {
      totalApplications,
      activeApplications,
      upcomingDeadlines,
      statusCounts,
      typeCounts,
      priorityCounts,
      responseRate,
      successRate,
      averageResponseTime,
    };
  }, [applications]);
  
  // Prepare chart data
  const statusPieData = useMemo(() => {
    return [
      { name: 'To Apply', value: stats.statusCounts.to_apply, color: '#94a3b8' },
      { name: 'Applied', value: stats.statusCounts.applied, color: '#3b82f6' },
      { name: 'OA Received', value: stats.statusCounts.oa_received, color: '#eab308' },
      { name: 'Interview Scheduled', value: stats.statusCounts.interview_scheduled, color: '#8b5cf6' },
      { name: 'Interview Completed', value: stats.statusCounts.interview_completed, color: '#6366f1' },
      { name: 'Offer Received', value: stats.statusCounts.offer_received, color: '#10b981' },
      { name: 'Accepted', value: stats.statusCounts.accepted, color: '#22c55e' },
      { name: 'Rejected', value: stats.statusCounts.rejected, color: '#ef4444' },
      { name: 'Declined', value: stats.statusCounts.declined, color: '#f97316' }
    ].filter(item => item.value > 0);
  }, [stats.statusCounts]);
  
  const typePieData = useMemo(() => {
    return [
      { name: 'Jobs', value: stats.typeCounts.job, color: '#3b82f6' },
      { name: 'Internships', value: stats.typeCounts.internship, color: '#8b5cf6' }
    ].filter(item => item.value > 0);
  }, [stats.typeCounts]);
  
  const priorityPieData = useMemo(() => {
    return [
      { name: 'High', value: stats.priorityCounts.high, color: '#ef4444' },
      { name: 'Medium', value: stats.priorityCounts.medium, color: '#f97316' },
      { name: 'Low', value: stats.priorityCounts.low, color: '#22c55e' }
    ].filter(item => item.value > 0);
  }, [stats.priorityCounts]);
  
  // Monthly application trend data
  const monthlyTrendData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        yearMonth: `${date.getFullYear()}-${date.getMonth()}`
      };
    }).reverse();
    
    const monthlyData = last6Months.map(monthData => {
      const monthApplications = applications.filter(app => {
        if (!app.appliedDate) return false;
        const appDate = new Date(app.appliedDate);
        return appDate.getMonth() === monthData.monthIndex && 
               appDate.getFullYear() === monthData.year;
      });
      
      return {
        name: `${monthData.month} ${monthData.year}`,
        applications: monthApplications.length,
        responses: monthApplications.filter(app => 
          ['oa_received', 'interview_scheduled', 'interview_completed', 'offer_received', 'accepted', 'rejected'].includes(app.status)
        ).length,
        offers: monthApplications.filter(app => 
          ['offer_received', 'accepted', 'declined'].includes(app.status)
        ).length
      };
    });
    
    return monthlyData;
  }, [applications]);
  
  // No data state
  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Analytics</CardTitle>
          <CardDescription>Track your application statistics</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileChart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No applications data</h3>
            <p className="text-muted-foreground mt-2">
              Start adding applications to see your analytics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeApplications} active applications
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Success rate: {stats.successRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageResponseTime.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground">
              From application to first response
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">
              Applications due within 7 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Application Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-80">
                  <PieChart data={statusPieData} />
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {statusPieData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div 
                        className="mr-2 h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Application Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-80">
                  <PieChart data={typePieData} />
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {typePieData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div 
                        className="mr-2 h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Application Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-80">
                  <PieChart data={priorityPieData} />
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {priorityPieData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div 
                        className="mr-2 h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Application Trend</CardTitle>
              <CardDescription>Applications, responses, and offers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-96">
                <LineChart 
                  data={monthlyTrendData}
                  categories={['applications', 'responses', 'offers']}
                  colors={['#3b82f6', '#8b5cf6', '#10b981']}
                  valueFormatter={(value) => `${value} apps`}
                />
              </ChartContainer>
              <div className="mt-4 flex justify-center gap-4">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Applications</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Responses</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">Offers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationAnalytics;
