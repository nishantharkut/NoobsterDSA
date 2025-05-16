
import React, { useMemo } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapDay {
  date: string;
  count: number;
}

interface HeatmapProps {
  data: HeatmapDay[];
  startDate?: Date;
  className?: string;
}

const HeatmapChart: React.FC<HeatmapProps> = ({
  data,
  startDate = subDays(new Date(), 365),
  className = ''
}) => {
  // Process and organize the data
  const organizedData = useMemo(() => {
    // Map of date string to count
    const dateMap = new Map<string, number>();
    data.forEach(day => dateMap.set(day.date, day.count));
    
    // Generate all dates in range
    const today = new Date();
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      days.push({
        date: currentDate.toISOString(),
        count: dateMap.get(dateStr) || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Group by weeks and calculate week/month bounds
    const weeks: Array<Array<{ date: string; count: number }>> = [];
    let currentWeek: Array<{ date: string; count: number }> = [];
    
    days.forEach(day => {
      const dayOfWeek = new Date(day.date).getDay();
      
      // Start new week on Sunday
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(day);
    });
    
    // Push the last week
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return {
      weeks,
      maxCount: Math.max(...data.map(d => d.count), 5)
    };
  }, [data, startDate]);

  // Get color intensity based on count
  const getColor = (count: number): string => {
    const maxCount = Math.max(organizedData.maxCount, 5);
    if (count === 0) return 'bg-muted';
    
    const intensity = Math.min(1, count / maxCount);
    
    if (intensity <= 0.25) return 'bg-primary/20';
    if (intensity <= 0.5) return 'bg-primary/40';
    if (intensity <= 0.75) return 'bg-primary/60';
    return 'bg-primary';
  };

  const months = useMemo(() => {
    const today = new Date();
    const result = [];
    const currentDate = new Date(startDate);
    const endDate = today;
    
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    while (currentDate <= endDate) {
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      
      if (month !== currentMonth || year !== currentYear) {
        result.push({
          month: currentMonth,
          year: currentYear,
          label: format(new Date(currentYear, currentMonth), 'MMM')
        });
        currentMonth = month;
        currentYear = year;
      }
      
      currentDate.setDate(currentDate.getDate() + 7); // Jump ahead a week
    }
    
    // Add the last month
    result.push({
      month: currentMonth,
      year: currentYear,
      label: format(new Date(currentYear, currentMonth), 'MMM')
    });
    
    return result;
  }, [startDate]);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Contribution Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex mt-2 text-xs mb-1">
          {months.map((month, idx) => (
            <div key={`${month.year}-${month.month}`} className="flex-grow text-center">
              {month.label}
            </div>
          ))}
        </div>
        
        <div className="flex text-xs text-muted-foreground">
          <div className="w-6 text-center">Sun</div>
          <div className="flex-1">
            <div className="grid grid-flow-col auto-cols-fr gap-1">
              {organizedData.weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-rows-7 gap-1">
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const day = week[dayIdx];
                    if (!day) return <div key={dayIdx} className="h-3 w-3"></div>;
                    
                    const date = parseISO(day.date);
                    return (
                      <TooltipProvider key={dayIdx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`h-3 w-3 rounded-sm ${getColor(day.count)}`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{format(date, 'MMM d, yyyy')}</p>
                            <p>{day.count} problems</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end mt-2">
          <div className="text-xs mr-2">Less</div>
          <div className="h-3 w-3 bg-muted rounded-sm"></div>
          <div className="h-3 w-3 bg-primary/20 rounded-sm ml-1"></div>
          <div className="h-3 w-3 bg-primary/40 rounded-sm ml-1"></div>
          <div className="h-3 w-3 bg-primary/60 rounded-sm ml-1"></div>
          <div className="h-3 w-3 bg-primary rounded-sm ml-1"></div>
          <div className="text-xs ml-2">More</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatmapChart;
