
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationEntry, DocumentEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Briefcase, FileText, Plus } from 'lucide-react';
import ApplicationsList from '@/components/applications/ApplicationsList';
import ApplicationForm from '@/components/applications/ApplicationForm';
import ApplicationDetails from '@/components/applications/ApplicationDetails';
import DocumentUploader from '@/components/applications/DocumentUploader';
import DocumentsList from '@/components/applications/DocumentsList';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from "sonner";
import { loadFromLocalStorage, saveToLocalStorage } from "@/utils/streakTracking";

const ApplicationTracker: React.FC = () => {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"applications" | "documents">("applications");
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

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage("applications", applications);
  }, [applications]);

  useEffect(() => {
    saveToLocalStorage("documents", documents);
  }, [documents]);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Application Tracker</h1>
        <div className="flex gap-2">
          {activeTab === "applications" ? (
            <Button onClick={() => handleOpenForm()}>
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Button>
          ) : (
            <Button onClick={() => setActiveTab("applications")}>
              <Briefcase className="mr-2 h-4 w-4" />
              Applications
            </Button>
          )}
          
          {activeTab === "documents" ? (
            <Button onClick={() => setActiveTab("applications")}>
              <Briefcase className="mr-2 h-4 w-4" />
              Applications
            </Button>
          ) : (
            <Button onClick={() => setActiveTab("documents")}>
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "applications" | "documents")}>
        <TabsList className="hidden">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="mt-0">
          <ApplicationsList
            applications={applications}
            documents={documents}
            onEdit={handleOpenForm}
            onDelete={handleDeleteApplication}
            onView={handleViewApplication}
          />
        </TabsContent>
        
        <TabsContent value="documents" className="mt-0 space-y-6">
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
        </TabsContent>
      </Tabs>

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
