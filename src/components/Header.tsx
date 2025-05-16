
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusIcon, 
  CalendarIcon, 
  TrendingUpIcon,
  ListIcon,
  Flag
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ActiveTab = "dashboard" | "logs" | "goals" | "templates";

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onCreateLog: () => void;
}

export function Header({ activeTab, onTabChange, onCreateLog }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">CodeProgress</h1>
        </div>

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
          </TabsList>
        </Tabs>

        <Button onClick={onCreateLog} className="flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          <span className="hidden md:inline">New Log</span>
        </Button>
      </div>
    </header>
  );
}
