-- Add user_type column to profiles table
ALTER TABLE profiles 
ADD COLUMN user_type TEXT CHECK (user_type IN ('student', 'alumni')) DEFAULT 'alumni';

-- Update the handle_new_user function to include user_type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, user_type)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'alumni')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for user_type
CREATE INDEX idx_profiles_user_type ON profiles(user_type);