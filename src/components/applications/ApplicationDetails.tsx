
import React from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicationEntry, DocumentEntry, InterviewEntry } from "@/types";
import { Calendar, Link, FileText, Briefcase } from "lucide-react";

interface ApplicationDetailsProps {
  application: ApplicationEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: DocumentEntry[];
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
  open,
  onOpenChange,
  documents
}) => {
  if (!application) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to_apply':
        return 'bg-muted text-muted-foreground';
      case 'applied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'oa_received':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'interview_completed':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'offer_received':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'accepted':
        return 'bg-success text-white';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'declined':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'to_apply': return 'To Apply';
      case 'applied': return 'Applied';
      case 'oa_received': return 'OA Received';
      case 'interview_scheduled': return 'Interview Scheduled';
      case 'interview_completed': return 'Interview Completed';
      case 'offer_received': return 'Offer Received';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'declined': return 'Declined';
      default: return status;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">High Priority</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium Priority</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Low Priority</Badge>;
      default: return null;
    }
  };

  // Get documents attached to this application
  const attachedDocuments = application.documents 
    ? documents.filter(doc => application.documents?.includes(doc.id))
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{application.companyName}</DialogTitle>
            <Badge className={getStatusColor(application.status)}>
              {getStatusLabel(application.status)}
            </Badge>
          </div>
          <DialogDescription className="text-base font-medium pt-1">
            {application.role}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="font-medium">{application.type === 'job' ? 'Job' : 'Internship'}</span>
            {getPriorityBadge(application.priority)}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {application.location && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Location</div>
                <div>{application.location}</div>
              </div>
            )}
            
            {application.salary && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Compensation</div>
                <div>{application.salary}</div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {application.deadline && (
              <div className="flex flex-col">
                <div className="text-sm text-muted-foreground mb-1">Application Deadline</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(application.deadline), 'MMMM d, yyyy')}
                </div>
              </div>
            )}
            
            {application.appliedDate && (
              <div className="flex flex-col">
                <div className="text-sm text-muted-foreground mb-1">Date Applied</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(application.appliedDate), 'MMMM d, yyyy')}
                </div>
              </div>
            )}
          </div>
          
          {application.link && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Application Link</div>
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <a 
                  href={application.link.startsWith('http') ? application.link : `https://${application.link}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {application.link}
                </a>
              </div>
            </div>
          )}
          
          {attachedDocuments.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Attached Documents</div>
              <ul className="space-y-1">
                {attachedDocuments.map(doc => (
                  <li key={doc.id} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{doc.name} <span className="text-sm text-muted-foreground">({doc.type})</span></span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {application.notes && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Notes</div>
              <div className="p-3 bg-muted/30 rounded-md whitespace-pre-line">
                {application.notes}
              </div>
            </div>
          )}

          {application.interviews && application.interviews.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Interviews</div>
              <div className="space-y-2">
                {application.interviews.map((interview: InterviewEntry, index: number) => (
                  <div key={interview.id} className="p-3 bg-muted/30 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">{interview.type} Interview</span>
                      <Badge variant={interview.completed ? "default" : "outline"}>
                        {interview.completed ? "Completed" : "Upcoming"}
                      </Badge>
                    </div>
                    <div className="text-sm mt-1">
                      {format(new Date(interview.date), 'MMMM d, yyyy')}
                      {interview.interviewer && ` with ${interview.interviewer}`}
                    </div>
                    {interview.notes && (
                      <div className="text-sm mt-2">{interview.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetails;
