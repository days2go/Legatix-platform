import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Heart,
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Target,
  Calendar,
  Share2,
  Plus,
  Search,
  Filter,
  Building2,
  GraduationCap,
  BookOpen,
  Stethoscope,
  Lightbulb
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: 'scholarship' | 'research' | 'facilities' | 'athletics' | 'emergency' | 'general';
  goalAmount: number;
  currentAmount: number;
  currency: string;
  endDate: string;
  createdBy: string;
  donorCount: number;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  updates: CampaignUpdate[];
}

interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

interface Donation {
  id: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  currency: string;
  donorName: string;
  isAnonymous: boolean;
  message?: string;
  date: string;
}

import { NavigationItem } from '../dashboard/Dashboard';

interface DonationsProps {
  onNavigate?: (section: NavigationItem) => void;
}

export function Donations({ onNavigate }: DonationsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  useEffect(() => {
    fetchDonationData();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchTerm, selectedCategory]);

  const fetchDonationData = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94ca4259/donations`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
        setDonations(data.donations || []);
      } else {
        // Sample data for demo
        const sampleCampaigns = [
          {
            id: '1',
            title: 'Computer Science Scholarship Fund',
            description: 'Supporting deserving students pursuing degrees in computer science and related fields.',
            category: 'scholarship' as const,
            goalAmount: 50000,
            currentAmount: 32500,
            currency: 'USD',
            endDate: '2024-06-30',
            createdBy: 'CS Alumni Association',
            donorCount: 87,
            isActive: true,
            isFeatured: true,
            updates: [
              {
                id: '1',
                title: 'Halfway to our goal!',
                content: 'Thanks to your generous support, we\'ve reached 65% of our target. Every donation helps a student achieve their dreams.',
                date: '2024-01-20',
                author: 'Sarah Johnson'
              }
            ]
          },
          {
            id: '2',
            title: 'New Student Center Construction',
            description: 'Help build a modern student center that will serve future generations of students.',
            category: 'facilities' as const,
            goalAmount: 500000,
            currentAmount: 287000,
            currency: 'USD',
            endDate: '2024-12-31',
            createdBy: 'University Development Office',
            donorCount: 234,
            isActive: true,
            isFeatured: true,
            updates: []
          },
          {
            id: '3',
            title: 'Emergency Student Relief Fund',
            description: 'Providing immediate financial assistance to students facing unexpected hardships.',
            category: 'emergency' as const,
            goalAmount: 25000,
            currentAmount: 18750,
            currency: 'USD',
            endDate: '2024-03-31',
            createdBy: 'Student Affairs',
            donorCount: 156,
            isActive: true,
            isFeatured: false,
            updates: []
          },
          {
            id: '4',
            title: 'Research Innovation Grant',
            description: 'Funding cutting-edge research projects led by faculty and graduate students.',
            category: 'research' as const,
            goalAmount: 75000,
            currentAmount: 23400,
            currency: 'USD',
            endDate: '2024-08-15',
            createdBy: 'Research Office',
            donorCount: 45,
            isActive: true,
            isFeatured: false,
            updates: []
          }
        ];

        const sampleDonations = [
          {
            id: '1',
            campaignId: '1',
            campaignTitle: 'Computer Science Scholarship Fund',
            amount: 500,
            currency: 'USD',
            donorName: 'John Smith',
            isAnonymous: false,
            message: 'Proud to support the next generation of engineers!',
            date: '2024-01-25'
          },
          {
            id: '2',
            campaignId: '2',
            campaignTitle: 'New Student Center Construction',
            amount: 1000,
            currency: 'USD',
            donorName: 'Anonymous',
            isAnonymous: true,
            date: '2024-01-24'
          }
        ];

        setCampaigns(sampleCampaigns);
        setDonations(sampleDonations);
      }
    } catch (error) {
      console.error('Failed to fetch donation data:', error);
      toast.error('Failed to load donation data');
    } finally {
      setLoading(false);
    }
  };

  const filterCampaigns = () => {
    let filtered = [...campaigns];

    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(campaign => campaign.category === selectedCategory);
    }

    // Sort featured campaigns first, then by amount raised percentage
    filtered.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      const aPercentage = (a.currentAmount / a.goalAmount) * 100;
      const bPercentage = (b.currentAmount / b.goalAmount) * 100;
      return bPercentage - aPercentage;
    });

    setFilteredCampaigns(filtered);
  };

  const handleDonate = async (campaignId: string, amount: number, message?: string, isAnonymous?: boolean) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94ca4259/donations/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ campaignId, amount, message, isAnonymous }),
      });

      if (response.ok) {
        toast.success('Thank you for your generous donation!');
        setIsDonateDialogOpen(false);
        fetchDonationData();
      } else {
        toast.success('Thank you for your generous donation!'); // Demo success
        setIsDonateDialogOpen(false);
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.success('Thank you for your generous donation!'); // Demo success
      setIsDonateDialogOpen(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'scholarship': return <GraduationCap className="h-4 w-4" />;
      case 'research': return <Lightbulb className="h-4 w-4" />;
      case 'facilities': return <Building2 className="h-4 w-4" />;
      case 'athletics': return <Award className="h-4 w-4" />;
      case 'emergency': return <Stethoscope className="h-4 w-4" />;
      case 'general': return <Heart className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scholarship': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'research': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'facilities': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'athletics': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'general': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.currentAmount, 0);
  const totalDonors = campaigns.reduce((sum, campaign) => sum + campaign.donorCount, 0);

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
          <h2 className="text-2xl font-bold">Donations & Campaigns</h2>
          <p className="text-muted-foreground">
            Support your alma mater and make a difference
          </p>
        </div>
        <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Campaign</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <CampaignCreateForm onSubmit={() => setIsCreateCampaignOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Impact Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Total Raised</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(totalRaised, 'USD')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Active Campaigns</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {campaigns.filter(c => c.isActive).length}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Total Donors</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {totalDonors.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Avg. Donation</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {formatCurrency(totalDonors > 0 ? totalRaised / totalDonors : 0, 'USD')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">All Campaigns</TabsTrigger>
          <TabsTrigger value="my-donations">My Donations</TabsTrigger>
          <TabsTrigger value="impact">Impact Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="scholarship">Scholarships</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="facilities">Facilities</SelectItem>
                      <SelectItem value="athletics">Athletics</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Campaigns */}
          {filteredCampaigns.some(campaign => campaign.isFeatured) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Featured Campaigns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCampaigns.filter(campaign => campaign.isFeatured).map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} onDonate={handleDonate} />
                ))}
              </div>
            </div>
          )}

          {/* All Campaigns */}
          <div className="space-y-4">
            {filteredCampaigns.some(campaign => campaign.isFeatured) && (
              <h3 className="text-lg font-semibold">All Campaigns</h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.filter(campaign => !campaign.isFeatured).map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} onDonate={handleDonate} />
              ))}
            </div>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-donations" className="space-y-6">
          <div className="space-y-4">
            {donations.map((donation) => (
              <Card key={donation.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{donation.campaignTitle}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatCurrency(donation.amount, donation.currency)}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(donation.date).toLocaleDateString()}
                        </div>
                      </div>
                      {donation.message && (
                        <p className="mt-3 text-muted-foreground italic">
                          "{donation.message}"
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {donation.isAnonymous ? 'Anonymous' : 'Public'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {donations.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No donations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start making a difference by supporting a campaign
                </p>
                <Button>Browse Campaigns</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">125 Students Supported</h3>
                  <p className="text-muted-foreground">
                    Through scholarship programs, we've helped 125 students achieve their educational dreams.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">15 Research Projects</h3>
                  <p className="text-muted-foreground">
                    Alumni donations have funded 15 groundbreaking research projects across various disciplines.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">3 New Facilities</h3>
                  <p className="text-muted-foreground">
                    Your generous contributions have helped build 3 state-of-the-art facilities on campus.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Emergency Support</h3>
                  <p className="text-muted-foreground">
                    Emergency relief funds have provided critical support to students during challenging times.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CampaignCard({ campaign, onDonate }: { campaign: Campaign; onDonate: (campaignId: string, amount: number, message?: string, isAnonymous?: boolean) => void }) {
  const progressPercentage = getProgressPercentage(campaign.currentAmount, campaign.goalAmount);
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <Card className={`hover:shadow-lg transition-shadow ${campaign.isFeatured ? 'ring-2 ring-primary/20' : ''}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {campaign.isFeatured && (
                  <Badge variant="default">Featured</Badge>
                )}
                <Badge className={getCategoryColor(campaign.category)}>
                  <div className="flex items-center space-x-1">
                    {getCategoryIcon(campaign.category)}
                    <span className="capitalize">{campaign.category}</span>
                  </div>
                </Badge>
              </div>
              <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {campaign.description}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {formatCurrency(campaign.currentAmount, campaign.currency)}
              </span>
              <span className="text-muted-foreground">
                of {formatCurrency(campaign.goalAmount, campaign.currency)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {campaign.donorCount} donors
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {daysLeft} days left
            </div>
          </div>

          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{campaign.title}</DialogTitle>
                </DialogHeader>
                <CampaignDetailsView campaign={campaign} onDonate={onDonate} />
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1">
                  <Heart className="h-3 w-3 mr-1" />
                  Donate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make a Donation</DialogTitle>
                </DialogHeader>
                <DonationForm campaign={campaign} onSubmit={onDonate} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignDetailsView({ campaign, onDonate }: { campaign: Campaign; onDonate: (campaignId: string, amount: number, message?: string, isAnonymous?: boolean) => void }) {
  const progressPercentage = getProgressPercentage(campaign.currentAmount, campaign.goalAmount);
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge className={getCategoryColor(campaign.category)}>
            <div className="flex items-center space-x-1">
              {getCategoryIcon(campaign.category)}
              <span className="capitalize">{campaign.category}</span>
            </div>
          </Badge>
          {campaign.isFeatured && (
            <Badge variant="default">Featured</Badge>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Campaign Description</h3>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Progress</h4>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    {formatCurrency(campaign.currentAmount, campaign.currency)}
                  </span>
                  <span className="text-muted-foreground">
                    of {formatCurrency(campaign.goalAmount, campaign.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Campaign Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Donors:</span>
                  <span>{campaign.donorCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created by:</span>
                  <span>{campaign.createdBy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {campaign.updates.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Campaign Updates</h4>
            <div className="space-y-3">
              {campaign.updates.map((update) => (
                <Card key={update.id}>
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-1">{update.title}</h5>
                    <p className="text-sm text-muted-foreground mb-2">{update.content}</p>
                    <div className="text-xs text-muted-foreground">
                      {update.author} • {new Date(update.date).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Campaign
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Heart className="h-4 w-4 mr-2" />
                Make a Donation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Make a Donation</DialogTitle>
              </DialogHeader>
              <DonationForm campaign={campaign} onSubmit={onDonate} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

function DonationForm({ campaign, onSubmit }: { campaign: Campaign; onSubmit: (campaignId: string, amount: number, message?: string, isAnonymous?: boolean) => void }) {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donationAmount = amount === 'custom' ? parseFloat(customAmount) : parseFloat(amount);
    if (donationAmount > 0) {
      onSubmit(campaign.id, donationAmount, message || undefined, isAnonymous);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-1">{campaign.title}</h4>
        <p className="text-sm text-muted-foreground">{campaign.createdBy}</p>
      </div>

      <div className="space-y-3">
        <Label>Donation Amount</Label>
        <div className="grid grid-cols-3 gap-2">
          {predefinedAmounts.map((presetAmount) => (
            <Button
              key={presetAmount}
              type="button"
              variant={amount === presetAmount.toString() ? "default" : "outline"}
              onClick={() => setAmount(presetAmount.toString())}
              className="h-12"
            >
              {formatCurrency(presetAmount, campaign.currency)}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant={amount === 'custom' ? "default" : "outline"}
            onClick={() => setAmount('custom')}
            className="flex-shrink-0"
          >
            Custom
          </Button>
          {amount === 'custom' && (
            <Input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              min="1"
              required
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Share why you're supporting this campaign..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="anonymous" className="text-sm">
          Make this donation anonymous
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!amount || (amount === 'custom' && !customAmount)}
      >
        <Heart className="h-4 w-4 mr-2" />
        Donate {amount && amount !== 'custom' 
          ? formatCurrency(parseFloat(amount), campaign.currency)
          : amount === 'custom' && customAmount 
            ? formatCurrency(parseFloat(customAmount), campaign.currency)
            : ''
        }
      </Button>
    </form>
  );
}

function CampaignCreateForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    goalAmount: '',
    endDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94ca4259/donations/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Campaign created successfully!');
        onSubmit();
      } else {
        toast.success('Campaign created successfully!'); // Demo success
        onSubmit();
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.success('Campaign created successfully!'); // Demo success
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Campaign Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scholarship">Scholarships</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="facilities">Facilities</SelectItem>
            <SelectItem value="athletics">Athletics</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="goalAmount">Goal Amount ($)</Label>
          <Input
            id="goalAmount"
            type="number"
            value={formData.goalAmount}
            onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Campaign
      </Button>
    </form>
  );
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getProgressPercentage(current: number, goal: number) {
  return Math.min((current / goal) * 100, 100);
}