
import { useState, useEffect } from "react";
import { LogEntry, WeeklyGoal, TemplateData, ApplicationEntry, DocumentEntry } from "@/types";
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
import { useIsMobile, useResponsive } from "@/hooks/use-mobile";
import ApplicationForm from "@/components/applications/ApplicationForm";
import ApplicationsList from "@/components/applications/ApplicationsList";
import ApplicationDetails from "@/components/applications/ApplicationDetails";
import DocumentsList from "@/components/applications/DocumentsList";
import DocumentUploader from "@/components/applications/DocumentUploader";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  // Get responsive state for adaptive layouts
  const { isMobile, isTablet } = useResponsive();
  
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

  const [applications, setApplications] = useState<ApplicationEntry[]>(() => {
    return loadFromLocalStorage("applications", []);
  });

  const [documents, setDocuments] = useState<DocumentEntry[]>(() => {
    return loadFromLocalStorage("documents", []);
  });

  const [isNewLogOpen, setIsNewLogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [zenMode, setZenMode] = useState(() => {
    // Load zen mode preference from localStorage
    return localStorage.getItem("zenMode") === "true";
  });

  // Application tracker state
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationEntry | null>(null);
  const [viewingApplication, setViewingApplication] = useState<ApplicationEntry | null>(null);
  const [applicationsTab, setApplicationsTab] = useState<"applications" | "documents">("applications");
  
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

  useEffect(() => {
    saveToLocalStorage("documents", documents);
  }, [documents]);

  // Save zen mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("zenMode", String(zenMode));
  }, [zenMode]);

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

  // Application tracker handlers
  const handleOpenApplicationForm = (application?: ApplicationEntry) => {
    if (application) {
      setSelectedApplication(application);
    } else {
      setSelectedApplication(null);
    }
    setIsApplicationFormOpen(true);
  };

  const handleSaveApplication = (application: ApplicationEntry) => {
    if (selectedApplication?.id) {
      // Edit existing application
      setApplications(applications.map(app => 
        app.id === application.id ? application : app
      ));
      toast({
        title: "Application Updated",
        description: `Your application for ${application.role} at ${application.companyName} has been updated.`,
      });
    } else {
      // Add new application
      const newApplication = {
        ...application,
        id: uuidv4(),
      };
      setApplications([...applications, newApplication]);
      toast({
        title: "Application Added",
        description: `Your application for ${application.role} at ${application.companyName} has been added.`,
      });
    }
    setIsApplicationFormOpen(false);
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
    toast({
      title: "Application Deleted",
      description: "Your application has been deleted.",
      variant: "destructive",
    });
  };

  const handleUploadDocument = (document: DocumentEntry) => {
    setDocuments([...documents, document]);
    toast({
      title: "Document Uploaded",
      description: `Your document "${document.name}" has been uploaded.`,
    });
  };

  const handleDeleteDocument = (id: string) => {
    // Check if document is used in any application
    const isUsed = applications.some(app => app.documents?.includes(id));
    
    if (isUsed) {
      sonnerToast("Document in use", {
        description: "This document is attached to one or more applications. Document references will be removed from those applications.",
        duration: 5000,
      });
      
      // Remove document reference from all applications
      const updatedApplications = applications.map(app => {
        if (app.documents?.includes(id)) {
          return {
            ...app,
            documents: app.documents.filter(docId => docId !== id)
          };
        }
        return app;
      });
      
      setApplications(updatedApplications);
    }
    
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Document Deleted",
      description: "Your document has been deleted.",
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

        {activeTab === "applications" && !zenMode && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Application Tracker</h1>
              <div className="flex gap-2">
                {applicationsTab === "applications" ? (
                  <Button onClick={() => handleOpenApplicationForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Application
                  </Button>
                ) : (
                  <Button onClick={() => setApplicationsTab("applications")}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Applications
                  </Button>
                )}
                
                {applicationsTab === "documents" ? (
                  <Button onClick={() => setApplicationsTab("applications")}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Applications
                  </Button>
                ) : (
                  <Button onClick={() => setApplicationsTab("documents")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </Button>
                )}
              </div>
            </div>

            {applicationsTab === "applications" && (
              <ApplicationsList
                applications={applications}
                documents={documents}
                onEdit={handleOpenApplicationForm}
                onDelete={handleDeleteApplication}
                onView={(app) => setViewingApplication(app)}
              />
            )}
            
            {applicationsTab === "documents" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Upload New Document</h2>
                  <DocumentUploader onUpload={handleUploadDocument} />
                </div>
                
                <DocumentsList 
                  documents={documents} 
                  onDelete={handleDeleteDocument} 
                />
              </div>
            )}
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

      <ApplicationForm 
        open={isApplicationFormOpen}
        onOpenChange={setIsApplicationFormOpen}
        onSave={handleSaveApplication}
        initialData={selectedApplication || {}}
        documents={documents}
      />
      
      <ApplicationDetails 
        application={viewingApplication} 
        open={!!viewingApplication}
        onOpenChange={(open) => !open && setViewingApplication(null)}
        documents={documents}
      />
    </div>
  );
};

export default Index;
