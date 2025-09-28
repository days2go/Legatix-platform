import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  MessageCircle,
  Phone,
  Mail,
  Linkedin,
  Building2,
  Calendar
} from 'lucide-react';
import { supabaseApi } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface Alumni {
  id: string;
  name: string;
  email: string;
  graduation_year: number;
  degree: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  skills: string[];
  linkedin_url?: string;
  phone?: string;
  avatar_url?: string;
  is_available_for_mentoring: boolean;
  created_at: string;
}

import { NavigationItem } from '../dashboard/Dashboard';

interface AlumniDirectoryProps {
  onNavigate?: (section: NavigationItem) => void;
}

export function AlumniDirectory({ onNavigate }: AlumniDirectoryProps) {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    filterAlumni();
  }, [alumni, searchTerm, selectedYear, selectedIndustry, selectedSkill, sortBy]);

  const fetchAlumni = async () => {
    try {
      const filters = {
        search: searchTerm,
        graduationYear: selectedYear,
        // Note: We'll need to implement industry/skill filtering in the database query
      };

      const { data, error } = await supabaseApi.getAlumni(filters);
      
      if (error) {
        throw error;
      }
      
      setAlumni(data || []);
    } catch (error) {
      console.error('Error fetching alumni:', error);
      toast.error('Failed to load alumni directory');
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAlumni = () => {
    let filtered = [...alumni];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Year filter
    if (selectedYear) {
      filtered = filtered.filter(person => person.graduationYear.toString() === selectedYear);
    }

    // Industry filter
    if (selectedIndustry) {
      filtered = filtered.filter(person => person.industries.includes(selectedIndustry));
    }

    // Skill filter
    if (selectedSkill) {
      filtered = filtered.filter(person => person.skills.includes(selectedSkill));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'year':
          return b.graduationYear - a.graduationYear;
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    setFilteredAlumni(filtered);
  };

  const getUniqueYears = () => {
    return [...new Set(alumni.map(person => person.graduation_year?.toString()).filter(Boolean))].sort().reverse();
  };

  const getUniqueIndustries = () => {
    // For now, return common industries - could be enhanced with a separate industries table
    return ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Consulting'];
  };

  const getUniqueSkills = () => {
    return [...new Set(alumni.flatMap(person => person.skills || []))].sort();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedYear('');
    setSelectedIndustry('');
    setSelectedSkill('');
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
          <h2 className="text-2xl font-bold">Alumni Directory</h2>
          <p className="text-muted-foreground">
            Connect with {alumni.length} alumni from your network
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4" />
          <span>Message All</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alumni..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Graduation Year" />
              </SelectTrigger>
              <SelectContent>
                {getUniqueYears().map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {getUniqueIndustries().map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Skills" />
              </SelectTrigger>
              <SelectContent>
                {getUniqueSkills().map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="year">Sort by Year</SelectItem>
                  <SelectItem value="company">Sort by Company</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredAlumni.length} of {alumni.length} alumni
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((person) => (
          <Card key={person.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={person.avatar_url} alt={person.name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(person.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{person.name}</h3>
                      <p className="text-sm text-muted-foreground">{person.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Building2 className="h-3 w-3 mr-1" />
                        {person.company}
                      </p>
                    </div>
                    {person.is_available_for_mentoring && (
                      <Badge variant="secondary" className="text-xs">
                        Mentor
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {person.location}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {person.degree} • Class of {person.graduation_year}
                    </p>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {person.bio}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {person.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {person.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{person.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Contact {person.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={person.avatar_url} alt={person.name} />
                              <AvatarFallback>
                                {getInitials(person.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{person.name}</h4>
                              <p className="text-sm text-muted-foreground">{person.title} at {person.company}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Button className="w-full justify-start" variant="outline">
                              <Mail className="h-4 w-4 mr-2" />
                              {person.email}
                            </Button>
                            
                            {person.phone && (
                              <Button className="w-full justify-start" variant="outline">
                                <Phone className="h-4 w-4 mr-2" />
                                {person.phone}
                              </Button>
                            )}
                            
                            {person.linkedin_url && (
                              <Button className="w-full justify-start" variant="outline">
                                <Linkedin className="h-4 w-4 mr-2" />
                                LinkedIn Profile
                              </Button>
                            )}
                            
                            <Button className="w-full">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Send Message
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button size="sm" variant="default">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No alumni found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}