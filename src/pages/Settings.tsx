"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useAuth } from '@/context/AuthProvider';
import { useSettings } from '@/hooks/useSettings';
import SettingsContent from '@/components/SettingsContent';
import { ThemeToggle } from '@/components/ThemeToggle';

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-2xl">
        <SettingsContent
          user={user}
          notificationsEnabled={notificationsEnabled}
          darkMode={darkMode}
          onNotificationToggle={handleNotificationToggle}
          onThemeToggle={handleThemeToggle}
          onExportAllData={handleExportAllData}
          onDeleteAllData={handleDeleteAllData}
        />
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Settings;