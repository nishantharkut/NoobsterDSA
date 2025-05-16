
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusIcon, 
  CalendarIcon, 
  TrendingUpIcon,
  ListIcon,
  Flag,
  LayoutGrid,
  Moon,
  Sun
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";

export type ActiveTab = "dashboard" | "logs" | "goals" | "templates" | "analytics";

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onCreateLog: () => void;
  zenMode: boolean;
  onZenModeChange: (enabled: boolean) => void;
}

export function Header({ 
  activeTab, 
  onTabChange, 
  onCreateLog, 
  zenMode, 
  onZenModeChange 
}: HeaderProps) {
  return (
    <header className={`sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${zenMode ? 'py-4' : ''}`}>
      <div className={`container flex h-16 items-center justify-between ${zenMode ? 'max-w-2xl' : ''}`}>
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">CodeProgress</h1>
        </div>

        {!zenMode && (
          <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as ActiveTab)} className="hidden md:flex">
            <TabsList>
              <TabsTrigger value="dashboard" className="flex gap-1">
                <TrendingUpIcon className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex gap-1">
                <ListIcon className="h-4 w-4" />
                <span>Logs</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex gap-1">
                <Flag className="h-4 w-4" />
                <span>Weekly Goals</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Templates</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex gap-1">
                <LayoutGrid className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="flex items-center gap-2">
          <Toggle
            aria-label="Toggle Zen Mode"
            pressed={zenMode}
            onPressedChange={onZenModeChange}
            className="mr-2"
          >
            {zenMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Toggle>
          
          <Button onClick={onCreateLog} className="flex items-center gap-1">
            <PlusIcon className="h-4 w-4" />
            <span className="hidden md:inline">{zenMode ? "New Entry" : "New Log"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
