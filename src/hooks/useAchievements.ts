"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthProvider';
import { Achievement, UserAchievement } from '@/types/achievements';
import { showError } from '@/utils/toast';

export const useAchievements = () => {
  const { user } = useAuth();
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAchievements = async () => {
      setLoading(true);
      try {
        // Fetch all possible achievements
        const { data: all, error: allError } = await supabase
          .from('achievements')
          .select('*')
          .order('created_at', { ascending: true });

        if (allError) throw allError;
        setAllAchievements(all || []);

        // Fetch user's unlocked achievements
        const { data: unlocked, error: unlockedError } = await supabase
          .from('user_achievements')
          .select('*, achievements(*)')
          .eq('user_id', user.id);

        if (unlockedError) throw unlockedError;
        setUserAchievements(unlocked || []);

      } catch (error) {
        console.error('Error fetching achievements:', error);
        showError('Não foi possível carregar as conquistas.');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  return { allAchievements, userAchievements, loading };
};