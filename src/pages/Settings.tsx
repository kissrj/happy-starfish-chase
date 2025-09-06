"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useAuth } from '@/context/AuthProvider';
import { useSettings } from '@/hooks/useSettings';
import NotificationSettings from '@/components/NotificationSettings';
import AppearanceSettings from '@/components/AppearanceSettings';
import DataManagementSettings from '@/components/DataManagementSettings';
import AccountInformation from '@/components/AccountInformation';

const Settings = () => {
  const { user } = useAuth();
  const {
    notificationsEnabled,
    darkMode,
    handleNotificationToggle,
    handleThemeToggle,
    handleExportAllData,
    handleDeleteAllData,
  } = useSettings();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Personalize sua experiência no Rastreador de Hábitos.
            </p>
          </div>

          <NotificationSettings
            notificationsEnabled={notificationsEnabled}
            onNotificationToggle={handleNotificationToggle}
          />

          <AppearanceSettings
            darkMode={darkMode}
            onThemeToggle={handleThemeToggle}
          />

          <DataManagementSettings
            onExportAllData={handleExportAllData}
            onDeleteAllData={handleDeleteAllData}
          />

          <AccountInformation user={user} />
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Settings;