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
          Notificações
        </CardTitle>
        <CardDescription>
          Configure como você deseja receber lembretes de hábitos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Notificações do navegador</Label>
            <p className="text-sm text-muted-foreground">
              Receba lembretes no navegador para seus hábitos.
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