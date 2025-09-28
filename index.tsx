import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// CORS and logging middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Create Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to verify user auth
async function verifyAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch (error) {
    console.log("Auth verification error:", error);
    return null;
  }
}

// Routes

// Signup endpoint
app.post("/make-server-94ca4259/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Automatically confirm since email server not configured
    });

    if (error) {
      console.log("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    const profileKey = `profile:${data.user.id}`;
    await kv.set(profileKey, {
      id: data.user.id,
      name,
      email,
      title: '',
      company: '',
      location: '',
      bio: '',
      graduationYear: new Date().getFullYear(),
      degree: '',
      major: '',
      skills: [],
      interests: [],
      achievements: [],
      workExperience: [],
      education: [],
      isAvailableForMentoring: false,
      isProfilePublic: true,
      createdAt: new Date().toISOString(),
      profileViews: 0,
      connectionCount: 0
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log("Signup error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Dashboard data endpoint
app.get("/make-server-94ca4259/dashboard", async (c) => {
  try {
    // Get sample statistics
    const stats = {
      totalAlumni: 1247,
      activeJobs: 23,
      upcomingEvents: 8,
      totalDonations: 125000,
      activeMentorships: 45,
      unreadMessages: 3
    };

    const recentActivity = [
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
    ];

    const upcomingEvents = [
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
    ];

    return c.json({ stats, recentActivity, upcomingEvents });
  } catch (error) {
    console.log("Dashboard error:", error);
    return c.json({ error: "Failed to fetch dashboard data" }, 500);
  }
});

// Alumni directory endpoint
app.get("/make-server-94ca4259/alumni", async (c) => {
  try {
    // Get alumni from KV store
    const profiles = await kv.getByPrefix("profile:");
    const alumni = profiles.map(p => p.value).filter(p => p.isProfilePublic);
    
    return c.json({ alumni });
  } catch (error) {
    console.log("Alumni directory error:", error);
    return c.json({ error: "Failed to fetch alumni" }, 500);
  }
});

// Mentorship endpoints
app.get("/make-server-94ca4259/mentorship", async (c) => {
  try {
    // Get mentors and requests from KV store
    const mentors = await kv.get("mentors") || [];
    const requests = await kv.get("mentorship_requests") || [];
    
    return c.json({ mentors, requests });
  } catch (error) {
    console.log("Mentorship error:", error);
    return c.json({ error: "Failed to fetch mentorship data" }, 500);
  }
});

app.post("/make-server-94ca4259/mentorship/request", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const requestData = await c.req.json();
    const newRequest = {
      id: crypto.randomUUID(),
      userId: user.id,
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Get existing requests and add new one
    const existingRequests = await kv.get("mentorship_requests") || [];
    await kv.set("mentorship_requests", [...existingRequests, newRequest]);

    return c.json({ success: true, request: newRequest });
  } catch (error) {
    console.log("Mentorship request error:", error);
    return c.json({ error: "Failed to create mentorship request" }, 500);
  }
});

// Jobs endpoints
app.get("/make-server-94ca4259/jobs", async (c) => {
  try {
    const jobs = await kv.get("jobs") || [];
    return c.json({ jobs });
  } catch (error) {
    console.log("Jobs error:", error);
    return c.json({ error: "Failed to fetch jobs" }, 500);
  }
});

app.post("/make-server-94ca4259/jobs", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const jobData = await c.req.json();
    const newJob = {
      id: crypto.randomUUID(),
      ...jobData,
      postedBy: user.user_metadata?.name || user.email,
      postedDate: new Date().toISOString(),
      applicationsCount: 0,
      viewsCount: 0
    };

    const existingJobs = await kv.get("jobs") || [];
    await kv.set("jobs", [...existingJobs, newJob]);

    return c.json({ success: true, job: newJob });
  } catch (error) {
    console.log("Job creation error:", error);
    return c.json({ error: "Failed to create job" }, 500);
  }
});

app.post("/make-server-94ca4259/jobs/:id/apply", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const jobId = c.req.param("id");
    
    // Create application record
    const application = {
      id: crypto.randomUUID(),
      jobId,
      userId: user.id,
      applicantName: user.user_metadata?.name || user.email,
      appliedAt: new Date().toISOString()
    };

    const existingApplications = await kv.get("job_applications") || [];
    await kv.set("job_applications", [...existingApplications, application]);

    return c.json({ success: true, application });
  } catch (error) {
    console.log("Job application error:", error);
    return c.json({ error: "Failed to apply to job" }, 500);
  }
});

// Events endpoints
app.get("/make-server-94ca4259/events", async (c) => {
  try {
    const events = await kv.get("events") || [];
    return c.json({ events });
  } catch (error) {
    console.log("Events error:", error);
    return c.json({ error: "Failed to fetch events" }, 500);
  }
});

app.post("/make-server-94ca4259/events", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const eventData = await c.req.json();
    const newEvent = {
      id: crypto.randomUUID(),
      ...eventData,
      organizer: user.user_metadata?.name || user.email,
      organizerEmail: user.email,
      currentAttendees: 0,
      isRegistered: false,
      isFeatured: false,
      createdAt: new Date().toISOString()
    };

    const existingEvents = await kv.get("events") || [];
    await kv.set("events", [...existingEvents, newEvent]);

    return c.json({ success: true, event: newEvent });
  } catch (error) {
    console.log("Event creation error:", error);
    return c.json({ error: "Failed to create event" }, 500);
  }
});

app.post("/make-server-94ca4259/events/:id/register", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const eventId = c.req.param("id");
    
    const registration = {
      id: crypto.randomUUID(),
      eventId,
      userId: user.id,
      userName: user.user_metadata?.name || user.email,
      registeredAt: new Date().toISOString()
    };

    const existingRegistrations = await kv.get("event_registrations") || [];
    await kv.set("event_registrations", [...existingRegistrations, registration]);

    return c.json({ success: true, registration });
  } catch (error) {
    console.log("Event registration error:", error);
    return c.json({ error: "Failed to register for event" }, 500);
  }
});

// Donations endpoints
app.get("/make-server-94ca4259/donations", async (c) => {
  try {
    const campaigns = await kv.get("donation_campaigns") || [];
    const donations = await kv.get("donations") || [];
    return c.json({ campaigns, donations });
  } catch (error) {
    console.log("Donations error:", error);
    return c.json({ error: "Failed to fetch donation data" }, 500);
  }
});

app.post("/make-server-94ca4259/donations/campaigns", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const campaignData = await c.req.json();
    const newCampaign = {
      id: crypto.randomUUID(),
      ...campaignData,
      currentAmount: 0,
      donorCount: 0,
      createdBy: user.user_metadata?.name || user.email,
      isActive: true,
      isFeatured: false,
      updates: [],
      createdAt: new Date().toISOString()
    };

    const existingCampaigns = await kv.get("donation_campaigns") || [];
    await kv.set("donation_campaigns", [...existingCampaigns, newCampaign]);

    return c.json({ success: true, campaign: newCampaign });
  } catch (error) {
    console.log("Campaign creation error:", error);
    return c.json({ error: "Failed to create campaign" }, 500);
  }
});

app.post("/make-server-94ca4259/donations/donate", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const donationData = await c.req.json();
    const newDonation = {
      id: crypto.randomUUID(),
      ...donationData,
      userId: user.id,
      donorName: donationData.isAnonymous ? 'Anonymous' : (user.user_metadata?.name || user.email),
      date: new Date().toISOString()
    };

    const existingDonations = await kv.get("donations") || [];
    await kv.set("donations", [...existingDonations, newDonation]);

    return c.json({ success: true, donation: newDonation });
  } catch (error) {
    console.log("Donation error:", error);
    return c.json({ error: "Failed to process donation" }, 500);
  }
});

// Chat endpoints
app.get("/make-server-94ca4259/chat", async (c) => {
  try {
    const conversations = await kv.get("conversations") || [];
    const contacts = await kv.get("contacts") || [];
    return c.json({ conversations, contacts });
  } catch (error) {
    console.log("Chat error:", error);
    return c.json({ error: "Failed to fetch chat data" }, 500);
  }
});

app.get("/make-server-94ca4259/chat/:id/messages", async (c) => {
  try {
    const conversationId = c.req.param("id");
    const messages = await kv.get(`messages:${conversationId}`) || [];
    return c.json({ messages });
  } catch (error) {
    console.log("Messages error:", error);
    return c.json({ error: "Failed to fetch messages" }, 500);
  }
});

app.post("/make-server-94ca4259/chat/:id/messages", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const conversationId = c.req.param("id");
    const messageData = await c.req.json();
    
    const newMessage = {
      id: crypto.randomUUID(),
      conversationId,
      senderId: user.id,
      ...messageData,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    const existingMessages = await kv.get(`messages:${conversationId}`) || [];
    await kv.set(`messages:${conversationId}`, [...existingMessages, newMessage]);

    return c.json({ success: true, message: newMessage });
  } catch (error) {
    console.log("Send message error:", error);
    return c.json({ error: "Failed to send message" }, 500);
  }
});

// Profile endpoints
app.get("/make-server-94ca4259/profile", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`profile:${user.id}`);
    return c.json({ profile });
  } catch (error) {
    console.log("Profile error:", error);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

app.put("/make-server-94ca4259/profile", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profileData = await c.req.json();
    const updatedProfile = {
      ...profileData,
      id: user.id,
      email: user.email, // Ensure email can't be changed
      updatedAt: new Date().toISOString()
    };

    await kv.set(`profile:${user.id}`, updatedProfile);
    
    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.log("Profile update error:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// Health check endpoint
app.get("/make-server-94ca4259/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
serve(app.fetch);