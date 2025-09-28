import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { GraduationCap, Users, ArrowLeft } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelectUserType: (userType: 'student' | 'alumni') => void;
  onBack: () => void;
}

export function UserTypeSelection({ onSelectUserType, onBack }: UserTypeSelectionProps) {
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
                <CardTitle>Welcome to Legatix</CardTitle>
                <CardDescription>
                  Please select your role to get started
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-primary/5 border-2"
                onClick={() => onSelectUserType('student')}
              >
                <GraduationCap className="h-12 w-12 text-primary" />
                <div className="text-center">
                  <h3 className="font-semibold">I'm a Student</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Currently enrolled and looking to connect with alumni, find internships, and explore career opportunities
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-primary/5 border-2"
                onClick={() => onSelectUserType('alumni')}
              >
                <Users className="h-12 w-12 text-primary" />
                <div className="text-center">
                  <h3 className="font-semibold">I'm an Alumni</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Graduate looking to mentor students, network with peers, and contribute to the community
                  </p>
                </div>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              You can change this later in your profile settings
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}