
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger
} from "@/components/ui/drawer";

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
  const [openMobileNav, setOpenMobileNav] = useState(false);
  
  // Helper function to handle tab changes and close mobile menu
  const handleTabChange = (tab: ActiveTab) => {
    onTabChange(tab);
    setIsMenuOpen(false);
    setOpenMobileNav(false);
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
  
  // Render mobile navigation options - now using Drawer for better mobile experience
  const renderMobileNavigation = () => (
    <div className="md:hidden w-full">
      <Drawer open={openMobileNav} onOpenChange={setOpenMobileNav}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full my-2 flex items-center justify-between border">
            <div className="flex items-center gap-2">
              {tabInfo[activeTab].icon}
              <span>{tabInfo[activeTab].label}</span>
            </div>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-6">
          <div className="mt-6 max-h-[70vh] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(tabInfo).map(([key, { label, icon }]) => {
                const isActive = activeTab === key;
                return (
                  <Button 
                    key={key}
                    variant={isActive ? "default" : "outline"} 
                    className={`flex items-center justify-start gap-3 w-full py-6`}
                    onClick={() => handleTabChange(key as ActiveTab)}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="text-base">{label}</span>
                  </Button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-base font-medium">Zen Mode</span>
                <Toggle
                  aria-label="Toggle Zen Mode"
                  pressed={zenMode}
                  onPressedChange={(enabled) => {
                    onZenModeChange(enabled);
                    setOpenMobileNav(false);
                  }}
                >
                  {zenMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Toggle>
              </div>
              
              <Button 
                onClick={() => {
                  onCreateLog();
                  setOpenMobileNav(false);
                }} 
                className="w-full flex items-center gap-2 py-6"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="text-base">New Log</span>
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );

  return (
    <header className={`sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${zenMode ? 'py-2' : ''}`}>
      <div className={`container flex flex-col h-auto md:h-16 ${zenMode ? 'max-w-2xl' : ''}`}>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Logo size={isMobile ? 24 : 24}/>
            <h1 className="font-bold text-foreground text-lg">NoobsterDSA</h1>
          </div>

          <div className="flex items-center gap-2">
            <Toggle
              aria-label="Toggle Zen Mode"
              pressed={zenMode}
              onPressedChange={onZenModeChange}
              className={isMobile ? "h-9 w-9 p-0" : "mr-2"}
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

            {isMobile && !zenMode && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden ml-1">
                    <Menu className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[300px]">
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
                      className="w-full flex items-center gap-1 justify-center py-6"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span className="text-base">New Log</span>
                    </Button>
                    <div className="flex items-center justify-between w-full mt-4 border-t pt-4">
                      <span className="text-base font-medium">Zen Mode</span>
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
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
        
        {!zenMode && (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:block flex-1 my-2">
              <Tabs 
                value={activeTab} 
                onValueChange={(v) => onTabChange(v as ActiveTab)} 
                className="w-full flex justify-center"
              >
                {renderTabContent()}
              </Tabs>
            </div>
            
            {/* Mobile Drawer Navigation - more touchscreen friendly for mobile */}
            {isMobile && renderMobileNavigation()}
          </>
        )}
      </div>
    </header>
  );
}
