
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentEntry } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Upload, File, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentUploaderProps {
  onUpload: (document: DocumentEntry) => void;
  maxSize?: number; // Maximum file size in MB
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  onUpload, 
  maxSize = 5 // Default 5MB
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<DocumentEntry["type"]>("resume");
  const [version, setVersion] = useState("1.0");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast: uiToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    setSelectedFile(file);
    if (!name) {
      setName(file.name.split('.')[0]); // Set name from filename if empty
    }
  };
  
  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };
  
  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Read file content as base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64Content = reader.result as string;
        
        // Create document entry
        const newDocument: DocumentEntry = {
          id: uuidv4(),
          name,
          type,
          version,
          description,
          dateCreated: new Date(),
          dateUpdated: new Date(),
          tags,
          content: base64Content.split(',')[1], // Remove data:mime/type;base64, prefix
          mimeType: selectedFile.type,
        };
        
        onUpload(newDocument);
        resetForm();
        toast.success("Document uploaded successfully!");
      };
      
      reader.onerror = () => {
        throw new Error("Failed to read file");
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast.error("Failed to upload document");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setName("");
    setType("resume");
    setVersion("1.0");
    setDescription("");
    setTags([]);
    setTagInput("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document-file">Upload Document</Label>
        <div className="flex items-center gap-2">
          <Input
            id="document-file"
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" /> Browse
          </Button>
        </div>
        {selectedFile && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <File className="h-4 w-4" />
            <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="document-name">Name</Label>
          <Input
            id="document-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Resume, Cover Letter, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="document-type">Type</Label>
          <select
            id="document-type"
            value={type}
            onChange={(e) => setType(e.target.value as DocumentEntry["type"])}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="resume">Resume</option>
            <option value="cover_letter">Cover Letter</option>
            <option value="portfolio">Portfolio</option>
            <option value="recommendation">Recommendation Letter</option>
            <option value="transcript">Academic Transcript</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="document-version">Version</Label>
          <Input
            id="document-version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0, Fall 2025, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="document-tags">Tags (press Enter to add)</Label>
          <Input
            id="document-tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            placeholder="backend, frontend, java, etc."
          />
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.map(tag => (
                <div key={tag} className="bg-muted text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => handleTagRemove(tag)} className="h-3 w-3 rounded-full">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="document-description">Description</Label>
        <Textarea
          id="document-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this document..."
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={resetForm}>
          Reset
        </Button>
        <Button type="submit" disabled={isUploading || !selectedFile}>
          {isUploading ? "Uploading..." : "Upload Document"}
        </Button>
      </div>
    </form>
  );
};

export default DocumentUploader;
