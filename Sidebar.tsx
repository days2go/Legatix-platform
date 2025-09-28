import React from 'react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { NavigationItem } from './Dashboard';
import { 
  Home,
  Users,
  MessageCircle,
  Briefcase,
  Calendar,
  Heart,
  MessageSquare,
  User,
  GraduationCap,
  Settings,
  LogOut,
  FileText
} from 'lucide-react';
import { useAuth } from '../../App';

interface SidebarProps {
  activeSection: NavigationItem;
  onSectionChange: (section: NavigationItem) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getNavigationItems = (userType: 'student' | 'alumni' | null) => {
  const baseItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'alumni', label: userType === 'student' ? 'Alumni Directory' : 'Network', icon: Users },
    { id: 'mentorship', label: 'Mentorship Hub', icon: MessageCircle },
    { id: 'jobs', label: userType === 'student' ? 'Opportunities' : 'Job Board', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Add different items based on user type
  if (userType === 'student') {
    baseItems.splice(6, 0, { id: 'applications', label: 'My Applications', icon: FileText });
  } else if (userType === 'alumni') {
    baseItems.splice(6, 0, { id: 'donations', label: 'Give Back', icon: Heart });
    baseItems.splice(7, 0, { id: 'applications', label: 'Applications', icon: FileText });
  }

  return baseItems;
};

export function Sidebar({ activeSection, onSectionChange, open, onOpenChange }: SidebarProps) {
  const { logout, profile } = useAuth();
  const navigationItems = getNavigationItems(profile?.user_type || null);

  return (
    <div className={cn(
      "relative flex flex-col bg-card border-r transition-all duration-300",
      open ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary flex-shrink-0" />
          {open && (
            <div>
              <h2 className="font-bold text-lg">Legatix</h2>
              <p className="text-xs text-muted-foreground">Alumni Network</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  !open && "justify-center px-2"
                )}
                onClick={() => onSectionChange(item.id as NavigationItem)}
              >
                <Icon className={cn("h-4 w-4", open && "mr-2")} />
                {open && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <Separator className="mb-3" />
        
        <div className="space-y-2">
          <Button
            variant={activeSection === 'settings' ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              !open && "justify-center px-2"
            )}
            onClick={() => onSectionChange('settings')}
          >
            <Settings className={cn("h-4 w-4", open && "mr-2")} />
            {open && <span>Settings</span>}
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950",
              !open && "justify-center px-2"
            )}
            onClick={logout}
          >
            <LogOut className={cn("h-4 w-4", open && "mr-2")} />
            {open && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}