"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { exportToCSV } from '@/utils/exportData';
import { format } from 'date-fns';

export const useSettings = () => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Check for dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        showSuccess('Notifications enabled!');
      } else {
        showError('Notification permission denied.');
        setNotificationsEnabled(false);
      }
    } else {
      setNotificationsEnabled(false);
      showSuccess('Notifications disabled.');
    }
  };

  const handleThemeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleExportAllData = async () => {
    if (!user) return;

    try {
      // Export habits data
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (habitsError) {
        showError('Error exporting habits.');
        return;
      }

      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id);

      if (completionsError) {
        showError('Error exporting habit completions.');
        return;
      }

      // Export transactions data
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      if (transactionsError) {
        showError('Error exporting transactions.');
        return;
      }

      // Export budgets data
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);

      if (budgetsError) {
        showError('Error exporting budgets.');
        return;
      }

      // Create comprehensive export
      const exportData = [
        ['Type', 'Data'],
        ['Habits', JSON.stringify(habitsData)],
        ['Habit Completions', JSON.stringify(completionsData)],
        ['Transactions', JSON.stringify(transactionsData)],
        ['Budgets', JSON.stringify(budgetsData)],
      ];

      exportToCSV(exportData, `full_data_${format(new Date(), 'yyyy-MM-dd')}`);
      showSuccess('Data exported successfully!');
    } catch (error) {
      showError('Error exporting data.');
      console.error(error);
    }
  };

  const handleDeleteAllData = async () => {
    if (!user) return;

    try {
      // Delete in order to avoid foreign key constraints
      await supabase.from('habit_completions').delete().eq('user_id', user.id);
      await supabase.from('transactions').delete().eq('user_id', user.id);
      await supabase.from('budgets').delete().eq('user_id', user.id);
      await supabase.from('habits').delete().eq('user_id', user.id);

      showSuccess('All data has been deleted.');
    } catch (error) {
      showError('Error deleting data.');
      console.error(error);
    }
  };

  return {
    notificationsEnabled,
    darkMode,
    handleNotificationToggle,
    handleThemeToggle,
    handleExportAllData,
    handleDeleteAllData,
  };
};