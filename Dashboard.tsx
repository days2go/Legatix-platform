import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AlumniDirectory } from '../features/AlumniDirectory';
import { MentorshipHub } from '../features/MentorshipHub';
import { JobBoard } from '../features/JobBoard';
import { EventsCalendar } from '../features/EventsCalendar';
import { Donations } from '../features/Donations';
import { ChatSystem } from '../features/ChatSystem';
import { ProfilePage } from '../features/ProfilePage';
import { DashboardHome } from '../features/DashboardHome';
import { ApplicationsPage } from '../features/ApplicationsPage';
import { SettingsPage } from '../features/SettingsPage';
import { MentorshipDetails } from '../features/MentorshipDetails';

export type NavigationItem = 
  | 'home' 
  | 'alumni' 
  | 'mentorship' 
  | 'mentorship-details'
  | 'jobs' 
  | 'events' 
  | 'donations' 
  | 'chat' 
  | 'profile'
  | 'applications'
  | 'settings';

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<NavigationItem>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Function to handle navigation from child components
  const handleNavigate = (section: NavigationItem) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardHome onNavigate={handleNavigate} />;
      case 'alumni':
        return <AlumniDirectory onNavigate={handleNavigate} />;
      case 'mentorship':
        return <MentorshipHub onNavigate={handleNavigate} />;
      case 'mentorship-details':
        return <MentorshipDetails onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobBoard onNavigate={handleNavigate} />;
      case 'events':
        return <EventsCalendar onNavigate={handleNavigate} />;
      case 'donations':
        return <Donations onNavigate={handleNavigate} />;
      case 'chat':
        return <ChatSystem onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'applications':
        return <ApplicationsPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      default:
        return <DashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          activeSection={activeSection}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}