import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useAuth } from '../../App';
import { supabaseApi } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import { 
  User, 
  MapPin, 
  Calendar as CalendarIcon,
  Clock,
  Star,
  MessageCircle,
  Video,
  Coffee,
  FileText,
  Building,
  GraduationCap,
  Send,
  CheckCircle,
  XCircle,
  Clock3
} from 'lucide-react';
import { NavigationItem } from '../dashboard/Dashboard';

interface MentorshipDetailsProps {
  onNavigate: (section: NavigationItem) => void;
}

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  skills: string[];
  graduation_year: number;
  avatar_url?: string;
  is_available_for_mentoring: boolean;
  rating?: number;
  total_mentorships?: number;
}

export function MentorshipDetails({ onNavigate }: MentorshipDetailsProps) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    topic: '',
    type: 'video' as 'video' | 'coffee' | 'project',
    duration: 60,
    requested_date: new Date(),
    description: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load mentors
      const { data: mentorData } = await supabaseApi.getMentors();
      if (mentorData) {
        // Add sample rating and mentorship data
        const mentorsWithStats = mentorData.map(mentor => ({
          ...mentor,
          rating: 4.5 + Math.random() * 0.5,
          total_mentorships: Math.floor(Math.random() * 50) + 5
        }));
        setMentors(mentorsWithStats);
      } else {
        // Fallback sample data
        setMentors([
          {
            id: 'mentor-1',
            name: 'Sarah Johnson',
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            bio: 'Passionate about mentoring junior developers and helping them grow their careers in tech.',
            skills: ['JavaScript', 'React', 'Node.js', 'Career Development'],
            graduation_year: 2018,
            avatar_url: null,
            is_available_for_mentoring: true,
            rating: 4.8,
            total_mentorships: 23
          },
          {
            id: 'mentor-2',
            name: 'Michael Chen',
            title: 'Product Manager',
            company: 'Innovation Inc',
            location: 'New York, NY',
            bio: 'Helping product professionals transition into leadership roles and build successful products.',
            skills: ['Product Management', 'Strategy', 'Leadership', 'Analytics'],
            graduation_year: 2016,
            avatar_url: null,
            is_available_for_mentoring: true,
            rating: 4.6,
            total_mentorships: 31
          }
        ]);
      }

      // Load my mentorship requests
      if (user) {
        const { data: requestData } = await supabaseApi.getMentorshipRequests(user.id);
        if (requestData) {
          setMyRequests(requestData);
        }
      }
    } catch (error) {
      console.error('Error loading mentorship data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async () => {
    if (!user || !selectedMentor) return;

    try {
      const request = {
        mentor_id: selectedMentor.id,
        mentee_id: user.id,
        topic: requestForm.topic,
        type: requestForm.type,
        duration: requestForm.duration,
        requested_date: requestForm.requested_date.toISOString(),
        description: requestForm.description
      };

      const { error } = await supabaseApi.createMentorshipRequest(request);
      if (error) {
        toast.error('Failed to send mentorship request');
      } else {
        toast.success('Mentorship request sent successfully!');
        setRequestDialogOpen(false);
        setRequestForm({
          topic: '',
          type: 'video',
          duration: 60,
          requested_date: new Date(),
          description: ''
        });
        loadData(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to send mentorship request');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock3 className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
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
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
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
          <h1>Mentorship Hub</h1>
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
        <h1>Mentorship Hub</h1>
      </div>

      <Tabs defaultValue="find-mentors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="find-mentors">
            Find Mentors ({mentors.length})
          </TabsTrigger>
          <TabsTrigger value="my-requests">
            My Requests ({myRequests.length})
          </TabsTrigger>
          <TabsTrigger value="become-mentor">
            Become a Mentor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="find-mentors" className="space-y-4">
          {mentors.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No Mentors Available</h3>
                <p className="text-muted-foreground">
                  Check back later for available mentors.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={mentor.avatar_url} />
                            <AvatarFallback>
                              {mentor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{mentor.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {mentor.title}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{mentor.rating?.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {mentor.total_mentorships} mentorships
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4" />
                          {mentor.company}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {mentor.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                          Class of {mentor.graduation_year}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {mentor.bio}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {mentor.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {mentor.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{mentor.skills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Dialog 
                          open={requestDialogOpen && selectedMentor?.id === mentor.id} 
                          onOpenChange={(open) => {
                            setRequestDialogOpen(open);
                            if (open) setSelectedMentor(mentor);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button className="flex-1">
                              <Send className="h-4 w-4 mr-2" />
                              Request Mentorship
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Request Mentorship from {mentor.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="topic">Topic</Label>
                                <Input
                                  id="topic"
                                  value={requestForm.topic}
                                  onChange={(e) => setRequestForm(prev => ({ ...prev, topic: e.target.value }))}
                                  placeholder="e.g., Career transition to product management"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Meeting Type</Label>
                                <Select
                                  value={requestForm.type}
                                  onValueChange={(value: 'video' | 'coffee' | 'project') => 
                                    setRequestForm(prev => ({ ...prev, type: value }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="video">
                                      <div className="flex items-center gap-2">
                                        <Video className="h-4 w-4" />
                                        Video Call
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="coffee">
                                      <div className="flex items-center gap-2">
                                        <Coffee className="h-4 w-4" />
                                        Coffee Chat
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="project">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Project Review
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Duration (minutes)</Label>
                                <Select
                                  value={requestForm.duration.toString()}
                                  onValueChange={(value) => 
                                    setRequestForm(prev => ({ ...prev, duration: parseInt(value) }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="60">1 hour</SelectItem>
                                    <SelectItem value="90">1.5 hours</SelectItem>
                                    <SelectItem value="120">2 hours</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Preferred Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                      <CalendarIcon className="h-4 w-4 mr-2" />
                                      {requestForm.requested_date.toLocaleDateString()}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={requestForm.requested_date}
                                      onSelect={(date) => date && setRequestForm(prev => ({ ...prev, requested_date: date }))}
                                      disabled={(date) => date < new Date()}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="description">Additional Details</Label>
                                <Textarea
                                  id="description"
                                  value={requestForm.description}
                                  onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="Tell your mentor what you'd like to discuss..."
                                  rows={3}
                                />
                              </div>

                              <Button onClick={handleRequestMentorship} className="w-full">
                                Send Request
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-requests" className="space-y-4">
          {myRequests.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No Mentorship Requests</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any mentorship requests yet.
                </p>
                <Button onClick={() => onNavigate('mentorship')}>
                  Find Mentors
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={request.mentor?.avatar_url} />
                            <AvatarFallback>
                              {request.mentor?.name?.split(' ').map((n: string) => n[0]).join('') || 'M'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{request.mentor?.name || 'Mentor'}</h3>
                            <p className="text-sm text-muted-foreground">
                              {request.mentor?.title} at {request.mentor?.company}
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
                            <CalendarIcon className="h-4 w-4" />
                            Requested for {new Date(request.requested_date).toLocaleDateString()}
                          </div>

                          {request.description && (
                            <p className="text-sm text-muted-foreground">
                              {request.description}
                            </p>
                          )}
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
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="become-mentor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Become a Mentor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Share your experience and help fellow alumni grow their careers. 
                As a mentor, you can make a meaningful impact while building valuable 
                connections within the alumni network.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Benefits of Mentoring</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Give back to the alumni community</li>
                    <li>• Develop leadership and coaching skills</li>
                    <li>• Expand your professional network</li>
                    <li>• Gain fresh perspectives from mentees</li>
                    <li>• Recognition in the alumni network</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Requirements</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 3+ years of professional experience</li>
                    <li>• Complete mentor training program</li>
                    <li>• Commit to at least 2 hours per month</li>
                    <li>• Maintain professional communication</li>
                    <li>• Provide regular feedback to mentees</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={() => onNavigate('profile')}>
                  Update Profile to Mentor
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}