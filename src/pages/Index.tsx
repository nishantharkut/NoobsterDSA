
import { useState, useEffect } from "react";
import { LogEntry, WeeklyGoal, TemplateData } from "@/types";
import { Header, ActiveTab } from "@/components/Header";
import DailyLogForm from "@/components/DailyLogForm";
import LogsList from "@/components/LogsList";
import WeeklyGoals from "@/components/WeeklyGoals";
import TemplateSelector from "@/components/templates/TemplateSelector";
import Dashboard from "@/components/Dashboard";
import Analytics from "@/components/Analytics";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { loadFromLocalStorage, saveToLocalStorage, isOfflineSupported } from "@/utils/streakTracking";

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    return loadFromLocalStorage("codeLogs", []);
  });

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(() => {
    return loadFromLocalStorage("codeGoals", []);
  });

  const [templates, setTemplates] = useState<TemplateData[]>(() => {
    return loadFromLocalStorage("codeTemplates", []);
  });

  const [isNewLogOpen, setIsNewLogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [zenMode, setZenMode] = useState(false);
  
  const { toast } = useToast();

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

  const handleCreateLog = () => {
    setEditingLog(null);
    setIsNewLogOpen(true);
  };

  const handleEditLog = (log: LogEntry) => {
    setEditingLog(log);
    setIsNewLogOpen(true);
  };

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

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
    toast({
      title: "Log deleted",
      description: "Your log was deleted successfully.",
      variant: "destructive",
    });
  };

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

  const handleDeleteGoal = (id: string) => {
    setWeeklyGoals(weeklyGoals.filter(goal => goal.id !== id));
    toast({
      title: "Goal deleted",
      description: "Your weekly goal was deleted successfully.",
      variant: "destructive",
    });
  };

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
      // If entering zen mode, automatically go to logs tab
      setActiveTab("logs");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onCreateLog={handleCreateLog}
        zenMode={zenMode}
        onZenModeChange={handleZenModeChange}
      />
      
      <main className={`flex-1 container py-8 ${zenMode ? 'max-w-2xl' : ''}`}>
        {activeTab === "dashboard" && !zenMode && (
          <Dashboard 
            logs={logs} 
            goals={weeklyGoals}
          />
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
