"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationCenter from '@/components/NotificationCenter';
import AdvancedNotificationSettings from '@/components/AdvancedNotificationSettings';
import { NotificationHistory } from '@/hooks/useNotifications';

interface NotificationsContentProps {
  settings: any;
  history: NotificationHistory[];
  unreadCount: number;
  onSettingsChange: (settings: any) => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onTestNotification: () => void;
}

const NotificationsContent = ({
  settings,
  history,
  unreadCount,
  onSettingsChange,
  onMarkAsRead,
  onClearAll,
  onTestNotification,
}: NotificationsContentProps) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Center</h2>
        <p className="text-gray-600">
          Manage your notifications and customize how you want to be reminded of your habits.
        </p>
      </div>

      <Tabs defaultValue="center" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="center">Notification Center</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="center" className="space-y-6">
          <NotificationCenter
            notifications={history}
            onMarkAsRead={onMarkAsRead}
            onClearAll={onClearAll}
            unreadCount={unreadCount}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <AdvancedNotificationSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
            onTestNotification={onTestNotification}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsContent;