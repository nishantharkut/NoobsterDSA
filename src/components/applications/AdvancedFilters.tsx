
import React, { useState } from 'react';
import { ApplicationStatus, ApplicationType } from '@/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';
import { Filter, CalendarRange, X, Search, Check } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalApplications: number;
  filteredCount: number;
}

export interface FilterOptions {
  searchTerm: string;
  types: ApplicationType[];
  statuses: ApplicationStatus[];
  priorities: string[];
  dateRange: DateRange | undefined;
  hasDocuments: boolean | null;
  hasDeadline: boolean | null;
  locationSearch: string;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'to_apply',
  'applied',
  'oa_received',
  'interview_scheduled',
  'interview_completed',
  'offer_received',
  'accepted',
  'rejected',
  'declined'
];

const ALL_TYPES: ApplicationType[] = ['job', 'internship'];
const ALL_PRIORITIES = ['high', 'medium', 'low'];

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFilterChange,
  totalApplications,
  filteredCount
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [types, setTypes] = useState<ApplicationType[]>([...ALL_TYPES]);
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([...ALL_STATUSES]);
  const [priorities, setPriorities] = useState<string[]>([...ALL_PRIORITIES]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [hasDocuments, setHasDocuments] = useState<boolean | null>(null);
  const [hasDeadline, setHasDeadline] = useState<boolean | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  // Calculate active filter count
  const calculateActiveFilterCount = () => {
    let count = 0;
    
    if (searchTerm) count++;
    if (types.length !== ALL_TYPES.length) count++;
    if (statuses.length !== ALL_STATUSES.length) count++;
    if (priorities.length !== ALL_PRIORITIES.length) count++;
    if (dateRange?.from) count++;
    if (hasDocuments !== null) count++;
    if (hasDeadline !== null) count++;
    if (locationSearch) count++;
    
    setActiveFilterCount(count);
    return count;
  };
  
  // Apply filters
  const applyFilters = () => {
    const filters: FilterOptions = {
      searchTerm,
      types,
      statuses,
      priorities,
      dateRange,
      hasDocuments,
      hasDeadline,
      locationSearch
    };
    
    onFilterChange(filters);
    calculateActiveFilterCount();
    setIsOpen(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setTypes([...ALL_TYPES]);
    setStatuses([...ALL_STATUSES]);
    setPriorities([...ALL_PRIORITIES]);
    setDateRange(undefined);
    setHasDocuments(null);
    setHasDeadline(null);
    setLocationSearch('');
    
    const filters: FilterOptions = {
      searchTerm: '',
      types: [...ALL_TYPES],
      statuses: [...ALL_STATUSES],
      priorities: [...ALL_PRIORITIES],
      dateRange: undefined,
      hasDocuments: null,
      hasDeadline: null,
      locationSearch: ''
    };
    
    onFilterChange(filters);
    setActiveFilterCount(0);
  };
  
  // Handle type checkbox changes
  const handleTypeChange = (type: ApplicationType, checked: boolean) => {
    if (checked) {
      setTypes([...types, type]);
    } else {
      setTypes(types.filter(t => t !== type));
    }
  };
  
  // Handle status checkbox changes
  const handleStatusChange = (status: ApplicationStatus, checked: boolean) => {
    if (checked) {
      setStatuses([...statuses, status]);
    } else {
      setStatuses(statuses.filter(s => s !== status));
    }
  };
  
  // Handle priority checkbox changes
  const handlePriorityChange = (priority: string, checked: boolean) => {
    if (checked) {
      setPriorities([...priorities, priority]);
    } else {
      setPriorities(priorities.filter(p => p !== priority));
    }
  };
  
  // Format the date range for display
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range) return '';
    
    let formattedRange = '';
    if (range.from) {
      if (isValid(range.from)) {
        formattedRange += format(range.from, 'LLL dd, y');
      }
    }
    
    if (range.to && isValid(range.to)) {
      formattedRange += ` - ${format(range.to, 'LLL dd, y')}`;
    }
    
    return formattedRange;
  };
  
  // Status label mapping
  const getStatusLabel = (status: ApplicationStatus) => {
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

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        {/* Search bar */}
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search company, role, or notes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onFilterChange({
                searchTerm: e.target.value,
                types,
                statuses,
                priorities,
                dateRange,
                hasDocuments,
                hasDeadline,
                locationSearch
              });
              calculateActiveFilterCount();
            }}
          />
        </div>
        
        {/* Filter button */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 sm:w-96 p-0" align="end">
            <Card className="border-0">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Advanced Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
                <CardDescription>
                  Filter your applications by multiple criteria
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* Types filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={types.includes(type)}
                          onCheckedChange={(checked) => 
                            handleTypeChange(type, checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`type-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type === 'job' ? 'Jobs' : 'Internships'}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Status filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_STATUSES.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`status-${status}`} 
                          checked={statuses.includes(status)}
                          onCheckedChange={(checked) => 
                            handleStatusChange(status, checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`status-${status}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {getStatusLabel(status)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Priority filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Priority</h3>
                  <div className="flex gap-2">
                    {ALL_PRIORITIES.map((priority) => (
                      <div key={priority} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`priority-${priority}`} 
                          checked={priorities.includes(priority)}
                          onCheckedChange={(checked) => 
                            handlePriorityChange(priority, checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`priority-${priority}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Date range filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Application Date Range</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange && "text-muted-foreground"
                        )}
                      >
                        <CalendarRange className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          formatDateRange(dateRange)
                        ) : (
                          "Select date range"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                      {dateRange?.from && (
                        <div className="flex items-center justify-end gap-2 p-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDateRange(undefined)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Location filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Location</h3>
                  <Input 
                    placeholder="Filter by location..." 
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                </div>
                
                {/* Has documents filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Documents</h3>
                  <Select 
                    value={hasDocuments === null ? '' : hasDocuments ? 'yes' : 'no'}
                    onValueChange={(value) => {
                      if (value === '') {
                        setHasDocuments(null);
                      } else {
                        setHasDocuments(value === 'yes');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Has attached documents?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="yes">Has Documents</SelectItem>
                      <SelectItem value="no">No Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Has deadline filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Deadline</h3>
                  <Select 
                    value={hasDeadline === null ? '' : hasDeadline ? 'yes' : 'no'}
                    onValueChange={(value) => {
                      if (value === '') {
                        setHasDeadline(null);
                      } else {
                        setHasDeadline(value === 'yes');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Has deadline?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="yes">Has Deadline</SelectItem>
                      <SelectItem value="no">No Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full" onClick={applyFilters}>
                  <Check className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Filter info */}
      {filteredCount < totalApplications && (
        <div className="flex items-center">
          <p className="text-xs text-muted-foreground">
            Showing {filteredCount} of {totalApplications} applications
          </p>
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 h-6 px-2 text-xs" 
              onClick={resetFilters}
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
