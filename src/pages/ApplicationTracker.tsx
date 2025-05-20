
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationEntry, DocumentEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Briefcase, FileText, Plus, Filter } from 'lucide-react';
import ApplicationsList from '@/components/applications/ApplicationsList';
import ApplicationForm from '@/components/applications/ApplicationForm';
import ApplicationDetails from '@/components/applications/ApplicationDetails';
import DocumentUploader from '@/components/applications/DocumentUploader';
import DocumentsList from '@/components/applications/DocumentsList';
import ApplicationAnalytics from '@/components/applications/ApplicationAnalytics';
import ExportImportTools from '@/components/applications/ExportImportTools';
import AdvancedFilters, { FilterOptions } from '@/components/applications/AdvancedFilters';
import DeadlineNotifications from '@/components/applications/DeadlineNotifications';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from "sonner";
import { loadFromLocalStorage, saveToLocalStorage } from "@/utils/streakTracking";
import { addDays, isAfter, isBefore } from 'date-fns';

const ApplicationTracker: React.FC = () => {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"applications" | "documents" | "analytics">
    (() => localStorage.getItem("appTrackerActiveTab") as any || "applications");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationEntry | null>(null);
  const [viewingApplication, setViewingApplication] = useState<ApplicationEntry | null>(null);

  // Initialize state with data from localStorage
  const [applications, setApplications] = useState<ApplicationEntry[]>(() => {
    return loadFromLocalStorage("applications", []);
  });

  const [documents, setDocuments] = useState<DocumentEntry[]>(() => {
    return loadFromLocalStorage("documents", []);
  });
  
  // Filtering state
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    types: ['job', 'internship'],
    statuses: [
      'to_apply', 'applied', 'oa_received', 'interview_scheduled', 
      'interview_completed', 'offer_received', 'accepted', 'rejected', 'declined'
    ],
    priorities: ['high', 'medium', 'low'],
    dateRange: undefined,
    hasDocuments: null,
    hasDeadline: null,
    locationSearch: ''
  });
  
  // Filtered applications
  const [filteredApplications, setFilteredApplications] = useState<ApplicationEntry[]>(applications);
  
  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem("appTrackerActiveTab", activeTab);
  }, [activeTab]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage("applications", applications);
    applyFilters();
    checkDeadlineNotifications();
  }, [applications, filters]);

  useEffect(() => {
    saveToLocalStorage("documents", documents);
  }, [documents]);
  
  // Apply filters
  const applyFilters = () => {
    const filtered = applications.filter((app) => {
      // Search term filter
      const searchMatch = !filters.searchTerm || 
        app.companyName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (app.notes && app.notes.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      
      // Type filter
      const typeMatch = filters.types.includes(app.type);
      
      // Status filter
      const statusMatch = filters.statuses.includes(app.status);
      
      // Priority filter
      const priorityMatch = filters.priorities.includes(app.priority);
      
      // Date range filter
      let dateMatch = true;
      if (filters.dateRange?.from && app.appliedDate) {
        const appDate = new Date(app.appliedDate);
        dateMatch = isAfter(appDate, filters.dateRange.from) && 
          (!filters.dateRange.to || isBefore(appDate, addDays(filters.dateRange.to, 1)));
      }
      
      // Has documents filter
      let documentsMatch = true;
      if (filters.hasDocuments !== null) {
        documentsMatch = filters.hasDocuments ? 
          !!app.documents?.length : 
          !app.documents?.length;
      }
      
      // Has deadline filter
      let deadlineMatch = true;
      if (filters.hasDeadline !== null) {
        deadlineMatch = filters.hasDeadline ? 
          !!app.deadline : 
          !app.deadline;
      }
      
      // Location filter
      const locationMatch = !filters.locationSearch || 
        (app.location && app.location.toLowerCase().includes(filters.locationSearch.toLowerCase()));
      
      return searchMatch && typeMatch && statusMatch && priorityMatch && 
        dateMatch && documentsMatch && deadlineMatch && locationMatch;
    });
    
    setFilteredApplications(filtered);
  };
  
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
            onClick: () => setActiveTab("applications")
          }
        });
        
        localStorage.setItem('lastDeadlineNotification', now.toISOString());
      }
    }
  };

  // Handle creating/editing an application
  const handleOpenForm = (application?: ApplicationEntry) => {
    if (application) {
      setSelectedApplication(application);
    } else {
      setSelectedApplication(null);
    }
    setIsFormOpen(true);
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
    setIsFormOpen(false);
  };

  // Handle deleting an application
  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
    toast({
      title: "Application Deleted",
      description: "Your application has been deleted.",
      variant: "destructive",
    });
  };

  // Handle viewing an application
  const handleViewApplication = (application: ApplicationEntry) => {
    setViewingApplication(application);
  };

  // Handle uploading a document
  const handleUploadDocument = (document: DocumentEntry) => {
    setDocuments([...documents, document]);
    toast({
      title: "Document Uploaded",
      description: `Your document "${document.name}" has been uploaded.`,
    });
  };

  // Handle deleting a document
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
  
  // Handle importing applications
  const handleImportApplications = (importedApps: ApplicationEntry[]) => {
    setApplications(importedApps);
  };
  
  // Handle importing documents
  const handleImportDocuments = (importedDocs: DocumentEntry[]) => {
    setDocuments(importedDocs);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">Application Tracker</h1>
          <p className="text-muted-foreground">
            Track and manage your job and internship applications
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === "applications" ? (
            <Button onClick={() => handleOpenForm()}>
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Button>
          ) : null}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications" className="mt-0 space-y-4">
              <AdvancedFilters 
                onFilterChange={setFilters}
                totalApplications={applications.length}
                filteredCount={filteredApplications.length}
              />
              
              <ApplicationsList
                applications={filteredApplications}
                documents={documents}
                onEdit={handleOpenForm}
                onDelete={handleDeleteApplication}
                onView={handleViewApplication}
              />
              
              {applications.length === 0 && (
                <div className="p-12 text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start tracking your job and internship applications
                  </p>
                  <Button onClick={() => handleOpenForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Application
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="documents" className="mt-0 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Upload New Document</h2>
                <DocumentUploader onUpload={handleUploadDocument} />
              </div>
              
              <DocumentsList 
                documents={documents} 
                onDelete={handleDeleteDocument} 
              />
              
              {documents.length === 0 && (
                <div className="p-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your resumes, cover letters, and other application documents
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <ApplicationAnalytics applications={applications} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <DeadlineNotifications 
            applications={applications}
            onView={handleViewApplication}
          />
          
          <ExportImportTools 
            applications={applications}
            documents={documents}
            onImportApplications={handleImportApplications}
            onImportDocuments={handleImportDocuments}
          />
        </div>
      </div>

      <ApplicationForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
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

export default ApplicationTracker;
