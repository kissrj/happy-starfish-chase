"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { showSuccess, showError } from '@/utils/toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Moon, Sun, Download, Upload, Trash2 } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { exportToCSV } from '@/utils/exportData';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Check for dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        showSuccess('Notificações ativadas!');
      } else {
        showError('Permissão para notificações negada.');
        setNotificationsEnabled(false);
      }
    } else {
      setNotificationsEnabled(false);
      showSuccess('Notificações desativadas.');
    }
  };

  const handleThemeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleExportAllData = async () => {
    if (!user) return;

    try {
      // Export habits data
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (habitsError) {
        showError('Erro ao exportar hábitos.');
        return;
      }

      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id);

      if (completionsError) {
        showError('Erro ao exportar conclusões de hábitos.');
        return;
      }

      // Export transactions data
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      if (transactionsError) {
        showError('Erro ao exportar transações.');
        return;
      }

      // Export budgets data
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);

      if (budgetsError) {
        showError('Erro ao exportar orçamentos.');
        return;
      }

      // Create comprehensive export
      const exportData = {
        habits: habitsData || [],
        habitCompletions: completionsData || [],
        transactions: transactionsData || [],
        budgets: budgetsData || [],
      };

      // Convert to CSV format
      const csvData = [
        ['Type', 'Data'],
        ['Habits', JSON.stringify(habitsData)],
        ['Habit Completions', JSON.stringify(completionsData)],
        ['Transactions', JSON.stringify(transactionsData)],
        ['Budgets', JSON.stringify(budgetsData)],
      ];

      exportToCSV(csvData, `dados_completos_${format(new Date(), 'yyyy-MM-dd')}`);
      showSuccess('Dados exportados com sucesso!');
    } catch (error) {
      showError('Erro ao exportar dados.');
      console.error(error);
    }
  };

  const handleDeleteAllData = async () => {
    if (!user) return;

    try {
      // Delete in order to avoid foreign key constraints
      await supabase.from('habit_completions').delete().eq('user_id', user.id);
      await supabase.from('transactions').delete().eq('user_id', user.id);
      await supabase.from('budgets').delete().eq('user_id', user.id);
      await supabase.from('habits').delete().eq('user_id', user.id);

      showSuccess('Todos os dados foram excluídos.');
      setShowDeleteDialog(false);
    } catch (error) {
      showError('Erro ao excluir dados.');
      console.error(error);
    }
  };

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

          {/* Notifications Settings */}
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
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
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
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Gerenciamento de Dados
              </CardTitle>
              <CardDescription>
                Exporte ou exclua seus dados pessoais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Exportar todos os dados</Label>
                  <p className="text-sm text-muted-foreground">
                    Baixe uma cópia de todos os seus dados em formato CSV.
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportAllData}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-destructive">Excluir todos os dados</Label>
                  <p className="text-sm text-muted-foreground">
                    Exclua permanentemente todos os seus hábitos, transações e orçamentos.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Tudo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Detalhes da sua conta atual.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
              </div>
              <div>
                <Label>ID do Usuário</Label>
                <p className="text-sm text-muted-foreground mt-1 font-mono">{user?.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MadeWithDyad />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Todos os Dados</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente todos os seus hábitos,
              transações, orçamentos e dados relacionados. Você tem certeza?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllData}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;