"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { Habit } from './useHabits';
import { checkAndAwardAchievements } from '@/utils/achievementChecker';

export const useHabitActions = (habits: Habit[], updateHabits: (habits: Habit[]) => void) => {
  const { user } = useAuth();
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleToggleCompletion = async (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const wasCompleted = habit.completed_today;

    // Optimistic UI update
    const updatedHabits = habits.map(h =>
      h.id === habit.id ? { ...h, completed_today: !wasCompleted } : h
    );
    updateHabits(updatedHabits);

    // Trigger confetti if all habits are completed
    const totalHabits = updatedHabits.length;
    const completedTodayCount = updatedHabits.filter(h => h.completed_today).length;
    const remainingTodayCount = totalHabits - completedTodayCount;

    if (!wasCompleted && remainingTodayCount === 0 && totalHabits > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    if (!wasCompleted) {
      const { error } = await supabase.from('habit_completions').insert({
        habit_id: habit.id,
        user_id: user!.id,
        completed_at: today,
      });
      if (error) {
        showError("Erro ao marcar o hábito.");
        // Revert optimistic update
        updateHabits(habits);
      } else {
        if (user) {
          checkAndAwardAchievements(user.id);
        }
      }
    } else {
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .match({ habit_id: habit.id, completed_at: today });
      if (error) {
        showError("Erro ao desmarcar o hábito.");
        // Revert optimistic update
        updateHabits(habits);
      }
    }
  };

  const handleDeleteHabit = async () => {
    if (!habitToDelete) return;

    const { error } = await supabase.from('habits').delete().match({ id: habitToDelete.id });

    if (error) {
      showError("Falha ao excluir o hábito.");
    } else {
      showSuccess("Hábito excluído com sucesso.");
      const updatedHabits = habits.filter(h => h.id !== habitToDelete.id);
      updateHabits(updatedHabits);
    }
    setHabitToDelete(null);
  };

  return {
    habitToDelete,
    setHabitToDelete,
    showConfetti,
    handleToggleCompletion,
    handleDeleteHabit,
  };
};