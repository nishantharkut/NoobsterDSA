
import { useState, useEffect } from "react";
import { LogEntry, WeeklyGoal, TemplateData, ApplicationEntry, DocumentEntry } from "@/types";
import { Header, ActiveTab } from "@/components/Header";
import DailyLogForm from "@/components/DailyLogForm";
import LogsList from "@/components/LogsList";
import WeeklyGoals from "@/components/WeeklyGoals";
import TemplateSelector from "@/components/templates/TemplateSelector";
import Dashboard from "@/components/Dashboard";
import Analytics from "@/components/Analytics";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { loadFromLocalStorage, saveToLocalStorage, isOfflineSupported } from "@/utils/streakTracking";
import { useIsMobile, useResponsive } from "@/hooks/use-mobile";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { addDays, isAfter, isBefore } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Briefcase, ArrowRight, Calendar, Bell } from "lucide-react";

const Index = () => {
  // Get responsive state for adaptive layouts
  const { isMobile, isTablet } = useResponsive();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    // Try to restore last active tab from localStorage
    const savedTab = localStorage.getItem("activeTab");
    return (savedTab as ActiveTab) || "dashboard";
  });
  
  // Initialize state with data from localStorage
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    return loadFromLocalStorage("codeLogs", []);
  });

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(() => {
    return loadFromLocalStorage("codeGoals", []);
  });

  const [templates, setTemplates] = useState<TemplateData[]>(() => {
    return loadFromLocalStorage("codeTemplates", []);
  });

  // Load applications for notifications only
  const [applications, setApplications] = useState<ApplicationEntry[]>(() => {
    return loadFromLocalStorage("applications", []);
  });

  const [isNewLogOpen, setIsNewLogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [zenMode, setZenMode] = useState(() => {
    // Load zen mode preference from localStorage
    return localStorage.getItem("zenMode") === "true";
  });
  
  const { toast } = useToast();

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Check offline support and notify user
  useEffect(() => {
    const offlineSupported = isOfflineSupported();
    if (offlineSupported) {
      sonnerToast("Offline mode available", {
        description: "Your data will be saved locally even when offline.",
        duration: 5000
      });
    }
  }, []);

  // Check for deadline notifications on load
  useEffect(() => {
    checkDeadlineNotifications();
  }, [applications]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage("codeLogs", logs);
  }, [logs]);

  useEffect(() => {
    saveToLocalStorage("codeGoals", weeklyGoals);
  }, [weeklyGoals]);

  useEffect(() => {
    saveToLocalStorage("codeTemplates", templates);
  }, [templates]);

  useEffect(() => {
    saveToLocalStorage("applications", applications);
  }, [applications]);

  // Save zen mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("zenMode", String(zenMode));
  }, [zenMode]);

  // Check for deadline notifications
  const checkDeadlineNotifications = () => {
    const now = new Date();
    const upcomingDeadlines = applications.filter(app => 
      app.deadline && 
      isAfter(new Date(app.deadline), now) && 
      isBefore(new Date(app.deadline), addDays(now, 3)) &&
      !['rejected', 'declined', 'accepted'].includes(app.status)
    );
    
    if (upcomingDeadlines.length > 0) {
      // Only show notification if we haven't shown it in the last 24 hours
      const lastNotification = localStorage.getItem('lastDeadlineNotification');
      const showNotification = !lastNotification || 
        isAfter(now, addDays(new Date(lastNotification), 1));
      
      if (showNotification) {
        sonnerToast("Upcoming application deadlines", {
          description: `You have ${upcomingDeadlines.length} application${upcomingDeadlines.length === 1 ? '' : 's'} due in the next 3 days.`,
          duration: 5000,
          action: {
            label: "View",
            onClick: () => navigate("/applications")
          }
        });
        
        localStorage.setItem('lastDeadlineNotification', now.toISOString());
      }
    }
  };

  // Handle creating a new log
  const handleCreateLog = () => {
    setEditingLog(null);
    setIsNewLogOpen(true);
  };

  // Handle editing a log
  const handleEditLog = (log: LogEntry) => {
    setEditingLog(log);
    setIsNewLogOpen(true);
  };

  // Handle saving a log
  const handleSaveLog = (log: LogEntry) => {
    if (editingLog) {
      setLogs(logs.map(l => l.id === log.id ? log : l));
      toast({
        title: "Log updated",
        description: "Your log was updated successfully.",
      });
    } else {
      setLogs([...logs, log]);
      toast({
        title: "Log created",
        description: "Your new log was added successfully.",
      });
    }
  };

  // Handle deleting a log
  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
    toast({
      title: "Log deleted",
      description: "Your log was deleted successfully.",
      variant: "destructive",
    });
  };

  // Handle saving a goal
  const handleSaveGoal = (goal: WeeklyGoal) => {
    const existingIndex = weeklyGoals.findIndex(g => g.id === goal.id);
    
    if (existingIndex >= 0) {
      setWeeklyGoals(weeklyGoals.map((g, index) => index === existingIndex ? goal : g));
      toast({
        title: "Goal updated",
        description: "Your weekly goal was updated successfully.",
      });
    } else {
      setWeeklyGoals([...weeklyGoals, goal]);
      toast({
        title: "Goal created",
        description: "Your new weekly goal was added successfully.",
      });
    }
  };

  // Handle deleting a goal
  const handleDeleteGoal = (id: string) => {
    setWeeklyGoals(weeklyGoals.filter(goal => goal.id !== id));
    toast({
      title: "Goal deleted",
      description: "Your weekly goal was deleted successfully.",
      variant: "destructive",
    });
  };

  // Handle saving a template
  const handleSaveTemplate = (template: TemplateData) => {
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      setTemplates(templates.map((t, index) => index === existingIndex ? template : t));
      toast({
        title: "Template updated",
        description: "Your template was updated successfully.",
      });
    } else {
      setTemplates([...templates, template]);
      toast({
        title: "Template created",
        description: "Your new template was added successfully.",
      });
    }
  };

  // Handle deleting a template
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast({
      title: "Template deleted",
      description: "Your template was deleted successfully.",
      variant: "destructive",
    });
  };

  const handleZenModeChange = (enabled: boolean) => {
    setZenMode(enabled);
    if (enabled) {
      // If entering zen mode, automatically go to logs tab if not already there
      if (activeTab !== "logs") {
        setActiveTab("logs");
        toast({
          title: "Zen Mode activated",
          description: "Focus mode enabled with Logs view.",
        });
      }
    }
  };

  // Retrieve previously active tab when exiting zen mode
  const handleTabChange = (tab: ActiveTab) => {
    // Only allow logs tab in zen mode
    if (zenMode && tab !== "logs") {
      setZenMode(false);
      toast({
        title: "Zen Mode deactivated",
        description: `Switching to ${tab} view.`,
      });
    }
    setActiveTab(tab);
  };

  // Application tracker navigation
  const handleNavigateToApplications = () => {
    navigate("/applications");
  };

  // Calculate appropriate container class based on screen size and zen mode
  const getContainerClass = () => {
    let className = "flex-1 container py-4 md:py-6";
    
    if (zenMode) {
      className += " max-w-2xl mx-auto";
    }
    
    if (isMobile) {
      className += " px-2";
    }
    
    return className;
  };

  // Get pending applications count
  const pendingApplicationsCount = applications.filter(
    app => !['rejected', 'declined', 'accepted'].includes(app.status)
  ).length;

  // Get upcoming deadlines
  const now = new Date();
  const upcomingDeadlines = applications.filter(app => 
    app.deadline && 
    isAfter(new Date(app.deadline), now) && 
    isBefore(new Date(app.deadline), addDays(now, 7)) &&
    !['rejected', 'declined', 'accepted'].includes(app.status)
  );

  // Application summary component for dashboard
  const ApplicationSummary = () => (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Application Tracker
            </CardTitle>
            <CardDescription>Track your job applications</CardDescription>
          </div>
          {upcomingDeadlines.length > 0 && (
            <div className="bg-orange-100 dark:bg-orange-900 p-1 px-2 rounded-full flex items-center">
              <Bell className="h-3 w-3 mr-1 text-orange-500 dark:text-orange-300" />
              <span className="text-xs font-medium text-orange-600 dark:text-orange-300">
                {upcomingDeadlines.length} upcoming
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Total Applications</span>
            <span className="font-semibold">{applications.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Pending Applications</span>
            <span className="font-semibold">{pendingApplicationsCount}</span>
          </div>
          {upcomingDeadlines.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                Upcoming Deadlines
              </div>
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {upcomingDeadlines.slice(0, 3).map(app => (
                  <div 
                    key={app.id} 
                    className="bg-muted/50 p-2 rounded-md text-sm flex justify-between"
                  >
                    <span className="truncate">{app.company}</span>
                    <span className="font-medium">
                      {new Date(app.deadline!).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {upcomingDeadlines.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground">
                    +{upcomingDeadlines.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleNavigateToApplications} 
          className="w-full" 
          variant="outline"
        >
          View Application Tracker
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onCreateLog={handleCreateLog}
        zenMode={zenMode}
        onZenModeChange={handleZenModeChange}
      />
      
      <main className={getContainerClass()}>
        {activeTab === "dashboard" && !zenMode && (
          <div className="space-y-8">
            <Dashboard 
              logs={logs} 
              goals={weeklyGoals}
            />
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Application Tracker</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <ApplicationSummary />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "logs" && (
          <LogsList 
            logs={logs} 
            onEdit={handleEditLog}
            onDelete={handleDeleteLog}
            zenMode={zenMode}
          />
        )}
        
        {activeTab === "goals" && !zenMode && (
          <WeeklyGoals 
            goals={weeklyGoals}
            logs={logs}
            onSaveGoal={handleSaveGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}
        
        {activeTab === "templates" && !zenMode && (
          <TemplateSelector 
            templates={templates}
            onSaveTemplate={handleSaveTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        )}

        {activeTab === "analytics" && !zenMode && (
          <Analytics logs={logs} />
        )}

        {activeTab === "applications" && !zenMode && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Application Tracker</h1>
                <p className="text-muted-foreground">
                  Track and manage your job and internship applications
                </p>
              </div>
              <Button onClick={handleNavigateToApplications}>
                Open Application Tracker
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6 shadow-sm">
              <div className="text-center space-y-4">
                <Briefcase className="h-12 w-12 mx-auto text-primary opacity-80" />
                <h2 className="text-xl font-semibold">Manage Your Job Applications</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Keep track of your applications, deadlines, and interview progress in one place.
                </p>
                <Button 
                  size="lg" 
                  onClick={handleNavigateToApplications}
                  className="mt-2"
                >
                  Go to Application Tracker
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <DailyLogForm 
        open={isNewLogOpen} 
        onOpenChange={setIsNewLogOpen}
        onSave={handleSaveLog}
        templates={templates}
        initialData={editingLog || {}}
        zenMode={zenMode}
      />
    </div>
  );
};

export default Index;
