"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';

interface AppearanceSettingsProps {
  darkMode: boolean;
  onThemeToggle: (enabled: boolean) => void;
}

const AppearanceSettings = ({ darkMode, onThemeToggle }: AppearanceSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          Aparência
        </CardTitle>
        <CardDescription>
          Personalize a aparência do aplicativo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Modo escuro</Label>
            <p className="text-sm text-muted-foreground">
              Alterne entre tema claro e escuro.
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={onThemeToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;