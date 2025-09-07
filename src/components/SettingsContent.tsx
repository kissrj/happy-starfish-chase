"use client";

import NotificationSettings from '@/components/NotificationSettings';
import AppearanceSettings from '@/components/AppearanceSettings';
import DataManagementSettings from '@/components/DataManagementSettings';
import AccountInformation from '@/components/AccountInformation';
import { User } from '@supabase/supabase-js';

interface SettingsContentProps {
  user: User | null;
  notificationsEnabled: boolean;
  darkMode: boolean;
  onNotificationToggle: (enabled: boolean) => void;
  onThemeToggle: (enabled: boolean) => void;
  onExportAllData: () => void;
  onDeleteAllData: () => void;
}

const SettingsContent = ({
  user,
  notificationsEnabled,
  darkMode,
  onNotificationToggle,
  onThemeToggle,
  onExportAllData,
  onDeleteAllData,
}: SettingsContentProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize your Habit Tracker experience.
        </p>
      </div>

      <NotificationSettings
        notificationsEnabled={notificationsEnabled}
        onNotificationToggle={onNotificationToggle}
      />

      <AppearanceSettings
        darkMode={darkMode}
        onThemeToggle={onThemeToggle}
      />

      <DataManagementSettings
        onExportAllData={onExportAllData}
        onDeleteAllData={onDeleteAllData}
      />

      <AccountInformation user={user} />
    </div>
  );
};

export default SettingsContent;