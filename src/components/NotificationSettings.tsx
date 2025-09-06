"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';

interface NotificationSettingsProps {
  notificationsEnabled: boolean;
  onNotificationToggle: (enabled: boolean) => void;
}

const NotificationSettings = ({ notificationsEnabled, onNotificationToggle }: NotificationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Configure how you want to receive habit reminders.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Browser notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive reminders in your browser for your habits.
            </p>
          </div>
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={onNotificationToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;