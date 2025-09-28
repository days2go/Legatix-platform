import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create Supabase client
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Helper function to handle Supabase errors gracefully
const handleSupabaseError = (error: any, fallbackData: any = null) => {
  console.warn('Supabase operation failed, using fallback:', error);
  return { data: fallbackData, error: null };
};

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          user_type: 'student' | 'alumni';
          title: string | null;
          company: string | null;
          location: string | null;
          bio: string | null;
          graduation_year: number | null;
          degree: string | null;
          major: string | null;
          phone: string | null;
          linkedin_url: string | null;
          website_url: string | null;
          skills: string[];
          interests: string[];
          is_available_for_mentoring: boolean;
          is_profile_public: boolean;
          avatar_url: string | null;
          profile_views: number;
          connection_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string;
          type: 'full-time' | 'part-time' | 'contract' | 'internship';
          experience: 'entry' | 'mid' | 'senior' | 'executive';
          salary_min: number | null;
          salary_max: number | null;
          currency: string;
          description: string;
          requirements: string[];
          benefits: string[];
          skills: string[];
          is_remote: boolean;
          application_url: string | null;
          application_deadline: string;
          posted_by: string;
          applications_count: number;
          views_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at' | 'updated_at' | 'applications_count' | 'views_count'>;
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          time: string;
          end_time: string;
          location: string;
          is_virtual: boolean;
          virtual_link: string | null;
          type: 'networking' | 'workshop' | 'webinar' | 'reunion' | 'career' | 'social';
          category: string;
          organizer: string;
          organizer_email: string;
          max_attendees: number | null;
          current_attendees: number;
          registration_deadline: string;
          cost: number;
          currency: string;
          tags: string[];
          is_featured: boolean;
          is_active: boolean;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at' | 'current_attendees'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      donation_campaigns: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: 'scholarship' | 'research' | 'facilities' | 'athletics' | 'emergency' | 'general';
          goal_amount: number;
          current_amount: number;
          currency: string;
          end_date: string;
          created_by: string;
          donor_count: number;
          is_active: boolean;
          is_featured: boolean;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['donation_campaigns']['Row'], 'id' | 'created_at' | 'updated_at' | 'current_amount' | 'donor_count'>;
        Update: Partial<Database['public']['Tables']['donation_campaigns']['Insert']>;
      };
      mentorship_requests: {
        Row: {
          id: string;
          mentor_id: string;
          mentee_id: string;
          topic: string;
          type: 'video' | 'coffee' | 'project';
          status: 'pending' | 'approved' | 'completed' | 'cancelled';
          requested_date: string;
          duration: number;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['mentorship_requests']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['mentorship_requests']['Insert']>;
      };
      conversations: {
        Row: {
          id: string;
          type: 'direct' | 'group';
          name: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          type: 'text' | 'image' | 'file';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
    };
  };
}

// Sample data for demo purposes
const sampleAlumni = [
  {
    id: 'demo-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    user_type: 'alumni' as const,
    graduation_year: 2018,
    degree: 'Computer Science',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    bio: 'Passionate about full-stack development and mentoring junior developers.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    is_available_for_mentoring: true,
    created_at: '2024-01-15T00:00:00Z',
    avatar_url: null,
    phone: null,
    linkedin_url: null
  },
  {
    id: 'demo-2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    user_type: 'alumni' as const,
    graduation_year: 2016,
    degree: 'Business Administration',
    title: 'Product Manager',
    company: 'Innovation Inc',
    location: 'New York, NY',
    bio: 'Leading product strategy for fintech solutions.',
    skills: ['Product Management', 'Strategy', 'Analytics', 'Leadership'],
    is_available_for_mentoring: true,
    created_at: '2024-01-10T00:00:00Z',
    avatar_url: null,
    phone: null,
    linkedin_url: null
  }
];

const sampleJobs = [
  {
    id: 'demo-job-1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time' as const,
    experience: 'senior' as const,
    salary_min: 120000,
    salary_max: 180000,
    currency: 'USD',
    description: 'We are looking for a Senior Software Engineer to join our growing team.',
    requirements: ['5+ years experience', 'JavaScript', 'React', 'Node.js'],
    benefits: ['Health insurance', '401k matching', 'Flexible PTO'],
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    created_at: '2024-01-15T00:00:00Z',
    application_deadline: '2024-02-15',
    is_remote: false,
    posted_by: 'demo-1',
    applications_count: 24,
    views_count: 156
  }
];

// Database health check
export const checkDatabaseHealth = async () => {
  try {
    // Test basic connection and table existence
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database health check failed:', error);
      return { healthy: false, error: error.message };
    }
    
    console.log('Database health check passed');
    return { healthy: true, error: null };
  } catch (err) {
    console.error('Database health check error:', err);
    return { healthy: false, error: String(err) };
  }
};

// Supabase API functions
export const supabaseApi = {
  // Profile operations
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      // If table doesn't exist or other structural errors, handle gracefully
      if (error && (error.message?.includes('schema cache') || error.message?.includes('does not exist'))) {
        console.warn('Profiles table not found, using fallback data');
        return { data: null, error: null };
      }
      
      return { data, error };
    } catch (err) {
      console.error('Error fetching profile:', err);
      return handleSupabaseError(err, null);
    }
  },

  async updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Failed to update profile:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Failed to update profile:', err);
      return handleSupabaseError(err, null);
    }
  },

  async createProfile(profile: Database['public']['Tables']['profiles']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();
      
      if (error) {
        console.error('Failed to create profile:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Failed to create profile:', err);
      return handleSupabaseError(err, null);
    }
  },

  // Alumni directory
  async getAlumni(filters?: { 
    search?: string; 
    graduationYear?: string; 
    industry?: string; 
    skill?: string; 
  }) {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_profile_public', true);

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,company.ilike.%${filters.search}%,title.ilike.%${filters.search}%`);
      }
      
      if (filters?.graduationYear) {
        query = query.eq('graduation_year', parseInt(filters.graduationYear));
      }

      const { data, error } = await query.order('name');
      
      // If no data from database, return sample data
      if (!data || data.length === 0) {
        return { data: sampleAlumni, error: null };
      }
      
      return { data, error };
    } catch (err) {
      return handleSupabaseError(err, sampleAlumni);
    }
  },

  // Job operations
  async getJobs(filters?: {
    search?: string;
    location?: string;
    type?: string;
    experience?: string;
  }) {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true);

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      if (filters?.location && filters.location !== '') {
        if (filters.location === 'remote') {
          query = query.eq('is_remote', true);
        } else {
          query = query.ilike('location', `%${filters.location}%`);
        }
      }

      if (filters?.type && filters.type !== '') {
        query = query.eq('type', filters.type);
      }

      if (filters?.experience && filters.experience !== '') {
        query = query.eq('experience', filters.experience);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      // If no data from database, return sample data
      if (!data || data.length === 0) {
        return { data: sampleJobs, error: null };
      }
      
      return { data, error };
    } catch (err) {
      return handleSupabaseError(err, sampleJobs);
    }
  },

  async createJob(job: Database['public']['Tables']['jobs']['Insert']) {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        ...job,
        applications_count: 0,
        views_count: 0,
        is_active: true
      })
      .select()
      .single();
    return { data, error };
  },

  async applyToJob(jobId: string, userId: string) {
    // Increment applications count
    const { error } = await supabase.rpc('increment_job_applications', { job_id: jobId });
    return { error };
  },

  // Event operations
  async getEvents(filters?: {
    search?: string;
    type?: string;
    date?: string;
  }) {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('is_active', true);

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.type && filters.type !== '') {
        query = query.eq('type', filters.type);
      }

      if (filters?.date) {
        query = query.eq('date', filters.date);
      }

      const { data, error } = await query.order('date');
      return { data, error };
    } catch (err) {
      return handleSupabaseError(err, []);
    }
  },

  async createEvent(event: Database['public']['Tables']['events']['Insert']) {
    const { data, error } = await supabase
      .from('events')
      .insert({
        ...event,
        current_attendees: 0,
        is_active: true
      })
      .select()
      .single();
    return { data, error };
  },

  async registerForEvent(eventId: string, userId: string) {
    // Increment attendees count
    const { error } = await supabase.rpc('increment_event_attendees', { event_id: eventId });
    return { error };
  },

  // Donation operations
  async getDonationCampaigns() {
    const { data, error } = await supabase
      .from('donation_campaigns')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createDonationCampaign(campaign: Database['public']['Tables']['donation_campaigns']['Insert']) {
    const { data, error } = await supabase
      .from('donation_campaigns')
      .insert({
        ...campaign,
        current_amount: 0,
        donor_count: 0,
        is_active: true,
        is_featured: false
      })
      .select()
      .single();
    return { data, error };
  },

  async makeDonation(campaignId: string, amount: number, userId: string) {
    // Update campaign amounts
    const { error } = await supabase.rpc('process_donation', { 
      campaign_id: campaignId, 
      donation_amount: amount 
    });
    return { error };
  },

  // Mentorship operations
  async getMentors() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_available_for_mentoring', true)
      .eq('is_profile_public', true);
    return { data, error };
  },

  async getMentorshipRequests(userId: string) {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .select(`
        *,
        mentor:mentor_id(name, title, company),
        mentee:mentee_id(name, title, company)
      `)
      .or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createMentorshipRequest(request: Database['public']['Tables']['mentorship_requests']['Insert']) {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .insert({
        ...request,
        status: 'pending'
      })
      .select()
      .single();
    return { data, error };
  },

  // Chat operations
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages(
          id,
          content,
          created_at,
          sender_id,
          type
        )
      `)
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at');
    return { data, error };
  },

  async sendMessage(message: Database['public']['Tables']['messages']['Insert']) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    return { data, error };
  },

  // Dashboard stats
  async getDashboardStats() {
    try {
      const [
        { count: totalAlumni },
        { count: activeJobs },
        { count: upcomingEvents },
        { data: campaigns }
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).eq('is_profile_public', true),
        supabase.from('jobs').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('events').select('id', { count: 'exact' }).eq('is_active', true).gte('date', new Date().toISOString().split('T')[0]),
        supabase.from('donation_campaigns').select('current_amount').eq('is_active', true)
      ]);

      const totalDonations = campaigns?.reduce((sum, campaign) => sum + (campaign.current_amount || 0), 0) || 0;

      return {
        data: {
          totalAlumni: totalAlumni || 0,
          activeJobs: activeJobs || 0,
          upcomingEvents: upcomingEvents || 0,
          totalDonations,
          activeMentorships: 0, // Will be calculated from mentorship_requests
          unreadMessages: 0 // Will be calculated from messages
        },
        error: null
      };
    } catch (error) {
      // Return fallback stats if Supabase is not available
      return handleSupabaseError(error, {
        totalAlumni: 0,
        activeJobs: 0,
        upcomingEvents: 0,
        totalDonations: 0,
        activeMentorships: 0,
        unreadMessages: 0
      });
    }
  }
};

// Real-time subscriptions
export const subscribeToTable = (tableName: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:${tableName}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: tableName }, 
      callback
    )
    .subscribe();
};