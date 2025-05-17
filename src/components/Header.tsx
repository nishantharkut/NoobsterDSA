
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
  X
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
        <TrendingUpIcon className="h-4 w-4" />
        <span>Dashboard</span>
      </TabsTrigger>
      <TabsTrigger 
        value="logs" 
        className={`flex gap-1 items-center justify-start ${orientation === "vertical" ? "px-3 py-2" : "mt-0"}`}
        onClick={() => handleTabChange("logs")}
      >
        <ListIcon className="h-4 w-4" />
        <span>Logs</span>
      </TabsTrigger>
      <TabsTrigger 
        value="goals" 
        className={`flex gap-1 items-center justify-start ${orientation === "vertical" ? "px-3 py-2" : "mt-0"}`}
        onClick={() => handleTabChange("goals")}
      >
        <Flag className="h-4 w-4" />
        <span>Weekly Goals</span>
      </TabsTrigger>
      <TabsTrigger 
        value="templates" 
        className={`flex gap-1 items-center justify-start ${orientation === "vertical" ? "px-3 py-2" : "mt-0"}`}
        onClick={() => handleTabChange("templates")}
      >
        <CalendarIcon className="h-4 w-4" />
        <span>Templates</span>
      </TabsTrigger>
      <TabsTrigger 
        value="analytics" 
        className={`flex gap-1 items-center justify-start ${orientation === "vertical" ? "px-3 py-2" : "mt-0"}`}
        onClick={() => handleTabChange("analytics")}
      >
        <LayoutGrid className="h-4 w-4" />
        <span>Analytics</span>
      </TabsTrigger>
    </TabsList>
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
            
            {/* Mobile Navigation */}
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
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full mt-2">
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
