import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Star,
  Clock,
  Video,
  Coffee,
  BookOpen,
  Award,
  Plus,
  Search
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { sampleData, withDelay } from '../../utils/sampleData';

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  bio: string;
  rating: number;
  totalSessions: number;
  profileImage?: string;
  availability: string;
  experienceYears: number;
}

interface MentorshipRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  topic: string;
  type: 'video' | 'coffee' | 'project';
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  requestedDate: string;
  duration: number;
  description: string;
}

import { NavigationItem } from '../dashboard/Dashboard';

interface MentorshipHubProps {
  onNavigate?: (section: NavigationItem) => void;
}

export function MentorshipHub({ onNavigate }: MentorshipHubProps) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  useEffect(() => {
    fetchMentorshipData();
  }, []);

  const fetchMentorshipData = async () => {
    try {
      // Use sample data with simulated loading
      const mentors = await withDelay(sampleData.mentors, 300);
      const requests = await withDelay([
        {
          id: '1',
          mentorId: '1',
          mentorName: 'Sarah Johnson',
          topic: 'Career transition to senior role',
          type: 'video' as const,
          status: 'approved' as const,
          requestedDate: '2024-02-15',
          duration: 60,
          description: 'Looking for guidance on transitioning to a senior engineering role.'
        },
        {
          id: '2',
          mentorId: '2',
          mentorName: 'Michael Chen',
          topic: 'Product roadmap planning',
          type: 'coffee' as const,
          status: 'pending' as const,
          requestedDate: '2024-02-20',
          duration: 45,
          description: 'Need help with strategic product planning.'
        }
      ], 100);
      
      setMentors(mentors);
      setRequests(requests);
    } catch (error) {
      // Fallback to direct sample data
      setMentors(sampleData.mentors);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesExpertise = selectedExpertise === 'all' || mentor.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  const handleRequestMentorship = async (mentorId: string, requestData: any) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94ca4259/mentorship/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ mentorId, ...requestData }),
      });

      if (response.ok) {
        toast.success('Mentorship request sent successfully!');
        setIsRequestDialogOpen(false);
        fetchMentorshipData();
      } else {
        toast.error('Failed to send mentorship request');
      }
    } catch (error) {
      console.error('Error sending mentorship request:', error);
      toast.error('Failed to send mentorship request');
    }
  };

  const getUniqueExpertise = () => {
    return [...new Set(mentors.flatMap(mentor => mentor.expertise))].sort();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'coffee': return <Coffee className="h-4 w-4" />;
      case 'project': return <BookOpen className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Mentorship Hub</h2>
          <p className="text-muted-foreground">
            Connect with experienced alumni for guidance and support
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Become a Mentor</span>
        </Button>
      </div>

      <Tabs defaultValue="find-mentors" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="find-mentors">Find Mentors</TabsTrigger>
          <TabsTrigger value="my-sessions">My Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="find-mentors" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search mentors by name or expertise..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Expertise</SelectItem>
                    {getUniqueExpertise().map(expertise => (
                      <SelectItem key={expertise} value={expertise}>{expertise}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mentor.profileImage} alt={mentor.name} />
                      <AvatarFallback className="text-lg">
                        {getInitials(mentor.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground">{mentor.role}</p>
                      <p className="text-sm text-muted-foreground">{mentor.company}</p>
                      
                      <div className="flex items-center mt-2 space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{mentor.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({mentor.totalSessions} sessions)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {mentor.bio}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {mentor.availability}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedMentor(mentor)}>
                          Request Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Request Mentorship Session</DialogTitle>
                        </DialogHeader>
                        
                        <MentorshipRequestForm 
                          mentor={mentor}
                          onSubmit={(data) => handleRequestMentorship(mentor.id, data)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No mentors found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-sessions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(request.type)}
                      <h3 className="font-medium">{request.topic}</h3>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Mentor:</span> {request.mentorName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {new Date(request.requestedDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Duration:</span> {request.duration} minutes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.description}
                    </p>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    {request.status === 'approved' && (
                      <Button size="sm" className="flex-1">
                        <Video className="h-3 w-3 mr-1" />
                        Join Session
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {requests.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No sessions yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by requesting a mentorship session
              </p>
              <Button>Find Mentors</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MentorshipRequestForm({ mentor, onSubmit }: { mentor: Mentor; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    topic: '',
    type: 'video',
    requestedDate: '',
    duration: 60,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
        <Avatar className="h-10 w-10">
          <AvatarImage src={mentor.profileImage} alt={mentor.name} />
          <AvatarFallback>
            {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{mentor.name}</h4>
          <p className="text-sm text-muted-foreground">{mentor.role}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">Session Topic</Label>
        <Input
          id="topic"
          placeholder="What would you like to discuss?"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Session Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video Call</SelectItem>
            <SelectItem value="coffee">Coffee Chat</SelectItem>
            <SelectItem value="project">Project Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Preferred Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.requestedDate}
            onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Select value={formData.duration.toString()} onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide more details about what you'd like to discuss..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        Send Request
      </Button>
    </form>
  );
}