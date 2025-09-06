import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { useStreak } from '@/hooks/useStreak';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import Icon from '@/components/Icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Achievement } from '@/types/achievements';

const AchievementsPanel: React.FC = () => {
  const { user } = useAuth();
  const { achievements, unlockedAchievementIds, isLoading: isLoadingAchievements } = useAchievements();
  const { currentStreak, isLoading: isLoadingStreak } = useStreak();

  const { data: totalCompletions, isLoading: isLoadingCompletions } = useQuery({
    queryKey: ['totalCompletions', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('habit_completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching total completions', error);
        return 0;
      }
      return count ?? 0;
    },
    enabled: !!user,
  });

  const getAchievementProgress = (achievement: Achievement) => {
    switch (achievement.type) {
      case 'STREAK':
        return { progress: currentStreak, total: achievement.threshold };
      case 'TOTAL_COMPLETIONS':
        return { progress: totalCompletions, total: achievement.threshold };
      default:
        return { progress: undefined, total: undefined };
    }
  };

  const isLoading = isLoadingAchievements || isLoadingStreak || isLoadingCompletions;

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedAchievements = achievements.slice(0, 4);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedAchievements.map((achievement) => {
            const isUnlocked = unlockedAchievementIds.has(achievement.id);
            const { progress, total } = getAchievementProgress(achievement);

            return (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-lg border ${
                  isUnlocked 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-md mr-3 ${
                    isUnlocked 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon name={achievement.icon} className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center">
                      {achievement.name}
                      {isUnlocked && (
                        <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600">Unlocked</Badge>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                    {progress !== undefined && total && !isUnlocked && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{Math.min(progress, total)}/{total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(Math.min(progress, total) / total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsPanel;