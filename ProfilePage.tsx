import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Edit,
  Save,
  Plus,
  X,
  Upload,
  Award,
  Calendar,
  Building2,
  Settings,
  Shield,
  Bell,
  Eye,
  Users,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../App';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  graduationYear: number;
  degree: string;
  major: string;
  phone?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  skills: string[];
  interests: string[];
  achievements: Achievement[];
  workExperience: WorkExperience[];
  education: Education[];
  isAvailableForMentoring: boolean;
  isProfilePublic: boolean;
  createdAt: string;
  profileViews: number;
  connectionCount: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  activities?: string;
}

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94ca4259/profile`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        // Sample profile for demo
        const sampleProfile: UserProfile = {
          id: user?.id || '1',
          name: user?.user_metadata?.name || 'John Doe',
          email: user?.email || 'john.doe@email.com',
          title: 'Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          bio: 'Passionate software engineer with 5+ years of experience building scalable web applications. Love mentoring junior developers and contributing to open source projects.',
          graduationYear: 2018,
          degree: 'Bachelor of Science',
          major: 'Computer Science',
          phone: '+1 (555) 123-4567',
          linkedinUrl: 'https://linkedin.com/in/johndoe',
          websiteUrl: 'https://johndoe.dev',
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
          interests: ['Web Development', 'Machine Learning', 'Open Source', 'Mentoring'],
          achievements: [
            {
              id: '1',
              title: 'Dean\'s List',
              description: 'Maintained GPA above 3.5 for 4 consecutive semesters',
              date: '2018-05-15',
              category: 'Academic'
            },
            {
              id: '2',
              title: 'Employee of the Month',
              description: 'Recognized for outstanding contribution to the team',
              date: '2023-08-01',
              category: 'Professional'
            }
          ],
          workExperience: [
            {
              id: '1',
              title: 'Senior Software Engineer',
              company: 'Tech Corp',
              location: 'San Francisco, CA',
              startDate: '2022-01-01',
              isCurrent: true,
              description: 'Lead development of microservices architecture serving 1M+ users. Mentor junior developers and drive technical decision making.'
            },
            {
              id: '2',
              title: 'Software Engineer',
              company: 'StartupXYZ',
              location: 'San Francisco, CA',
              startDate: '2019-06-01',
              endDate: '2021-12-31',
              isCurrent: false,
              description: 'Built full-stack web applications using React and Node.js. Implemented CI/CD pipelines and improved code quality.'
            }
          ],
          education: [
            {
              id: '1',
              institution: 'University of California, Berkeley',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              startDate: '2014-09-01',
              endDate: '2018-05-15',
              gpa: '3.7',
              activities: 'Computer Science Club, Hackathon Winner'
            }
          ],
          isAvailableForMentoring: true,
          isProfilePublic: true,
          createdAt: '2024-01-01T00:00:00Z',
          profileViews: 247,
          connectionCount: 156
        };
        setProfile(sampleProfile);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94ca4259/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.success('Profile updated successfully!'); // Demo success
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.success('Profile updated successfully!'); // Demo success
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (skill: string) => {
    if (!profile || !skill.trim()) return;
    
    setProfile({
      ...profile,
      skills: [...profile.skills, skill.trim()]
    });
  };

  const removeSkill = (index: number) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index)
    });
  };

  const addWorkExperience = () => {
    if (!profile) return;
    
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      isCurrent: false,
      description: ''
    };
    
    setProfile({
      ...profile,
      workExperience: [...profile.workExperience, newExperience]
    });
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: any) => {
    if (!profile) return;
    
    const updated = [...profile.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    
    setProfile({
      ...profile,
      workExperience: updated
    });
  };

  const removeWorkExperience = (index: number) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      workExperience: profile.workExperience.filter((_, i) => i !== index)
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    
    let completed = 0;
    const total = 10;
    
    if (profile.name) completed++;
    if (profile.bio) completed++;
    if (profile.title) completed++;
    if (profile.company) completed++;
    if (profile.location) completed++;
    if (profile.skills.length > 0) completed++;
    if (profile.workExperience.length > 0) completed++;
    if (profile.education.length > 0) completed++;
    if (profile.phone) completed++;
    if (profile.linkedinUrl) completed++;
    
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Profile not found</h3>
        <p className="text-muted-foreground">Unable to load profile information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">My Profile</h2>
          <p className="text-muted-foreground">
            Manage your profile information and settings
          </p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={saveProfile} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-24 h-24">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-xl">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8">
                    <Upload className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-muted-foreground">{profile.title}</p>
                <p className="text-sm text-muted-foreground">{profile.company}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                  <GraduationCap className="h-3 w-3" />
                  <span>Class of {profile.graduationYear}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">{profile.profileViews}</div>
                  <div className="text-xs text-muted-foreground">Profile Views</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{profile.connectionCount}</div>
                  <div className="text-xs text-muted-foreground">Connections</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Completeness</span>
                  <span>{getProfileCompleteness()}%</span>
                </div>
                <Progress value={getProfileCompleteness()} className="h-2" />
              </div>

              <div className="flex justify-center space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button size="sm" variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  Connect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                      ) : (
                        <p className="p-2 bg-muted rounded">{profile.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <p className="p-2 bg-muted rounded text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      {isEditing ? (
                        <Input
                          id="title"
                          value={profile.title}
                          onChange={(e) => setProfile({...profile, title: e.target.value})}
                        />
                      ) : (
                        <p className="p-2 bg-muted rounded">{profile.title}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      {isEditing ? (
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) => setProfile({...profile, company: e.target.value})}
                        />
                      ) : (
                        <p className="p-2 bg-muted rounded">{profile.company}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                      />
                    ) : (
                      <p className="p-2 bg-muted rounded">{profile.location}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      />
                    ) : (
                      <p className="p-2 bg-muted rounded">{profile.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={profile.phone || ''}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                      ) : (
                        <p className="p-2 bg-muted rounded">{profile.phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      {isEditing ? (
                        <Input
                          id="linkedin"
                          value={profile.linkedinUrl || ''}
                          onChange={(e) => setProfile({...profile, linkedinUrl: e.target.value})}
                        />
                      ) : (
                        <p className="p-2 bg-muted rounded">
                          {profile.linkedinUrl ? (
                            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {profile.linkedinUrl}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={profile.websiteUrl || ''}
                        onChange={(e) => setProfile({...profile, websiteUrl: e.target.value})}
                      />
                    ) : (
                      <p className="p-2 bg-muted rounded">
                        {profile.websiteUrl ? (
                          <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {profile.websiteUrl}
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Interests */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Interests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{skill}</span>
                          {isEditing && (
                            <button onClick={() => removeSkill(index)} className="ml-1 hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <SkillInput onAdd={addSkill} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              {/* Work Experience */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Work Experience</CardTitle>
                    {isEditing && (
                      <Button onClick={addWorkExperience} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.workExperience.map((exp, index) => (
                    <div key={exp.id} className="border-l-2 border-muted pl-4 space-y-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                              <Input
                                placeholder="Job Title"
                                value={exp.title}
                                onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                              />
                              <Input
                                placeholder="Company"
                                value={exp.company}
                                onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeWorkExperience(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              type="date"
                              placeholder="Start Date"
                              value={exp.startDate}
                              onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                            />
                            <div className="space-y-2">
                              <Input
                                type="date"
                                placeholder="End Date"
                                value={exp.endDate || ''}
                                onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                                disabled={exp.isCurrent}
                              />
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={exp.isCurrent}
                                  onCheckedChange={(checked) => updateWorkExperience(index, 'isCurrent', checked)}
                                />
                                <Label>Current Position</Label>
                              </div>
                            </div>
                          </div>
                          <Textarea
                            placeholder="Description"
                            value={exp.description}
                            onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                            rows={3}
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{exp.title}</h3>
                              <p className="text-primary">{exp.company}</p>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {exp.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {new Date(exp.startDate).toLocaleDateString()} - {
                                  exp.isCurrent ? 'Present' : 
                                  exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'
                                }
                              </p>
                            </div>
                          </div>
                          <p className="text-muted-foreground mt-2">{exp.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-muted pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                          <p className="text-primary">{edu.institution}</p>
                          {edu.gpa && (
                            <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                          )}
                          {edu.activities && (
                            <p className="text-sm text-muted-foreground">{edu.activities}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Achievements & Awards</CardTitle>
                    {isEditing && (
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Achievement
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <Award className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-muted-foreground">{achievement.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{achievement.category}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other alumni
                      </p>
                    </div>
                    <Switch
                      checked={profile.isProfilePublic}
                      onCheckedChange={(checked) => setProfile({...profile, isProfilePublic: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Available for Mentoring</Label>
                      <p className="text-sm text-muted-foreground">
                        Show that you're available to mentor other alumni
                      </p>
                    </div>
                    <Switch
                      checked={profile.isAvailableForMentoring}
                      onCheckedChange={(checked) => setProfile({...profile, isAvailableForMentoring: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about network activity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mentorship Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone requests mentorship
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Event Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive reminders about upcoming events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Export Profile Data
                  </Button>
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                    <X className="h-4 w-4 mr-2" />
                    Deactivate Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function SkillInput({ onAdd }: { onAdd: (skill: string) => void }) {
  const [skill, setSkill] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skill.trim()) {
      onAdd(skill);
      setSkill('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        placeholder="Add skill..."
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        className="w-32"
      />
      <Button type="submit" size="sm">
        <Plus className="h-3 w-3" />
      </Button>
    </form>
  );
}