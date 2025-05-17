import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogEntry, LogType, Topic, Platform, DifficultyLevel, TemplateData } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface DailyLogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (log: LogEntry) => void;
  templates?: TemplateData[];
  initialData?: Partial<LogEntry>;
  zenMode?: boolean;
}

export default function DailyLogForm({ 
  open, 
  onOpenChange, 
  onSave,
  templates = [],
  initialData = {},
  zenMode = false
}: DailyLogFormProps) {
  const [formData, setFormData] = useState<Partial<LogEntry>>({
    id: initialData.id || uuidv4(),
    date: initialData.date || new Date(),
    type: initialData.type || "practice",
    topic: initialData.topic || "arrays",
    platform: initialData.platform || "leetcode",
    problemCount: initialData.problemCount || 1,
    difficultyLevel: initialData.difficultyLevel || "medium",
    timeSpent: initialData.timeSpent || 30,
    notes: initialData.notes || "",
    resources: initialData.resources || "",
    nextSteps: initialData.nextSteps || "",
    tags: initialData.tags || [],
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (field: keyof LogEntry, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags?.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    });
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        type: template.type,
        topic: template.topic,
        platform: template.platform,
        difficultyLevel: template.difficultyLevel,
        notes: template.notes,
        resources: template.resources,
        nextSteps: template.nextSteps,
        tags: template.tags,
      });
    }
  };

  const handleSave = () => {
    onSave(formData as LogEntry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${zenMode ? 'max-w-2xl' : 'max-w-3xl'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{zenMode ? 'New Entry' : 'Create New Progress Log'}</DialogTitle>
          <DialogDescription>
            {zenMode ? 'Add a quick entry to your coding journal' : 'Log your coding progress and track your journey'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {templates.length > 0 && !zenMode && (
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="template">Apply Template</Label>
              <Select onValueChange={handleApplyTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date ? new Date(formData.date).toISOString().slice(0, 10) : ""}
              onChange={(e) => handleChange("date", new Date(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Log Type</Label>
            <RadioGroup
              defaultValue={formData.type}
              onValueChange={(value) => handleChange("type", value as LogType)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="practice" id="practice" />
                <Label htmlFor="practice">Practice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contest" id="contest" />
                <Label htmlFor="contest">Contest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="learning" id="learning" />
                <Label htmlFor="learning">Learning</Label>
              </div>
              {zenMode && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mock_interview" id="mock_interview" />
                  <Label htmlFor="mock_interview">Mock Interview</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Select 
              value={formData.topic} 
              onValueChange={(value) => handleChange("topic", value as Topic)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select 
              value={formData.platform} 
              onValueChange={(value) => handleChange("platform", value as Platform)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leetcode">LeetCode</SelectItem>
                <SelectItem value="codeforces">Codeforces</SelectItem>
                <SelectItem value="hackerrank">HackerRank</SelectItem>
                <SelectItem value="codechef">CodeChef</SelectItem>
                <SelectItem value="atcoder">AtCoder</SelectItem>
                <SelectItem value="geeksforgeeks">GeeksForGeeks</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemCount">Problems Solved</Label>
            <Input
              id="problemCount"
              type="number"
              min={1}
              value={formData.problemCount}
              onChange={(e) => handleChange("problemCount", parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select 
              value={formData.difficultyLevel} 
              onValueChange={(value) => handleChange("difficultyLevel", value as DifficultyLevel)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeSpent">Time Spent (minutes)</Label>
            <Input
              id="timeSpent"
              type="number"
              min={1}
              value={formData.timeSpent}
              onChange={(e) => handleChange("timeSpent", parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
              placeholder="What did you learn? What challenges did you face?"
            />
          </div>

          {!zenMode && (
            <>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="resources">Resources Used</Label>
                <Textarea
                  id="resources"
                  value={formData.resources}
                  onChange={(e) => handleChange("resources", e.target.value)}
                  rows={2}
                  placeholder="Links to resources, videos, articles, etc."
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="nextSteps">Next Steps</Label>
                <Textarea
                  id="nextSteps"
                  value={formData.nextSteps}
                  onChange={(e) => handleChange("nextSteps", e.target.value)}
                  rows={2}
                  placeholder="What will you focus on next?"
                />
              </div>
            </>
          )}

          {zenMode && (
            <>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="blockers">Blockers</Label>
                <Textarea
                  id="blockers"
                  value={formData.blockers || ""}
                  onChange={(e) => handleChange("blockers", e.target.value)}
                  rows={2}
                  placeholder="Any blockers or challenges faced during this session?"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="reflections">Reflections</Label>
                <Textarea
                  id="reflections"
                  value={formData.reflections || ""}
                  onChange={(e) => handleChange("reflections", e.target.value)}
                  rows={2}
                  placeholder="Personal reflections on today's session"
                />
              </div>
            </>
          )}

          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map((tag) => (
                <div 
                  key={tag} 
                  className="bg-muted text-muted-foreground px-2 py-1 rounded-md flex items-center gap-1"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Log</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
