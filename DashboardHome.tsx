import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Heart,
  MessageSquare,
  TrendingUp,
  Award,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import { supabaseApi } from '../../utils/supabase/client';
import { useAuth } from '../../App';
import { NavigationItem } from '../dashboard/Dashboard';

interface DashboardHomeProps {
  onNavigate?: (section: NavigationItem) => void;
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    totalAlumni: 0,
    activeJobs: 0,
    upcomingEvents: 0,
    totalDonations: 0,
    activeMentorships: 0,
    unreadMessages: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real stats from Supabase
      const { data: statsData, error: statsError } = await supabaseApi.getDashboardStats();
      
      if (statsData) {
        // If database is empty, show some demo numbers
        const demoStats = {
          totalAlumni: statsData.totalAlumni || 1247,
          activeJobs: statsData.activeJobs || 23,
          upcomingEvents: statsData.upcomingEvents || 8,
          totalDonations: statsData.totalDonations || 125000,
          activeMentorships: statsData.activeMentorships || 45,
          unreadMessages: statsData.unreadMessages || 3
        };
        setStats(demoStats);
      }

      // Fetch recent events for upcoming events
      const { data: eventsData, error: eventsError } = await supabaseApi.getEvents({
        date: new Date().toISOString().split('T')[0]
      });

      if (eventsData && eventsData.length > 0) {
        setUpcomingEvents(eventsData.slice(0, 3).map(event => ({
          title: event.title,
          location: event.location,
          date: new Date(event.date).toLocaleDateString(),
          type: event.type
        })));
      } else {
        // Fallback to demo events
        setUpcomingEvents([
          {
            title: "Alumni Networking Mixer",
            location: "San Francisco",
            date: "February 15, 2024",
            type: "Networking"
          },
          {
            title: "Career Development Workshop",
            location: "Virtual",
            date: "February 20, 2024", 
            type: "Workshop"
          },
          {
            title: "Tech Industry Panel",
            location: "Seattle",
            date: "February 25, 2024",
            type: "Panel"
          }
        ]);
      }

      // Mock recent activity for now (could be implemented with audit logs)
      setRecentActivity([
        {
          user: "Sarah Johnson",
          message: "Posted a new job opportunity at Tech Corp",
          time: "2 hours ago"
        },
        {
          user: "Michael Chen", 
          message: "Started mentoring a new alumni",
          time: "4 hours ago"
        },
        {
          user: "Emily Rodriguez",
          message: "Created a networking event for next month",
          time: "1 day ago"
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to demo data
      setStats({
        totalAlumni: 1247,
        activeJobs: 23,
        upcomingEvents: 8,
        totalDonations: 125000,
        activeMentorships: 45,
        unreadMessages: 3
      });
      
      setUpcomingEvents([
        {
          title: "Alumni Networking Mixer",
          location: "San Francisco",
          date: "February 15, 2024",
          type: "Networking"
        },
        {
          title: "Career Development Workshop",
          location: "Virtual",
          date: "February 20, 2024", 
          type: "Workshop"
        }
      ]);
      
      setRecentActivity([
        {
          user: "Demo User",
          message: "Welcome to Legatix! Connect with fellow alumni.",
          time: "Just now"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      label: 'Find Mentors', 
      icon: Users, 
      action: () => onNavigate?.('mentorship'), 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Browse Jobs', 
      icon: Briefcase, 
      action: () => onNavigate?.('jobs'), 
      color: 'bg-green-500' 
    },
    { 
      label: 'View Events', 
      icon: Calendar, 
      action: () => onNavigate?.('events'), 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Make Donation', 
      icon: Heart, 
      action: () => onNavigate?.('donations'), 
      color: 'bg-red-500' 
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-2">Welcome to Legatix Alumni Network</h2>
        <p className="text-muted-foreground">
          Connect with fellow alumni, discover opportunities, and give back to your community.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Alumni</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalAlumni.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Active Jobs</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.activeJobs}</p>
              </div>
              <Briefcase className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Events</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.upcomingEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">Donations</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">${stats.totalDonations.toLocaleString()}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Mentorships</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.activeMentorships}</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-600 dark:text-teal-400">Messages</p>
                <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{stats.unreadMessages}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:shadow-md transition-shadow"
                  onClick={action.action}
                >
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity: any, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {activity.user?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground">Start connecting with alumni to see updates here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event: any, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant="secondary">{event.type}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming events</p>
                  <p className="text-sm text-muted-foreground">Check back later for new events</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Network Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Profile Completion</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Network Connections</span>
                <span>42/100</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Mentorship Participation</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}