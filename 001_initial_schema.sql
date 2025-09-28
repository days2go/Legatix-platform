-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  location TEXT,
  bio TEXT,
  graduation_year INTEGER,
  degree TEXT,
  major TEXT,
  phone TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  is_available_for_mentoring BOOLEAN DEFAULT FALSE,
  is_profile_public BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  profile_views INTEGER DEFAULT 0,
  connection_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')) NOT NULL,
  experience TEXT CHECK (experience IN ('entry', 'mid', 'senior', 'executive')) NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  currency TEXT DEFAULT 'USD',
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  is_remote BOOLEAN DEFAULT FALSE,
  application_url TEXT,
  application_deadline DATE NOT NULL,
  posted_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  applications_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_link TEXT,
  type TEXT CHECK (type IN ('networking', 'workshop', 'webinar', 'reunion', 'career', 'social')) NOT NULL,
  category TEXT NOT NULL,
  organizer TEXT NOT NULL,
  organizer_email TEXT NOT NULL,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  registration_deadline DATE NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donation_campaigns table
CREATE TABLE donation_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('scholarship', 'research', 'facilities', 'athletics', 'emergency', 'general')) NOT NULL,
  goal_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  end_date DATE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  donor_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentorship_requests table
CREATE TABLE mentorship_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  type TEXT CHECK (type IN ('video', 'coffee', 'project')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')) DEFAULT 'pending',
  requested_date DATE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT CHECK (type IN ('direct', 'group')) NOT NULL,
  name TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'image', 'file')) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_participants table
CREATE TABLE conversation_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Create donations table
CREATE TABLE donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES donation_campaigns(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  is_anonymous BOOLEAN DEFAULT FALSE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_applications table
CREATE TABLE job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status TEXT CHECK (status IN ('applied', 'reviewing', 'interview', 'rejected', 'accepted')) DEFAULT 'applied',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

-- Create event_registrations table
CREATE TABLE event_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attendance_status TEXT CHECK (attendance_status IN ('registered', 'attended', 'no_show')) DEFAULT 'registered',
  UNIQUE(event_id, attendee_id)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_public ON profiles(is_profile_public);
CREATE INDEX idx_profiles_mentoring ON profiles(is_available_for_mentoring);
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_jobs_deadline ON jobs(application_deadline);
CREATE INDEX idx_events_active ON events(is_active);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Create RPC functions
CREATE OR REPLACE FUNCTION increment_job_applications(job_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE jobs 
  SET applications_count = applications_count + 1 
  WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_event_attendees(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events 
  SET current_attendees = current_attendees + 1 
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION process_donation(campaign_id UUID, donation_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE donation_campaigns 
  SET 
    current_amount = current_amount + donation_amount,
    donor_count = donor_count + 1
  WHERE id = campaign_id;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_campaigns_updated_at BEFORE UPDATE ON donation_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentorship_requests_updated_at BEFORE UPDATE ON mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_profile_public = true);

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Jobs are viewable by authenticated users" ON jobs
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Users can create jobs" ON jobs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Users can update own jobs" ON jobs
  FOR UPDATE TO authenticated USING (auth.uid() = posted_by);

-- Events policies
CREATE POLICY "Events are viewable by authenticated users" ON events
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT TO authenticated WITH CHECK (true);

-- Donation campaigns policies
CREATE POLICY "Campaigns are viewable by authenticated users" ON donation_campaigns
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Users can create campaigns" ON donation_campaigns
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their conversations" ON messages
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'New User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();