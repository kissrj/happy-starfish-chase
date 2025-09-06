"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Clock, TestTube } from 'lucide-react';
import { NotificationSettings } from '@/hooks/useNotifications';

interface AdvancedNotificationSettingsProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
  onTestNotification: () => void;
}

const AdvancedNotificationSettings = ({
  settings,
  onSettingsChange,
  onTestNotification
}: AdvancedNotificationSettingsProps) => {
  const updateSettings = (updates: Partial<NotificationSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const updateQuietHours = (updates: Partial<NotificationSettings['quietHours']>) => {
    updateSettings({
      quietHours: { ...settings.quietHours, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Configure when and how you want to receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications-enabled">Notifications enabled</Label>
              <p className="text-sm text-muted-foreground">
                Enable to receive browser notifications.
              </p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={settings.enabled}
              onCheckedChange={(enabled) => updateSettings({ enabled })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="habit-reminders">Habit reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders to complete your habits.
              </p>
            </div>
            <Switch
              id="habit-reminders"
              checked={settings.habitReminders}
              onCheckedChange={(habitReminders) => updateSettings({ habitReminders })}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="streak-reminders">Streak reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about your habit streaks.
              </p>
            </div>
            <Switch
              id="streak-reminders"
              checked={settings.streakReminders}
              onCheckedChange={(streakReminders) => updateSettings({ streakReminders })}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-summary">Weekly summary</Label>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of your progress.
              </p>
            </div>
            <Switch
              id="weekly-summary"
              checked={settings.weeklySummary}
              onCheckedChange={(weeklySummary) => updateSettings({ weeklySummary })}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="achievement-alerts">Achievement alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when you reach important goals.
              </p>
            </div>
            <Switch
              id="achievement-alerts"
              checked={settings.achievementAlerts}
              onCheckedChange={(achievementAlerts) => updateSettings({ achievementAlerts })}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quiet Hours
          </CardTitle>
          <CardDescription>
            Set a period of the day to not receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quiet-hours-enabled">Enable quiet hours</Label>
              <p className="text-sm text-muted-foreground">
                Pause notifications during certain hours.
              </p>
            </div>
            <Switch
              id="quiet-hours-enabled"
              checked={settings.quietHours.enabled}
              onCheckedChange={(enabled) => updateQuietHours({ enabled })}
              disabled={!settings.enabled}
            />
          </div>

          {settings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiet-start">Start time</Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => updateQuietHours({ start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-end">End time</Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => updateQuietHours({ end: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Notifications
          </CardTitle>
          <CardDescription>
            Test your notification settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onTestNotification}
            disabled={!settings.enabled}
            className="w-full sm:w-auto"
          >
            <Bell className="h-4 w-4 mr-2" />
            Send Test Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedNotificationSettings;