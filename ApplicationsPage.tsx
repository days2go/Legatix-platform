import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../App';
import { supabaseApi } from '../../utils/supabase/client';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Clock3,
  FileText
} from 'lucide-react';
import { NavigationItem } from '../dashboard/Dashboard';

interface ApplicationsPageProps {
  onNavigate: (section: NavigationItem) => void;
}

interface JobApplication {
  id: string;
  job_id: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  applied_at: string;
  job: {
    title: string;
    company: string;
    location: string;
    type: string;
    salary_min?: number;
    salary_max?: number;
  };
}

interface MentorshipApplication {
  id: string;
  mentor_id: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  topic: string;
  type: string;
  requested_date: string;
  mentor: {
    name: string;
    title: string;
    company: string;
    avatar_url?: string;
  };
}

export function ApplicationsPage({ onNavigate }: ApplicationsPageProps) {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [mentorshipApplications, setMentorshipApplications] = useState<MentorshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load mentorship requests
      const { data: mentorshipData } = await supabaseApi.getMentorshipRequests(user.id);
      if (mentorshipData) {
        setMentorshipApplications(mentorshipData);
      }
      
      // For job applications, we'll use sample data since we don't have a job_applications table yet
      setJobApplications([
        {
          id: '1',
          job_id: 'job-1',
          status: 'pending',
          applied_at: '2024-01-15T00:00:00Z',
          job: {
            title: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            type: 'full-time',
            salary_min: 120000,
            salary_max: 180000
          }
        },
        {
          id: '2',
          job_id: 'job-2',
          status: 'interview',
          applied_at: '2024-01-10T00:00:00Z',
          job: {
            title: 'Product Manager',
            company: 'Innovation Labs',
            location: 'New York, NY',
            type: 'full-time',
            salary_min: 130000,
            salary_max: 190000
          }
        }
      ]);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock3 className="h-4 w-4 text-yellow-500" />;
      case 'approved':
      case 'interview':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'completed':
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved':
      case 'interview':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1>My Applications</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>My Applications</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('jobs')}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Browse Jobs
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('mentorship')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Find Mentors
          </Button>
        </div>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">
            Job Applications ({jobApplications.length})
          </TabsTrigger>
          <TabsTrigger value="mentorship">
            Mentorship Requests ({mentorshipApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          {jobApplications.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No Job Applications Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start applying to jobs to see your applications here.
                </p>
                <Button onClick={() => onNavigate('jobs')}>
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-medium">{application.job.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {application.job.company}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {application.job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {application.job.type}
                          </div>
                          {application.job.salary_min && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${application.job.salary_min.toLocaleString()} - ${application.job.salary_max?.toLocaleString()}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Applied {new Date(application.applied_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <Badge 
                          variant="secondary" 
                          className={getStatusColor(application.status)}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </div>
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-4">
          {mentorshipApplications.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No Mentorship Requests Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with mentors to grow your career and skills.
                </p>
                <Button onClick={() => onNavigate('mentorship')}>
                  Find Mentors
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mentorshipApplications.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={request.mentor.avatar_url} />
                            <AvatarFallback>
                              {request.mentor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{request.mentor.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {request.mentor.title} at {request.mentor.company}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {request.topic}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {request.type}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Requested for {new Date(request.requested_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <Badge 
                          variant="secondary" 
                          className={getStatusColor(request.status)}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </div>
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}