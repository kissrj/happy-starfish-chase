"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationCenter from '@/components/NotificationCenter';
import AdvancedNotificationSettings from '@/components/AdvancedNotificationSettings';
import { showSuccess } from '@/utils/toast';

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
      'Notificação de Teste',
      'Esta é uma notificação de teste para verificar suas configurações.',
      'Teste'
    );
    showSuccess('Notificação de teste enviada!');
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
                Voltar
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </h1>
            <div></div>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
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
              Voltar
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </h1>
          <div></div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Centro de Notificações</h2>
          <p className="text-gray-600">
            Gerencie suas notificações e personalize como você deseja ser lembrado dos seus hábitos.
          </p>
        </div>

        <Tabs defaultValue="center" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="center">Centro de Notificações</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="center" className="space-y-6">
            <NotificationCenter
              notifications={history}
              onMarkAsRead={markAsRead}
              onClearAll={clearAllNotifications}
              unreadCount={unreadCount}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdvancedNotificationSettings
              settings={settings}
              onSettingsChange={saveSettings}
              onTestNotification={handleTestNotification}
            />
          </TabsContent>
        </Tabs>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Notifications;