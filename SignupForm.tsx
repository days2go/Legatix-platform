import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { ArrowLeft, GraduationCap, Users } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner@2.0.3';

interface SignupFormProps {
  userType: 'student' | 'alumni';
  onBack: () => void;
  onSignup: (email: string, password: string, name: string, userType: 'student' | 'alumni') => Promise<any>;
  onGoogleSignIn: (userType: 'student' | 'alumni') => Promise<any>;
  loading: boolean;
}

export function SignupForm({ userType, onBack, onSignup, onGoogleSignIn, loading }: SignupFormProps) {
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const result = await onSignup(
      signupData.email,
      signupData.password,
      signupData.name,
      userType
    );

    if (result.error) {
      toast.error('Signup failed: ' + result.error.message);
    } else {
      toast.success('Account created successfully! Please check your email to verify your account.');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await onGoogleSignIn(userType);
      if (result.error) {
        toast.error('Google sign-in failed: ' + result.error.message);
      } else {
        toast.success('Welcome to Legatix!');
      }
    } catch (error) {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Legatix</h1>
          </div>
          <p className="text-muted-foreground">Alumni Network Platform</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-1 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {userType === 'student' ? (
                    <GraduationCap className="h-5 w-5" />
                  ) : (
                    <Users className="h-5 w-5" />
                  )}
                  <span>
                    Create {userType === 'student' ? 'Student' : 'Alumni'} Account
                  </span>
                </CardTitle>
                <CardDescription>
                  Join the Legatix community as a {userType}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder={userType === 'student' ? 'student@university.edu' : 'alumni@email.com'}
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || googleLoading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}