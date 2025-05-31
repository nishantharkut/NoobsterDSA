
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth/AuthProvider';
import { Code2, User, Settings, LogOut, Trophy } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentSection }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Code2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold">DSA Tracker</h1>
          </div>
          
          <nav className="hidden md:flex space-x-4">
            <Button
              variant={currentSection === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant={currentSection === 'practice' ? 'default' : 'ghost'}
              onClick={() => onNavigate('practice')}
            >
              Practice
            </Button>
            <Button
              variant={currentSection === 'progress' ? 'default' : 'ghost'}
              onClick={() => onNavigate('progress')}
            >
              Progress
            </Button>
            <Button
              variant={currentSection === 'learning' ? 'default' : 'ghost'}
              onClick={() => onNavigate('learning')}
            >
              Learn
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{user.profile.streak} day streak</span>
          </div>
          
          <Badge variant="secondary">
            {user.profile.level}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate('profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
