import { useState } from "react";
import { LogEntry, Topic, Platform, DifficultyLevel, LogType } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ClockIcon, FilterIcon, ListIcon, EditIcon } from "lucide-react";
import { formatMinutes } from "@/utils/analytics";

interface LogsListProps {
  logs: LogEntry[];
  onEdit: (log: LogEntry) => void;
  onDelete: (id: string) => void;
  zenMode?: boolean; // Added missing prop
}

export default function LogsList({ logs, onEdit, onDelete, zenMode = false }: LogsListProps) {
  const [filterTopic, setFilterTopic] = useState<Topic | "all">("all");
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all");
  const [filterType, setFilterType] = useState<LogType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "topic" | "platform">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredLogs = logs
    .filter(log => 
      (filterTopic === "all" || log.topic === filterTopic) &&
      (filterPlatform === "all" || log.platform === filterPlatform) &&
      (filterType === "all" || log.type === filterType) &&
      (
        searchTerm === "" || 
        log.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortDirection === "asc" 
          ? new Date(a.date).getTime() - new Date(b.date).getTime() 
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "topic") {
        return sortDirection === "asc" 
          ? a.topic.localeCompare(b.topic) 
          : b.topic.localeCompare(a.topic);
      } else {
        return sortDirection === "asc" 
          ? a.platform.localeCompare(b.platform) 
          : b.platform.localeCompare(a.platform);
      }
    });

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: LogType) => {
    switch (type) {
      case "practice":
        return <ListIcon className="h-4 w-4" />;
      case "contest":
        return <FilterIcon className="h-4 w-4" />;
      case "learning":
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <ListIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {!zenMode && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterTopic} onValueChange={(value) => setFilterTopic(value as Topic | "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="arrays">Arrays</SelectItem>
                <SelectItem value="strings">Strings</SelectItem>
                <SelectItem value="linkedlist">Linked List</SelectItem>
                <SelectItem value="trees">Trees</SelectItem>
                <SelectItem value="graphs">Graphs</SelectItem>
                <SelectItem value="dp">Dynamic Programming</SelectItem>
                <SelectItem value="greedy">Greedy</SelectItem>
                <SelectItem value="backtracking">Backtracking</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPlatform} onValueChange={(value) => setFilterPlatform(value as Platform | "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="leetcode">LeetCode</SelectItem>
                <SelectItem value="codeforces">Codeforces</SelectItem>
                <SelectItem value="hackerrank">HackerRank</SelectItem>
                <SelectItem value="codechef">CodeChef</SelectItem>
                <SelectItem value="atcoder">AtCoder</SelectItem>
                <SelectItem value="geeksforgeeks">GeeksForGeeks</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={(value) => setFilterType(value as LogType | "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Log Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="contest">Contest</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "topic" | "platform")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="topic">Topic</SelectItem>
                <SelectItem value="platform">Platform</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>
      )}

      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No logs found. Create a new log to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLogs.map((log) => (
            <Card key={log.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Badge variant="outline" className={`tag-${log.topic}`}>
                        {log.topic.charAt(0).toUpperCase() + log.topic.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(log.difficultyLevel)}>
                        {log.difficultyLevel.charAt(0).toUpperCase() + log.difficultyLevel.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getTypeIcon(log.type)}
                      <span className="capitalize">{log.type}</span>
                    </CardTitle>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <span className="capitalize">{log.platform}</span>
                  <span>•</span>
                  <span>{log.problemCount} problem{log.problemCount > 1 ? "s" : ""}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    {formatMinutes(log.timeSpent)}
                  </span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-sm">
                {log.notes && (
                  <div className="mb-2">
                    <div className="font-medium">Notes:</div>
                    <p className="text-muted-foreground truncate">{log.notes}</p>
                  </div>
                )}
                
                {log.tags && log.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {log.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-0">
                <Button variant="ghost" size="sm" onClick={() => onEdit(log)}>
                  <EditIcon className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(log.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
