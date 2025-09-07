"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Twitter, Facebook, Download, Trophy, Flame, Target } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { Habit } from '@/hooks/useHabits';

interface HabitSharingProps {
  habits: Habit[];
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  userName?: string;
}

const HabitSharing = ({ habits, currentStreak, longestStreak, totalCompletions, userName }: HabitSharingProps) => {
  const [shareUrl, setShareUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const completedToday = habits.filter(h => h.completed_today).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const generateShareUrl = async () => {
    setIsGenerating(true);
    try {
      // In a real app, you'd generate a unique share URL and store the data
      const shareData = {
        habits: habits.length,
        completed: completedToday,
        streak: currentStreak,
        total: totalCompletions,
        user: userName || 'Anonymous',
        timestamp: Date.now()
      };

      // For demo purposes, create a shareable URL with encoded data
      const encodedData = btoa(JSON.stringify(shareData));
      const url = `${window.location.origin}/share/${encodedData}`;
      setShareUrl(url);
      showSuccess('Share link generated!');
    } catch (error) {
      showError('Failed to generate share link.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showSuccess('Link copied to clipboard!');
    } catch (error) {
      showError('Failed to copy link.');
    }
  };

  const shareOnTwitter = () => {
    const text = `I'm building great habits! ${completedToday}/${totalHabits} completed today with a ${currentStreak}-day streak! Check out my progress: ${shareUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const downloadProgressImage = () => {
    // In a real implementation, you'd generate an image with the progress data
    // For now, we'll just show a message
    showSuccess('Progress image download feature coming soon!');
  };

  const shareMessage = `I'm building great habits! ${completedToday}/${totalHabits} completed today with a ${currentStreak}-day streak! Check out my progress: ${shareUrl}`;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="mr-2 h-5 w-5 text-blue-500" />
          Share Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">Today's Progress</h3>
            <Badge variant="secondary" className="text-sm">
              {completionRate}% Complete
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <span>{completedToday}/{totalHabits} habits</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-600" />
              <span>{currentStreak}-day streak</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span>{totalCompletions} total completions</span>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          {!shareUrl ? (
            <Button onClick={generateShareUrl} disabled={isGenerating} className="w-full">
              {isGenerating ? 'Generating...' : 'Generate Share Link'}
            </Button>
          ) : (
            <>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button onClick={copyToClipboard} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={shareOnTwitter} variant="outline" className="flex-1">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
                <Button onClick={shareOnFacebook} variant="outline" className="flex-1">
                  <Facebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
                <Button onClick={downloadProgressImage} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Image
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Or share this message:</p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  {shareMessage}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Motivational Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            🎉 Sharing your progress can motivate others and help you stay accountable!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitSharing;