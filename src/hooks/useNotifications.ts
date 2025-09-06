"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

export interface NotificationSettings {
  enabled: boolean;
  habitReminders: boolean;
  streakReminders: boolean;
  weeklySummary: boolean;
  achievementAlerts: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface NotificationHistory {
  id: string;
  type: 'reminder' | 'streak' | 'achievement' | 'summary';
  title: string;
  message: string;
  habit_name?: string;
  created_at: string;
  read: boolean;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    habitReminders: true,
    streakReminders: true,
    weeklySummary: true,
    achievementAlerts: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notification settings
  const loadSettings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading notification settings:', error);
        return;
      }

      if (data) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }, [user]);

  // Load notification history
  const loadHistory = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading notification history:', error);
        return;
      }

      setHistory(data || []);
    } catch (error) {
      console.error('Error loading notification history:', error);
    }
  }, [user]);

  // Save notification settings
  const saveSettings = useCallback(async (newSettings: NotificationSettings) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          settings: newSettings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        showError('Error saving notification settings.');
        console.error(error);
        return false;
      }

      setSettings(newSettings);
      showSuccess('Notification settings saved!');
      return true;
    } catch (error) {
      showError('Error saving notification settings.');
      console.error(error);
      return false;
    }
  }, [user]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      showError('This browser does not support notifications.');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await saveSettings({ ...settings, enabled: true });
        return true;
      }
    }

    return false;
  }, [settings, saveSettings]);

  // Send notification
  const sendNotification = useCallback(async (
    type: 'reminder' | 'streak' | 'achievement' | 'summary',
    title: string,
    message: string,
    habitName?: string
  ) => {
    if (!user || !settings.enabled) return;

    // Check quiet hours
    if (settings.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = parseInt(settings.quietHours.start.replace(':', ''));
      const endTime = parseInt(settings.quietHours.end.replace(':', ''));

      if (currentTime >= startTime || currentTime <= endTime) {
        return; // In quiet hours
      }
    }

    // Check if notification type is enabled
    switch (type) {
      case 'reminder':
        if (!settings.habitReminders) return;
        break;
      case 'streak':
        if (!settings.streakReminders) return;
        break;
      case 'achievement':
        if (!settings.achievementAlerts) return;
        break;
      case 'summary':
        if (!settings.weeklySummary) return;
        break;
    }

    // Show browser notification
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    }

    // Save to history
    try {
      await supabase.from('notification_history').insert({
        user_id: user.id,
        type,
        title,
        message,
        habit_name: habitName,
        read: false
      });

      // Reload history
      loadHistory();
    } catch (error) {
      console.error('Error saving notification to history:', error);
    }
  }, [user, settings, loadHistory]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_history')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      setHistory(prev => prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }, [user]);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        showError('Error clearing notifications.');
        console.error(error);
        return false;
      }

      setHistory([]);
      showSuccess('All notifications cleared!');
      return true;
    } catch (error) {
      showError('Error clearing notifications.');
      console.error(error);
      return false;
    }
  }, [user]);

  // Schedule habit reminders
  const scheduleHabitReminders = useCallback(async (habits: any[]) => {
    if (!settings.enabled || !settings.habitReminders) return;

    const reminders = habits.filter(h => h.reminder_time);

    for (const habit of reminders) {
      if (habit.reminder_time) {
        const [hours, minutes] = habit.reminder_time.split(':').map(Number);
        const now = new Date();
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);

        // If the time has already passed today, schedule for tomorrow
        if (reminderDate <= now) {
          reminderDate.setDate(reminderDate.getDate() + 1);
        }

        const timeUntilReminder = reminderDate.getTime() - now.getTime();

        setTimeout(() => {
          sendNotification(
            'reminder',
            `Habit Reminder: ${habit.name}`,
            'Don\'t forget to complete your habit today!',
            habit.name
          );
          // Schedule the next reminder for the same time tomorrow
          scheduleHabitReminders([habit]);
        }, timeUntilReminder);
      }
    }
  }, [settings, sendNotification]);

  useEffect(() => {
    loadSettings();
    loadHistory();
  }, [loadSettings, loadHistory]);

  return {
    settings,
    history,
    loading,
    saveSettings,
    requestPermission,
    sendNotification,
    markAsRead,
    clearAllNotifications,
    scheduleHabitReminders,
  };
};