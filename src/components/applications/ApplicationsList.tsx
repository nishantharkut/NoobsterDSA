
import React, { useState } from 'react';
import { ApplicationEntry, ApplicationStatus, DocumentEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Calendar, Link, FileText, Pencil, Trash, Briefcase } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ApplicationsListProps {
  applications: ApplicationEntry[];
  documents: DocumentEntry[];
  onEdit: (application: ApplicationEntry) => void;
  onDelete: (id: string) => void;
  onView: (application: ApplicationEntry) => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  applications,
  documents,
  onEdit,
  onDelete,
  onView,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'job' | 'internship'>('all');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'priority'>('newest');

  const getStatusBadgeStyle = (status: ApplicationStatus) => {
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

  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case 'to_apply':
        return 'To Apply';
      case 'applied':
        return 'Applied';
      case 'oa_received':
        return 'OA Received';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'interview_completed':
        return 'Interview Completed';
      case 'offer_received':
        return 'Offer Received';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'declined':
        return 'Declined';
      default:
        return status;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Low</Badge>;
      default:
        return null;
    }
  };

  const filteredApplications = applications.filter((app) => {
    // Search filter
    const searchMatch =
      searchTerm === '' ||
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const typeMatch = typeFilter === 'all' || app.type === typeFilter;

    // Status filter
    const statusMatch = statusFilter === 'all' || app.status === statusFilter;

    return searchMatch && typeMatch && statusMatch;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.appliedDate || new Date()).getTime() - new Date(a.appliedDate || new Date()).getTime();
    }
    if (sortOption === 'oldest') {
      return new Date(a.appliedDate || new Date()).getTime() - new Date(b.appliedDate || new Date()).getTime();
    }
    // Priority sorting: high > medium > low
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Get attached document names for an application
  const getDocumentNames = (app: ApplicationEntry) => {
    if (!app.documents?.length) return [];
    return app.documents
      .map(docId => documents.find(doc => doc.id === docId))
      .filter(Boolean)
      .map(doc => doc?.name || '');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
        {/* Top Filters */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 w-full md:max-w-xl">
          <Input
            placeholder="Search company, role, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />

          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as 'all' | 'job' | 'internship')}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="job">Jobs</SelectItem>
              <SelectItem value="internship">Internships</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort and Status Filter */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="to_apply">To Apply</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="oa_received">OA Received</SelectItem>
              <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="interview_completed">Interview Completed</SelectItem>
              <SelectItem value="offer_received">Offer Received</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value as 'newest' | 'oldest' | 'priority')}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tab view for different application groupings */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Deadlines</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* All Applications */}
        <TabsContent value="all" className="mt-0">
          {sortedApplications.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  documentNames={getDocumentNames(app)}
                  statusBadgeStyle={getStatusBadgeStyle(app.status)}
                  statusLabel={getStatusLabel(app.status)}
                  priorityBadge={getPriorityBadge(app.priority)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))}
            </div>
          ) : (
            <EmptyState searchTerm={searchTerm} />
          )}
        </TabsContent>

        {/* Active Applications */}
        <TabsContent value="active" className="mt-0">
          {sortedApplications.filter((app) => 
            !['accepted', 'rejected', 'declined'].includes(app.status)
          ).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedApplications
                .filter((app) => !['accepted', 'rejected', 'declined'].includes(app.status))
                .map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    documentNames={getDocumentNames(app)}
                    statusBadgeStyle={getStatusBadgeStyle(app.status)}
                    statusLabel={getStatusLabel(app.status)}
                    priorityBadge={getPriorityBadge(app.priority)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                  />
                ))}
            </div>
          ) : (
            <EmptyState message="No active applications found." />
          )}
        </TabsContent>

        {/* Upcoming Deadlines */}
        <TabsContent value="upcoming" className="mt-0">
          {sortedApplications.filter((app) => 
            app.deadline && new Date(app.deadline) >= new Date()
          ).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedApplications
                .filter((app) => app.deadline && new Date(app.deadline) >= new Date())
                .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
                .map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    documentNames={getDocumentNames(app)}
                    statusBadgeStyle={getStatusBadgeStyle(app.status)}
                    statusLabel={getStatusLabel(app.status)}
                    priorityBadge={getPriorityBadge(app.priority)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                  />
                ))}
            </div>
          ) : (
            <EmptyState message="No upcoming deadline applications found." />
          )}
        </TabsContent>

        {/* Completed Applications */}
        <TabsContent value="completed" className="mt-0">
          {sortedApplications.filter((app) => 
            ['accepted', 'rejected', 'declined'].includes(app.status)
          ).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedApplications
                .filter((app) => ['accepted', 'rejected', 'declined'].includes(app.status))
                .map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    documentNames={getDocumentNames(app)}
                    statusBadgeStyle={getStatusBadgeStyle(app.status)}
                    statusLabel={getStatusLabel(app.status)}
                    priorityBadge={getPriorityBadge(app.priority)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                  />
                ))}
            </div>
          ) : (
            <EmptyState message="No completed applications found." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Application Card Component
interface ApplicationCardProps {
  app: ApplicationEntry;
  documentNames: string[];
  statusBadgeStyle: string;
  statusLabel: string;
  priorityBadge: React.ReactNode;
  onEdit: (app: ApplicationEntry) => void;
  onDelete: (id: string) => void;
  onView: (app: ApplicationEntry) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  app,
  documentNames,
  statusBadgeStyle,
  statusLabel,
  priorityBadge,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-1 truncate" title={app.companyName}>
              {app.companyName}
            </CardTitle>
            <CardDescription className="line-clamp-1" title={app.role}>
              {app.role}
            </CardDescription>
          </div>
          <Badge className={statusBadgeStyle}>{statusLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 opacity-70" />
            <span>{app.type === 'job' ? 'Job' : 'Internship'}</span>
            {priorityBadge}
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 opacity-70" />
            <span>
              {app.deadline 
                ? `Deadline: ${format(new Date(app.deadline), 'MMM d, yyyy')}` 
                : app.appliedDate 
                  ? `Applied: ${format(new Date(app.appliedDate), 'MMM d, yyyy')}` 
                  : 'No dates specified'}
            </span>
          </div>
          
          {app.location && (
            <div className="flex items-start gap-2">
              <span className="opacity-70">📍</span>
              <span className="line-clamp-1">{app.location}</span>
            </div>
          )}
          
          {app.link && (
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 opacity-70" />
              <a 
                href={app.link.startsWith('http') ? app.link : `https://${app.link}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate max-w-[200px]"
              >
                View Listing
              </a>
            </div>
          )}
          
          {documentNames.length > 0 && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 opacity-70 mt-1" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="link" className="h-auto p-0 text-left font-normal">
                    {documentNames.length} attached document{documentNames.length !== 1 ? 's' : ''}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-2">
                  <div className="space-y-1">
                    {documentNames.map((name, index) => (
                      <div key={index} className="text-sm pl-2">• {name}</div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t mt-auto">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" onClick={() => onView(app)}>
            <Eye className="h-4 w-4 mr-1" /> Details
          </Button>
          <div className="space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(app)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete application</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this application? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(app.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// Empty State Component
const EmptyState: React.FC<{ message?: string; searchTerm?: string }> = ({ 
  message = "No applications found.",
  searchTerm 
}) => {
  return (
    <div className="text-center py-10 bg-muted/30 rounded-md">
      <Briefcase className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
      <p className="text-muted-foreground">{message}</p>
      {searchTerm && (
        <p className="text-muted-foreground mt-1">No results for "{searchTerm}"</p>
      )}
    </div>
  );
};

export default ApplicationsList;
