
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, PanelRight, Home, LineChart, ListTodo, FileText, Layers, BookOpen, FileArchive, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Drawer } from "vaul";
import { useResponsive } from "@/hooks/use-mobile";

export type ActiveTab = "dashboard" | "logs" | "goals" | "templates" | "analytics" | "applications";

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onCreateLog: () => void;
  zenMode: boolean;
  onZenModeChange: (enabled: boolean) => void;
}

const tabsConfig = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "logs", label: "Logs", icon: FileText },
  { id: "goals", label: "Goals", icon: ListTodo },
  { id: "templates", label: "Templates", icon: Layers },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "applications", label: "Applications", icon: Briefcase }
];

export const Header = ({
  activeTab,
  onTabChange,
  onCreateLog,
  zenMode,
  onZenModeChange
}: HeaderProps) => {
  const { isMobile, isTablet } = useResponsive();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Initialize dark mode from localStorage or zen mode setting
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(storedDarkMode || zenMode);
    
    if (storedDarkMode || zenMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [zenMode]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  // Link zen mode to dark mode
  useEffect(() => {
    if (zenMode && !isDarkMode) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    }
  }, [zenMode, isDarkMode]);
  
  // Handle zen mode toggle
  const handleZenModeToggle = (enabled: boolean) => {
    onZenModeChange(enabled);
    if (enabled) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    }
  };

  const isDrawerNeeded = zenMode || activeTab === "logs";
  const HeaderContent = () => (
    <>
      <div className="flex items-center">
        <div className="mr-2 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="hidden lg:flex items-center space-x-1">
          <BookOpen className="h-5 w-5 mr-1 text-primary" />
          <h1 className="text-lg font-bold">CodeGrowth</h1>
        </div>
        
        <div className="hidden lg:flex ml-6 space-x-1 transition-all">
          {tabsConfig.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.id as ActiveTab)}
              className="transition-colors"
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="hidden md:flex items-center space-x-2 mr-2">
          <div className="text-sm">
            {isDarkMode ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </div>
          <Switch 
            checked={isDarkMode} 
            onCheckedChange={toggleDarkMode} 
            aria-label="Toggle dark mode"
          />
        </div>
        
        {!zenMode && (
          <div className="hidden sm:flex items-center space-x-2 mr-2">
            <div className="text-sm">Focus</div>
            <Switch 
              checked={zenMode} 
              onCheckedChange={handleZenModeToggle} 
              aria-label="Toggle zen mode" 
            />
          </div>
        )}
        
        <Button onClick={onCreateLog}>Add Log</Button>
      </div>
    </>
  );

  // Mobile menu implementation
  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="left" className="w-[240px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            CodeGrowth
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-1">
          {tabsConfig.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                onTabChange(tab.id as ActiveTab);
                setIsMobileMenuOpen(false);
              }}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-col gap-4 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 mr-2" />
                ) : (
                  <Sun className="h-4 w-4 mr-2" />
                )}
                <span className="text-sm">Dark Mode</span>
              </div>
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={toggleDarkMode} 
                aria-label="Toggle dark mode"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <PanelRight className="h-4 w-4 mr-2" />
                <span className="text-sm">Focus Mode</span>
              </div>
              <Switch 
                checked={zenMode} 
                onCheckedChange={handleZenModeToggle} 
                aria-label="Toggle zen mode"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Render Drawer for Zen Mode or Mobile
  if (isDrawerNeeded && isMobile) {
    return (
      <>
        <Drawer.Root>
          <div className="fixed top-0 left-0 right-0 z-50 transition-all bg-background">
            <header className={`flex justify-between items-center h-14 px-4 border-b`}>
              <HeaderContent />
            </header>
          </div>
          <MobileMenu />
        </Drawer.Root>
      </>
    );
  }

  // Render normal header
  return (
    <>
      <div className="sticky top-0 z-50 transition-all bg-background">
        <header className={`flex justify-between items-center h-14 px-4 border-b`}>
          <HeaderContent />
        </header>
      </div>
      <MobileMenu />
    </>
  );
};
