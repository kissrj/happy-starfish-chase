"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Flame, Target, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';

interface SharedProgress {
  habits: number;
  completed: number;
  streak: number;
  total: number;
  user: string;
  timestamp: number;
}

const ShareProgress = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [progress, setProgress] = useState<SharedProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shareId) {
      try {
        const decodedData = JSON.parse(atob(shareId));
        setProgress(decodedData);
      } catch (error) {
        console.error('Invalid share data:', error);
      }
    }
    setLoading(false);
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Invalid Share Link</h1>
            <p className="text-gray-600 mb-4">This share link appears to be invalid or expired.</p>
            <Button asChild>
              <Link to="/">Go to Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const completionRate = progress.habits > 0 ? Math.round((progress.completed / progress.habits) * 100) : 0;
  const shareDate = new Date(progress.timestamp).toLocaleDateString();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Shared Progress</h1>
          <div></div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">{progress.user}'s Progress</h2>
          </div>
          <p className="text-gray-600">Shared on {shareDate}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {progress.completed}/{progress.habits}
              </div>
              <Badge variant="secondary" className="text-sm">
                {completionRate}% Complete
              </Badge>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Flame className="h-5 w-5 text-orange-600" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {progress.streak} days
              </div>
              <p className="text-sm text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="text-center md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Total Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {progress.total} completions
              </div>
              <p className="text-sm text-muted-foreground">
                Amazing dedication to building better habits!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Inspired to start your own habit journey?</h3>
            <p className="text-gray-600 mb-4">
              Join thousands of people building better habits every day.
            </p>
            <Button asChild size="lg">
              <Link to="/">Get Started</Link>
            </Button>
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default ShareProgress;