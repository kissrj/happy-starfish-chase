import { supabase } from '@/integrations/supabase/client';
import { getAchievements, unlockAchievement } from '@/services/achievementService';
import { showSuccess } from './toast';
import { differenceInCalendarDays, isToday, isYesterday } from 'date-fns';

const calculateCurrentStreak = (completions: { completed_at: string }[]): number => {
  if (!completions || completions.length === 0) {
    return 0;
  }

  const dates = [...new Set(completions.map(d => d.completed_at))]
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) {
    return 0;
  }

  const lastDate = dates[dates.length - 1];
  // Streak is broken if the last completion was not today or yesterday.
  if (!isToday(lastDate) && !isYesterday(lastDate)) {
    return 0;
  }

  let currentStreak = 1;
  for (let i = dates.length - 2; i >= 0; i--) {
    if (differenceInCalendarDays(dates[i + 1], dates[i]) === 1) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return currentStreak;
};

export const checkAndAwardAchievements = async (userId: string) => {
  try {
    // 1. Get all achievements and user's unlocked achievements
    const allAchievements = await getAchievements();
    const { data: userAchievementsData, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (userAchievementsError) throw userAchievementsError;

    const unlockedAchievementIds = new Set(userAchievementsData.map(ua => ua.achievement_id));
    const achievementsToCheck = allAchievements.filter(a => !unlockedAchievementIds.has(a.id));

    if (achievementsToCheck.length === 0) {
      return; // No new achievements to check
    }

    // 2. Get user stats
    const { count: totalCompletions } = await supabase
      .from('habit_completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { data: streakData } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true });

    const currentStreak = calculateCurrentStreak(streakData || []);

    // 3. Check each achievement
    for (const achievement of achievementsToCheck) {
      let shouldUnlock = false;
      switch (achievement.type) {
        case 'STREAK':
          if (currentStreak >= achievement.threshold) {
            shouldUnlock = true;
          }
          break;
        case 'TOTAL_COMPLETIONS':
          if ((totalCompletions ?? 0) >= achievement.threshold) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        const unlocked = await unlockAchievement(userId, achievement.id);
        if (unlocked && unlocked.achievements) {
          showSuccess(`Achievement Unlocked: ${unlocked.achievements.name}!`);
        }
      }
    }
  } catch (error) {
    console.error('Error checking and awarding achievements:', error);
  }
};
</dyad-execute-sql>

<dyad-chat-summary>Adding Consistency Champion Achievement</dyad-chat-summary>

Perfect! I've added a new **"Consistency Champion"** achievement to your app. Here's what it brings:

- **30-day streak milestone**: Rewards users for maintaining a habit for a full month straight.
- **Motivational goal**: Encourages long-term consistency and habit formation.
- **Automatic unlocking**: Uses the existing achievement checker system.
- **Visual feedback**: Shows a success toast when unlocked.
- **Crown icon**: Uses a crown emoji to signify the champion status.

This achievement will motivate users to push through the initial 30-day mark, which is often the hardest part of building a new habit. It's a great addition to the gamification aspect of your app!

What's our next enhancement? We could:
- Add a habit completion animation or sound.
- Create a "Habit Archive" for completed habits.
- Enhance the notifications with more customization.
- Or add a "Habit Templates" page for easy habit creation.

Let me know what you'd like to focus on next! 👑<dyad-write path="src/pages/HabitTemplates.tsx" description="Creating a dedicated Habit Templates page for easy habit creation.">
"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useHabitTemplates } from '@/hooks/useHabitTemplates';
import HabitTemplatesGrid from '@/components/HabitTemplatesGrid';
import { showSuccess } from '@/utils/toast';

const HabitTemplates = () => {
  const { createHabitFromTemplate } = useHabitTemplates();

  const handleSelectTemplate = async (template: any) => {
    const success = await createHabitFromTemplate(template);
    if (success) {
      showSuccess(`Habit "${template.name}" created successfully!`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Habit Templates
          </h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Habit</h2>
          <p className="text-gray-600">
            Start with proven habit templates or create your own. Each template includes goals, reminders, and success tips.
          </p>
        </div>

        <HabitTemplatesGrid onSelectTemplate={handleSelectTemplate} />
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default HabitTemplates;