import React, { useState, useEffect, createContext, useContext } from 'react';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { supabase, supabaseApi, checkDatabaseHealth } from './utils/supabase/client';
import { Toaster } from './components/ui/sonner';

// Theme Context
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// Auth Context
const AuthContext = createContext<{
  user: any;
  profile: any;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, name: string, userType?: 'student' | 'alumni') => Promise<any>;
  signInWithGoogle: (userType?: 'student' | 'alumni') => Promise<any>;
  logout: () => void;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}>({
  user: null,
  profile: null,
  login: async () => {},
  signup: async () => {},
  signInWithGoogle: async () => {},
  logout: () => {},
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check database health
    checkDatabaseHealth().then(({ healthy, error }) => {
      if (!healthy) {
        console.warn('Database health check failed. Using offline mode.', error);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        // Check if this is a new Google user and create profile if needed
        if (event === 'SIGNED_IN' && session?.user?.app_metadata?.provider === 'google') {
          await ensureGoogleUserProfile(session.user);
        }
        await loadUserProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const ensureGoogleUserProfile = async (user: any) => {
    try {
      const { data: existingProfile } = await supabaseApi.getProfile(user.id);
      if (!existingProfile) {
        // Get user type from metadata or default to alumni
        const userType = user.user_metadata?.user_type || 'alumni';
        // Create profile for new Google user
        await supabaseApi.createProfile({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || 'Google User',
          user_type: userType,
          title: userType === 'student' ? 'Student' : 'Alumni Member',
          company: null,
          location: null,
          bio: null,
          graduation_year: null,
          degree: null,
          major: null,
          phone: null,
          linkedin_url: null,
          website_url: null,
          skills: [],
          interests: [],
          is_available_for_mentoring: userType === 'alumni',
          is_profile_public: true,
          avatar_url: user.user_metadata?.avatar_url || null,
          profile_views: 0,
          connection_count: 0
        });
      }
    } catch (error) {
      console.error('Error ensuring Google user profile:', error);
    }
  };

  const loadUserProfile = async (userId: string, userEmail?: string) => {
    try {
      const { data, error } = await supabaseApi.getProfile(userId);
      if (data) {
        setProfile(data);
      } else {
        // Profile doesn't exist, try to create one
        console.log('Profile not found, attempting to create...');
        
        // Get user data from auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const userName = authUser?.user_metadata?.name || authUser?.user_metadata?.full_name || 'New User';
        const userType = authUser?.user_metadata?.user_type || 'alumni';
        
        try {
          const createResult = await supabaseApi.createProfile({
            id: userId,
            email: userEmail || authUser?.email || 'user@example.com',
            name: userName,
            user_type: userType,
            title: userType === 'student' ? 'Student' : 'Alumni Member',
            company: null,
            location: null,
            bio: null,
            graduation_year: null,
            degree: null,
            major: null,
            phone: null,
            linkedin_url: null,
            website_url: null,
            skills: [],
            interests: [],
            is_available_for_mentoring: userType === 'alumni',
            is_profile_public: true,
            avatar_url: authUser?.user_metadata?.avatar_url || null,
            profile_views: 0,
            connection_count: 0
          });
          
          if (createResult.data) {
            setProfile(createResult.data);
          } else {
            // Profile creation failed, use fallback
            setProfile({
              id: userId,
              name: userName,
              email: userEmail || 'demo@example.com',
              user_type: userType,
              title: userType === 'student' ? 'Student' : 'Alumni Member',
              company: null,
              location: null,
              bio: null,
              graduation_year: null,
              degree: null,
              major: null,
              phone: null,
              linkedin_url: null,
              website_url: null,
              skills: [],
              interests: [],
              is_available_for_mentoring: userType === 'alumni',
              is_profile_public: true,
              avatar_url: null,
              profile_views: 0,
              connection_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        } catch (createError) {
          console.error('Failed to create profile:', createError);
          // Use fallback profile
          setProfile({
            id: userId,
            name: userName,
            email: userEmail || 'demo@example.com',
            user_type: userType,
            title: userType === 'student' ? 'Student' : 'Alumni Member',
            company: null,
            location: null,
            bio: null,
            graduation_year: null,
            degree: null,
            major: null,
            phone: null,
            linkedin_url: null,
            website_url: null,
            skills: [],
            interests: [],
            is_available_for_mentoring: userType === 'alumni',
            is_profile_public: true,
            avatar_url: null,
            profile_views: 0,
            connection_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Set a fallback profile
      setProfile({
        id: userId,
        name: 'Demo User',
        email: userEmail || 'demo@example.com',
        user_type: 'alumni',
        title: 'Alumni Member',
        company: null,
        location: null,
        bio: null,
        graduation_year: null,
        degree: null,
        major: null,
        phone: null,
        linkedin_url: null,
        website_url: null,
        skills: [],
        interests: [],
        is_available_for_mentoring: true,
        is_profile_public: true,
        avatar_url: null,
        profile_views: 0,
        connection_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id, user.email);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signup = async (email: string, password: string, name: string, userType: 'student' | 'alumni' = 'alumni') => {
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            user_type: userType,
          }
        }
      });
      
      if (authError) {
        return { data: null, error: authError };
      }
      
      // Create profile after successful signup
      if (data.user) {
        try {
          const profileResult = await supabaseApi.createProfile({
            id: data.user.id,
            email: email,
            name: name,
            user_type: userType,
            title: userType === 'student' ? 'Student' : 'Alumni Member',
            company: null,
            location: null,
            bio: null,
            graduation_year: null,
            degree: null,
            major: null,
            phone: null,
            linkedin_url: null,
            website_url: null,
            skills: [],
            interests: [],
            is_available_for_mentoring: userType === 'alumni',
            is_profile_public: true,
            avatar_url: null,
            profile_views: 0,
            connection_count: 0
          });
          
          if (profileResult.error) {
            console.warn('Profile creation failed during signup, will be created on login:', profileResult.error);
          }
        } catch (profileError) {
          console.warn('Profile creation failed during signup, will be created on login:', profileError);
        }
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithGoogle = async (userType: 'student' | 'alumni' = 'alumni') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          data: {
            user_type: userType,
          }
        }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, profile, login, signup, signInWithGoogle, logout, loading, refreshProfile }}>
        <div className={theme === 'dark' ? 'dark' : ''}>
          <div className="min-h-screen bg-background text-foreground">
            {user ? <Dashboard /> : <Login />}
            <Toaster />
          </div>
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}