
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApplicationEntry, ApplicationStatus, ApplicationType, DocumentEntry } from "@/types";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarCheck, Check, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface ApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (application: ApplicationEntry) => void;
  initialData?: Partial<ApplicationEntry>;
  documents: DocumentEntry[];
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData = {},
  documents
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData.deadline ? new Date(initialData.deadline) : undefined
  );
  const [selectedAppliedDate, setSelectedAppliedDate] = useState<Date | undefined>(
    initialData.appliedDate ? new Date(initialData.appliedDate) : undefined
  );
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(initialData.documents || []);

  const isEditMode = !!initialData.id;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ApplicationEntry>({
    defaultValues: {
      id: initialData.id || uuidv4(),
      type: initialData.type || "job",
      companyName: initialData.companyName || "",
      role: initialData.role || "",
      location: initialData.location || "",
      status: initialData.status || "to_apply",
      link: initialData.link || "",
      notes: initialData.notes || "",
      salary: initialData.salary || "",
      priority: initialData.priority || "medium",
      interviews: initialData.interviews || []
    }
  });

  const onSubmit = (data: ApplicationEntry) => {
    const newApplication: ApplicationEntry = {
      ...data,
      deadline: selectedDate,
      appliedDate: selectedAppliedDate,
      documents: selectedDocuments
    };
    
    onSave(newApplication);
    onOpenChange(false);
    
    toast({
      title: isEditMode ? "Application Updated" : "Application Added",
      description: isEditMode 
        ? `Successfully updated your ${data.type} application for ${data.companyName}.` 
        : `Successfully added your ${data.type} application for ${data.companyName}.`,
    });
    
    reset();
    setSelectedDate(undefined);
    setSelectedAppliedDate(undefined);
    setSelectedDocuments([]);
  };

  const handleDocumentToggle = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  const applicationStatuses: { value: ApplicationStatus; label: string }[] = [
    { value: "to_apply", label: "To Apply" },
    { value: "applied", label: "Applied" },
    { value: "oa_received", label: "OA Received" },
    { value: "interview_scheduled", label: "Interview Scheduled" },
    { value: "interview_completed", label: "Interview Completed" },
    { value: "offer_received", label: "Offer Received" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "declined", label: "Declined" }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Edit Application" : "Add Application"}</SheetTitle>
          <SheetDescription>
            {isEditMode 
              ? "Update your job or internship application details." 
              : "Add a new job or internship application to track."
            }
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Application Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("type", { required: true })}
                >
                  <option value="job">Job</option>
                  <option value="internship">Internship</option>
                </select>
                {errors.type && <p className="text-destructive text-sm">Required</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("status", { required: true })}
                >
                  {applicationStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="text-destructive text-sm">Required</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Company</Label>
              <Input
                id="companyName"
                placeholder="Company name"
                {...register("companyName", { required: true })}
              />
              {errors.companyName && <p className="text-destructive text-sm">Required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                placeholder="Job title or role"
                {...register("role", { required: true })}
              />
              {errors.role && <p className="text-destructive text-sm">Required</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Remote, etc."
                  {...register("location", { required: true })}
                />
                {errors.location && <p className="text-destructive text-sm">Required</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("priority", { required: true })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && <p className="text-destructive text-sm">Required</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link">Application Link</Label>
              <Input
                id="link"
                placeholder="https://career.example.com/job/12345"
                {...register("link")}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Application Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select deadline"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Date Applied</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedAppliedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      {selectedAppliedDate ? format(selectedAppliedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedAppliedDate}
                      onSelect={setSelectedAppliedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary/Compensation</Label>
              <Input
                id="salary"
                placeholder="$X/hour, $X/year, etc."
                {...register("salary")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this application..."
                {...register("notes")}
                rows={3}
              />
            </div>
            
            {documents.length > 0 && (
              <div className="space-y-2">
                <Label>Attached Documents</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      type="button"
                    >
                      <span>{selectedDocuments.length > 0 
                        ? `${selectedDocuments.length} document${selectedDocuments.length !== 1 ? 's' : ''} selected` 
                        : 'Select documents'}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <div className="max-h-[200px] overflow-auto p-2">
                      {documents.map(doc => (
                        <div key={doc.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                          <Checkbox 
                            id={`doc-${doc.id}`}
                            checked={selectedDocuments.includes(doc.id)}
                            onCheckedChange={() => handleDocumentToggle(doc.id)}
                          />
                          <Label 
                            htmlFor={`doc-${doc.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            {doc.name}
                          </Label>
                        </div>
                      ))}
                      {documents.length === 0 && (
                        <p className="text-center py-4 text-muted-foreground">
                          No documents available
                        </p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Update" : "Add"} Application
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ApplicationForm;
