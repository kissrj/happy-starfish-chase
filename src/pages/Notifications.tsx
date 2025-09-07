"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useNotifications } from '@/hooks/useNotifications';
import { showSuccess } from '@/utils/toast';
import NotificationsContent from '@/components/NotificationsContent';

const Notifications = () => {
  const {
    settings,
    history,
    loading,
    saveSettings,
    requestPermission,
    sendNotification,
    markAsRead,
    clearAllNotifications,
  } = useNotifications();

  const handleTestNotification = async () => {
    await sendNotification(
      'reminder',
      'Test Notification',
      'This is a test notification to check your settings.',
      'Test'
    );
    showSuccess('Test notification sent!');
  };

  const unreadCount = history.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h1>
            <div></div>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:px-8 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h1>
            <div></div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:px-8 max-w-4xl">
          <NotificationsContent
            settings={settings}
            history={history}
            unreadCount={unreadCount}
            onSettingsChange={saveSettings}
            onMarkAsRead={markAsRead}
            onClearAll={clearAllNotifications}
            onTestNotification={handleTestNotification}
          />
        </main>
        <MadeWithDyad />
      </div>
    );
  };

export default Notifications;