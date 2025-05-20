
import React, { useState } from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DocumentEntry } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileText, Download, Trash, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface DocumentsListProps {
  documents: DocumentEntry[];
  onDelete: (id: string) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ documents, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingDocument, setViewingDocument] = useState<DocumentEntry | null>(null);

  const filteredDocuments = documents.filter((doc) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      doc.name.toLowerCase().includes(searchTermLower) ||
      doc.type.toLowerCase().includes(searchTermLower) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
    );
  });

  const handleDownload = (doc: DocumentEntry) => {
    const blob = base64ToBlob(doc.content, doc.mimeType);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.name}.${getFileExtension(doc.mimeType)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeType });
  };

  const getFileExtension = (mimeType: string) => {
    switch (mimeType) {
      case 'application/pdf': return 'pdf';
      case 'image/jpeg': return 'jpg';
      case 'image/png': return 'png';
      case 'application/msword': return 'doc';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'docx';
      default: return 'file';
    }
  };

  const getDocumentTypeLabel = (type: DocumentEntry["type"]) => {
    switch (type) {
      case 'resume': return 'Resume';
      case 'cover_letter': return 'Cover Letter';
      case 'portfolio': return 'Portfolio';
      case 'recommendation': return 'Recommendation';
      case 'transcript': return 'Transcript';
      case 'other': return 'Other';
      default: return type;
    }
  };

  const handleViewDocument = (doc: DocumentEntry) => {
    setViewingDocument(doc);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Documents</h3>
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-10 bg-muted/30 rounded-md">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No documents found</p>
          {searchTerm && (
            <Button variant="link" onClick={() => setSearchTerm("")}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{getDocumentTypeLabel(doc.type)}</TableCell>
                  <TableCell>{doc.version}</TableCell>
                  <TableCell>{format(new Date(doc.dateUpdated), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="inline-block bg-muted text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{viewingDocument?.name}</DialogTitle>
                            <DialogDescription>
                              {viewingDocument?.type} • Version {viewingDocument?.version}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            {viewingDocument && viewingDocument.mimeType.startsWith('image/') ? (
                              <img 
                                src={`data:${viewingDocument.mimeType};base64,${viewingDocument.content}`} 
                                alt={viewingDocument.name}
                                className="max-h-[70vh] mx-auto"
                              />
                            ) : viewingDocument && viewingDocument.mimeType === 'application/pdf' ? (
                              <iframe 
                                src={`data:${viewingDocument.mimeType};base64,${viewingDocument.content}`} 
                                title={viewingDocument.name}
                                className="w-full h-[70vh]"
                              />
                            ) : (
                              <div className="text-center py-10">
                                <FileText className="mx-auto h-10 w-10 mb-2" />
                                <p>Preview not available. Download to view this document.</p>
                                <Button 
                                  variant="outline" 
                                  className="mt-4"
                                  onClick={() => viewingDocument && handleDownload(viewingDocument)}
                                >
                                  <Download className="h-4 w-4 mr-2" /> Download
                                </Button>
                              </div>
                            )}
                            
                            {viewingDocument?.description && (
                              <div className="mt-4">
                                <h4 className="text-sm font-semibold mb-1">Description:</h4>
                                <p className="text-sm text-muted-foreground">{viewingDocument.description}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete document</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this document? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(doc.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DocumentsList;
