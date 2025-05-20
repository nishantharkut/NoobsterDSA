
import React, { useState, useRef } from 'react';
import { ApplicationEntry, DocumentEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileDown, FileUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

interface ExportImportToolsProps {
  applications: ApplicationEntry[];
  documents: DocumentEntry[];
  onImportApplications: (apps: ApplicationEntry[]) => void;
  onImportDocuments: (docs: DocumentEntry[]) => void;
}

const ExportImportTools: React.FC<ExportImportToolsProps> = ({
  applications,
  documents,
  onImportApplications,
  onImportDocuments
}) => {
  const { toast } = useToast();
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'validating' | 'importing' | 'success' | 'error'>('idle');
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<{
    applications: number;
    documents: number;
    newApplications: number;
    newDocuments: number;
  }>({
    applications: 0,
    documents: 0,
    newApplications: 0,
    newDocuments: 0
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle exporting all data
  const handleExportAll = () => {
    try {
      setExportProgress(25);
      
      const exportData = {
        applications,
        documents,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      setExportProgress(50);
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      setExportProgress(75);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `application-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      setExportProgress(100);
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Exported ${applications.length} applications and ${documents.length} documents.`,
      });
      
      setTimeout(() => setExportProgress(0), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
      setExportProgress(0);
    }
  };

  // Handle export applications only
  const handleExportApplications = () => {
    try {
      setExportProgress(25);
      
      const exportData = {
        applications,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      setExportProgress(50);
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      setExportProgress(75);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      setExportProgress(100);
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Exported ${applications.length} applications.`,
      });
      
      setTimeout(() => setExportProgress(0), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
      setExportProgress(0);
    }
  };

  // Handle export documents only
  const handleExportDocuments = () => {
    try {
      setExportProgress(25);
      
      const exportData = {
        documents,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      setExportProgress(50);
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      setExportProgress(75);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `documents-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      setExportProgress(100);
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Exported ${documents.length} documents.`,
      });
      
      setTimeout(() => setExportProgress(0), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
      setExportProgress(0);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImportStatus('validating');
    setImportProgress(20);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        setImportProgress(40);
        
        // Validate the imported data
        if (!importedData) {
          throw new Error('Invalid file format');
        }
        
        // Initialize preview data
        let importedApplications: ApplicationEntry[] = [];
        let importedDocuments: DocumentEntry[] = [];
        
        // Check and extract applications
        if (Array.isArray(importedData.applications)) {
          importedApplications = importedData.applications;
        }
        
        // Check and extract documents
        if (Array.isArray(importedData.documents)) {
          importedDocuments = importedData.documents;
        }
        
        setImportProgress(70);
        
        // Calculate new items (simple check by ID)
        const existingAppIds = new Set(applications.map(app => app.id));
        const existingDocIds = new Set(documents.map(doc => doc.id));
        
        const newApps = importedApplications.filter(app => !existingAppIds.has(app.id));
        const newDocs = importedDocuments.filter(doc => !existingDocIds.has(doc.id));
        
        // Set preview info
        setImportPreview({
          applications: importedApplications.length,
          documents: importedDocuments.length,
          newApplications: newApps.length,
          newDocuments: newDocs.length
        });
        
        setImportProgress(100);
        setImportStatus('success');
        
        // Store the valid data for import
        localStorage.setItem('importPreviewData', JSON.stringify({
          applications: importedApplications,
          documents: importedDocuments
        }));
        
      } catch (error) {
        console.error('Import validation failed:', error);
        setImportStatus('error');
        setImportError('Invalid file format or corrupted data');
        setImportProgress(0);
      }
    };
    
    reader.onerror = () => {
      setImportStatus('error');
      setImportError('Failed to read the file');
      setImportProgress(0);
    };
    
    reader.readAsText(file);
  };

  // Handle actual import
  const handleImport = () => {
    try {
      setImportStatus('importing');
      setImportProgress(50);
      
      const storedData = localStorage.getItem('importPreviewData');
      if (!storedData) {
        throw new Error('Import data not found');
      }
      
      const { applications: importedApplications, documents: importedDocuments } = JSON.parse(storedData);
      
      // Merge with existing data (avoid duplicates by ID)
      const existingAppIds = new Set(applications.map(app => app.id));
      const existingDocIds = new Set(documents.map(doc => doc.id));
      
      const newApps = importedApplications.filter(app => !existingAppIds.has(app.id));
      const newDocs = importedDocuments.filter(doc => !existingDocIds.has(doc.id));
      
      setImportProgress(75);
      
      // Update application and document lists
      if (newApps.length > 0) {
        onImportApplications([...applications, ...newApps]);
      }
      
      if (newDocs.length > 0) {
        onImportDocuments([...documents, ...newDocs]);
      }
      
      setImportProgress(100);
      
      // Clean up and reset
      localStorage.removeItem('importPreviewData');
      setImportStatus('idle');
      setImportPreview({
        applications: 0,
        documents: 0,
        newApplications: 0,
        newDocuments: 0
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      sonnerToast("Import successful", {
        description: `Imported ${newApps.length} new applications and ${newDocs.length} new documents.`,
        duration: 5000,
      });
      
      setTimeout(() => setImportProgress(0), 2000);
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
      setImportError('Import failed. Please try again.');
      setImportProgress(0);
    }
  };

  // Handle cancel import
  const handleCancelImport = () => {
    localStorage.removeItem('importPreviewData');
    setImportStatus('idle');
    setImportProgress(0);
    setImportError(null);
    setImportPreview({
      applications: 0,
      documents: 0,
      newApplications: 0,
      newDocuments: 0
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import & Export</CardTitle>
        <CardDescription>
          Backup your data or import from another device
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="export">
          <TabsList className="mb-4">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export your application data and documents to backup or transfer to another device.
              </p>
              
              {exportProgress > 0 && (
                <Progress value={exportProgress} className="mb-2" />
              )}
              
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={handleExportAll} 
                  className="justify-start"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export All Data ({applications.length} applications, {documents.length} documents)
                </Button>
                
                <Button 
                  onClick={handleExportApplications} 
                  variant="outline" 
                  className="justify-start"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Applications Only ({applications.length})
                </Button>
                
                <Button 
                  onClick={handleExportDocuments} 
                  variant="outline" 
                  className="justify-start"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Documents Only ({documents.length})
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="import">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Import application data from a previous export file. This will add new applications and documents without overwriting existing ones.
              </p>
              
              {importProgress > 0 && (
                <Progress value={importProgress} className="mb-2" />
              )}
              
              {importStatus === 'idle' && (
                <div className="flex flex-col space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="justify-start"
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Select Import File
                  </Button>
                </div>
              )}
              
              {importStatus === 'validating' && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validating Import File</AlertTitle>
                  <AlertDescription>
                    Please wait while we validate your import file...
                  </AlertDescription>
                </Alert>
              )}
              
              {importStatus === 'success' && (
                <div className="space-y-4">
                  <Alert variant="default" className="border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Import File Valid</AlertTitle>
                    <AlertDescription>
                      Found {importPreview.applications} applications and {importPreview.documents} documents.
                      <br />
                      Ready to import {importPreview.newApplications} new applications and {importPreview.newDocuments} new documents.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleImport}>
                      Import Data
                    </Button>
                    <Button variant="outline" onClick={handleCancelImport}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {importStatus === 'error' && (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Import Error</AlertTitle>
                    <AlertDescription>
                      {importError || 'An unknown error occurred during import.'}
                    </AlertDescription>
                  </Alert>
                  
                  <Button variant="outline" onClick={handleCancelImport}>
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Your data is stored locally in your browser. Regular exports are recommended for safekeeping.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ExportImportTools;
