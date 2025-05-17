
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  PlusIcon, 
  CalendarIcon, 
  TrendingUpIcon,
  ListIcon,
  Flag,
  LayoutGrid,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Helper function to handle tab changes and close mobile menu
  const handleTabChange = (tab: ActiveTab) => {
    onTabChange(tab);
    setIsMenuOpen(false);
  };

  // Map of tab labels and icons
  const tabInfo = {
    dashboard: { label: "Dashboard", icon: <TrendingUpIcon className="h-4 w-4" /> },
    logs: { label: "Logs", icon: <ListIcon className="h-4 w-4" /> },
    goals: { label: "Weekly Goals", icon: <Flag className="h-4 w-4" /> },
    templates: { label: "Templates", icon: <CalendarIcon className="h-4 w-4" /> },
    analytics: { label: "Analytics", icon: <LayoutGrid className="h-4 w-4" /> }
  };
  
  const renderTabContent = (orientation: "horizontal" | "vertical" = "horizontal") => (
    <TabsList 
      className={`${orientation === "vertical" 
        ? "flex-col items-stretch space-y-1 w-full" 
        : "w-full md:w-auto flex-wrap"}`}
    >
      <TabsTrigger 
        value="dashboard" 
        className={`flex gap-1 items-center justify-start ${orientation === "vertical" ? "px-3 py-2" : ""}`}
        onClick={() => handleTabChange("dashboard")}
      >
        {tabInfo.dashboard.icon}
        <span>Dashboard</span>
      </TabsTrigger>
      <TabsTrigger 
        value="logs" 
        className={`flex gap-1 items-center justify-start ${orientation === "vertical" ? "px-3 py-2" : "mt-0"}`}
        onClick={() => handleTabChange("logs")}
      >
        {tabInfo.logs.icon}
        <span>Logs</span>
      </TabsTrigger>
      <TabsTrigger 
        value="goals" 
        className={`flex gap-1 items-center justify-start ${orientation === "vertical" ? "px-3 py-2" : "mt-0"}`}
        onClick={() => handleTabChange("goals")}
      >
        {tabInfo.goals.icon}
        <span>Weekly Goals</span>
      </TabsTrigger>
      <TabsTrigger 
        value="templates" 
        className={`flex gap-1 items-center justify-start ${orientation === "vertical" ? "px-3 py-2" : "mt-0"}`}
        onClick={() => handleTabChange("templates")}
      >
        {tabInfo.templates.icon}
        <span>Templates</span>
      </TabsTrigger>
      <TabsTrigger 
        value="analytics" 
        className={`flex gap-1 items-center justify-start ${orientation === "vertical" ? "px-3 py-2" : "mt-0"}`}
        onClick={() => handleTabChange("analytics")}
      >
        {tabInfo.analytics.icon}
        <span>Analytics</span>
      </TabsTrigger>
    </TabsList>
  );
  
  // Render mobile breadcrumb navigation
  const renderMobileBreadcrumb = () => (
    <div className="md:hidden overflow-x-auto scrollbar-none">
      <Breadcrumb className="py-1">
        <BreadcrumbList className="flex-nowrap">
          {Object.entries(tabInfo).map(([key, { label, icon }]) => {
            const isActive = activeTab === key;
            return (
              <BreadcrumbItem key={key} className="whitespace-nowrap">
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  size="sm" 
                  className={`flex items-center gap-1 h-8 ${isActive ? 'bg-primary' : ''}`}
                  onClick={() => handleTabChange(key as ActiveTab)}
                >
                  <span className="sr-only md:not-sr-only">{icon}</span>
                  {label}
                </Button>
                {key !== "analytics" && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-3 w-3" />
                  </BreadcrumbSeparator>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );

  return (
    <header className={`sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${zenMode ? 'py-3' : ''}`}>
      <div className={`container flex h-14 md:h-16 items-center justify-between ${zenMode ? 'max-w-2xl' : ''}`}>
        <div className="flex items-center gap-2">
          <Logo size={isMobile ? 20 : 24}/>
          <h1 className={`font-bold text-foreground ${isMobile ? "text-lg" : "text-xl"}`}>NoobsterDSA</h1>
        </div>

        {!zenMode && (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:block flex-1 mx-4">
              <Tabs 
                value={activeTab} 
                onValueChange={(v) => onTabChange(v as ActiveTab)} 
                className="w-full flex justify-center"
              >
                {renderTabContent()}
              </Tabs>
            </div>
            
            {/* Mobile Breadcrumb Navigation - shown below header */}
            {isMobile && renderMobileBreadcrumb()}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden px-1">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80vw] sm:w-[300px]">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2">
                      <Logo size={20} />
                      <span>NoobsterDSA</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <Tabs 
                    value={activeTab} 
                    onValueChange={(v) => handleTabChange(v as ActiveTab)}
                    orientation="vertical"
                    className="w-full"
                  >
                    {renderTabContent("vertical")}
                  </Tabs>
                  
                  <SheetFooter className="mt-8 flex-col items-start">
                    <Button 
                      onClick={() => {
                        onCreateLog();
                        setIsMenuOpen(false);
                      }} 
                      className="w-full flex items-center gap-1 justify-center"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>New Log</span>
                    </Button>
                    <div className="flex items-center justify-between w-full mt-4">
                      <span className="text-sm text-muted-foreground">Zen Mode</span>
                      <Toggle
                        aria-label="Toggle Zen Mode"
                        pressed={zenMode}
                        onPressedChange={(enabled) => {
                          onZenModeChange(enabled);
                          setIsMenuOpen(false);
                        }}
                        size="sm"
                      >
                        {zenMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </Toggle>
                    </div>
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full mt-4">
                        Close Menu
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            )}
          </>
        )}

        <div className="flex items-center gap-2">
          <Toggle
            aria-label="Toggle Zen Mode"
            pressed={zenMode}
            onPressedChange={onZenModeChange}
            className={isMobile ? "h-8 w-8 p-0" : "mr-2"}
            size={isMobile ? "sm" : "default"}
          >
            {zenMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Toggle>
          
          <Button 
            onClick={onCreateLog} 
            size={isMobile ? "sm" : "default"}
            className="flex items-center gap-1"
          >
            <PlusIcon className="h-4 w-4" />
            {(!isMobile || zenMode) && (
              <span>{zenMode ? "New Entry" : "New Log"}</span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
