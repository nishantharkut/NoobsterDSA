
import { useState } from "react";
import { TemplateData, LogType, Topic, Platform, DifficultyLevel } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PenIcon, CodeIcon, EditIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface TemplateSelectorProps {
  templates: TemplateData[];
  onSaveTemplate: (template: TemplateData) => void;
  onDeleteTemplate: (id: string) => void;
}

export default function TemplateSelector({ templates, onSaveTemplate, onDeleteTemplate }: TemplateSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateData>({
    id: "",
    name: "",
    type: "practice",
    topic: "arrays",
    platform: "leetcode",
    difficultyLevel: "medium",
    notes: "",
    resources: "",
    nextSteps: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  const handleNewTemplate = () => {
    setCurrentTemplate({
      id: uuidv4(),
      name: "",
      type: "practice",
      topic: "arrays",
      platform: "leetcode",
      difficultyLevel: "medium",
      notes: "",
      resources: "",
      nextSteps: "",
      tags: [],
    });
    setTagInput("");
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (template: TemplateData) => {
    setCurrentTemplate(template);
    setTagInput("");
    setIsDialogOpen(true);
  };

  const handleAddTag = () => {
    if (tagInput && !currentTemplate.tags.includes(tagInput)) {
      setCurrentTemplate({
        ...currentTemplate,
        tags: [...currentTemplate.tags, tagInput],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCurrentTemplate({
      ...currentTemplate,
      tags: currentTemplate.tags.filter(t => t !== tag),
    });
  };

  const handleSaveTemplate = () => {
    if (currentTemplate.name.trim()) {
      onSaveTemplate(currentTemplate);
      setIsDialogOpen(false);
    }
  };

  const getTemplateIcon = (type: LogType) => {
    switch (type) {
      case "practice":
        return <PenIcon className="h-5 w-5" />;
      case "contest":
        return <CodeIcon className="h-5 w-5" />;
      case "learning":
        return <CalendarIcon className="h-5 w-5" />;
      default:
        return <PenIcon className="h-5 w-5" />;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Templates</h2>
        <Button onClick={handleNewTemplate}>Create Template</Button>
      </div>
      
      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates yet. Create a template to speed up your log entries!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {getTemplateIcon(template.type)}
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <span className="capitalize">{template.type}</span>
                      <span>•</span>
                      <span className="capitalize">{template.platform}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="outline" className={`tag-${template.topic}`}>
                    {template.topic.charAt(0).toUpperCase() + template.topic.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {template.difficultyLevel.charAt(0).toUpperCase() + template.difficultyLevel.slice(1)}
                  </Badge>
                </div>
                
                {template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-0">
                <div className="flex w-full justify-between">
                  <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                    <EditIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDeleteTemplate(template.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentTemplate.id ? "Edit Template" : "Create Template"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={currentTemplate.name}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                placeholder="Daily LeetCode Practice"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Log Type</Label>
              <RadioGroup
                value={currentTemplate.type}
                onValueChange={(value) => setCurrentTemplate({ 
                  ...currentTemplate, 
                  type: value as LogType 
                })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="practice" id="practice-template" />
                  <Label htmlFor="practice-template">Practice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="contest" id="contest-template" />
                  <Label htmlFor="contest-template">Contest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="learning" id="learning-template" />
                  <Label htmlFor="learning-template">Learning</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select 
                  value={currentTemplate.topic} 
                  onValueChange={(value) => setCurrentTemplate({ 
                    ...currentTemplate, 
                    topic: value as Topic 
                  })}
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
                  value={currentTemplate.platform} 
                  onValueChange={(value) => setCurrentTemplate({ 
                    ...currentTemplate, 
                    platform: value as Platform 
                  })}
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select 
                value={currentTemplate.difficultyLevel} 
                onValueChange={(value) => setCurrentTemplate({ 
                  ...currentTemplate, 
                  difficultyLevel: value as DifficultyLevel 
                })}
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
              <Label htmlFor="notes">Notes Template</Label>
              <Textarea
                id="notes"
                value={currentTemplate.notes}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, notes: e.target.value })}
                placeholder="Template text for notes field..."
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resources">Resources Template</Label>
              <Textarea
                id="resources"
                value={currentTemplate.resources}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, resources: e.target.value })}
                placeholder="Common resources you use..."
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nextSteps">Next Steps Template</Label>
              <Textarea
                id="nextSteps"
                value={currentTemplate.nextSteps}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, nextSteps: e.target.value })}
                placeholder="Common follow-up actions..."
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Default Tags</Label>
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
                {currentTemplate.tags.map((tag) => (
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
