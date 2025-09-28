import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { Separator } from "../ui/separator";
import { useAuth, useTheme } from "../../App";
import { toast } from "sonner@2.0.3";
import { Moon, Sun, GraduationCap } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { UserTypeSelection } from "./UserTypeSelection";
import { SignupForm } from "./SignupForm";

export function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'user_type_selection' | 'signup'>('login');
  const [selectedUserType, setSelectedUserType] = useState<'student' | 'alumni' | null>(null);
  const { login, signup, signInWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await login(
        loginData.email,
        loginData.password,
      );
      if (error) {
        toast.error("Login failed: " + error.message);
      } else {
        toast.success("Welcome back to Legatix!");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, name: string, userType: 'student' | 'alumni') => {
    setLoading(true);

    try {
      const result = await signup(email, password, name, userType);
      if (!result.error) {
        setAuthStep('login');
        setSelectedUserType(null);
      }
      return result;
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (userType?: 'student' | 'alumni') => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle(userType);
      return result;
    } catch (error) {
      return { data: null, error };
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleUserTypeSelection = (userType: 'student' | 'alumni') => {
    setSelectedUserType(userType);
    setAuthStep('signup');
  };

  const handleBackToLogin = () => {
    setAuthStep('login');
    setSelectedUserType(null);
  };

  const handleBackToUserTypeSelection = () => {
    setAuthStep('user_type_selection');
  };

  // Handle different auth steps
  if (authStep === 'user_type_selection') {
    return (
      <UserTypeSelection
        onSelectUserType={handleUserTypeSelection}
        onBack={handleBackToLogin}
      />
    );
  }

  if (authStep === 'signup' && selectedUserType) {
    return (
      <SignupForm
        userType={selectedUserType}
        onBack={handleBackToUserTypeSelection}
        onSignup={handleSignup}
        onGoogleSignIn={handleGoogleSignIn}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">
              Legatix
            </h1>
          </div>
          <p className="text-muted-foreground">
            Alumni Network Platform
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value,
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
                {loading ? "Signing in..." : "Sign In"}
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
                onClick={() => handleGoogleSignIn()}
                disabled={loading || googleLoading}
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setAuthStep('user_type_selection')}
                  className="text-sm"
                >
                  Don't have an account? Sign up
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}