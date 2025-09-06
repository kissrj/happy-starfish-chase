"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { showError, showSuccess } from '@/utils/toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Download } from 'lucide-react';
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
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import Confetti from 'react-confetti';
import FinancialOverview from '@/components/FinancialOverview';
import { exportToCSV } from '@/utils/exportData';
import { format } from 'date-fns';
import { loadAndScheduleReminders, requestNotificationPermission } from '@/utils/notifications';

interface Habit {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  completed_today: boolean;
  reminder_time?: string;
}

const Index = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dailySummary, setDailySummary] = useState({ total: 0, completed: 0, remaining: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const today = new Date().toISOString().split('T')[0];

    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (habitsError) {
      showError('Falha ao carregar os hábitos.');
      console.error(habitsError);
      setLoading(false);
      return;
    }

    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('habit_id')
      .eq('completed_at', today);

    if (completionsError) {
      showError('Falha ao carregar o status dos hábitos.');
      console.error(completionsError);
    }

    const completedHabitIds = new Set(completionsData?.map(c => c.habit_id) || []);

    const habitsWithCompletion = habitsData.map(habit => ({
      ...habit,
      completed_today: completedHabitIds.has(habit.id),
    }));

    setHabits(habitsWithCompletion);

    // Calculate daily summary
    const totalHabits = habitsData.length;
    const completedTodayCount = habitsWithCompletion.filter(h => h.completed_today).length;
    const remainingTodayCount = totalHabits - completedTodayCount;
    setDailySummary({
      total: totalHabits,
      completed: completedTodayCount,
      remaining: remainingTodayCount,
    });

    // Schedule reminders for habits that have them
    loadAndScheduleReminders(habitsWithCompletion);

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Request notification permission on app load
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleToggleCompletion = async (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const wasCompleted = habit.completed_today;

    // Optimistic UI update for habits list and daily summary
    setHabits(currentHabits => {
      const updatedHabits = currentHabits.map(h =>
        h.id === habit.id ? { ...h, completed_today: !wasCompleted } : h
      );

      const totalHabits = updatedHabits.length;
      const completedTodayCount = updatedHabits.filter(h => h.completed_today).length;
      const remainingTodayCount = totalHabits - completedTodayCount;
      setDailySummary({
        total: totalHabits,
        completed: completedTodayCount,
        remaining: remainingTodayCount,
      });

      // Trigger confetti if all habits are completed
      if (!wasCompleted && remainingTodayCount === 0 && totalHabits > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
      }

      return updatedHabits;
    });

    if (!wasCompleted) {
      const { error } = await supabase.from('habit_completions').insert({
        habit_id: habit.id,
        user_id: user!.id,
        completed_at: today,
      });
      if (error) {
        showError("Erro ao marcar o hábito.");
        // Revert optimistic UI update if error
        setHabits(currentHabits => {
          const revertedHabits = currentHabits.map(h =>
            h.id === habit.id ? { ...h, completed_today: wasCompleted } : h
          );
          const totalHabits = revertedHabits.length;
          const completedTodayCount = revertedHabits.filter(h => h.completed_today).length;
          const remainingTodayCount = totalHabits - completedTodayCount;
          setDailySummary({
            total: totalHabits,
            completed: completedTodayCount,
            remaining: remainingTodayCount,
          });
          return revertedHabits;
        });
      }
    } else {
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .match({ habit_id: habit.id, completed_at: today });
      if (error) {
        showError("Erro ao desmarcar o hábito.");
        // Revert optimistic UI update if error
        setHabits(currentHabits => {
          const revertedHabits = currentHabits.map(h =>
            h.id === habit.id ? { ...h, completed_today: wasCompleted } : h
          );
          const totalHabits = revertedHabits.length;
          const completedTodayCount = revertedHabits.filter(h => h.completed_today).length;
          const remainingTodayCount = totalHabits - completedTodayCount;
          setDailySummary({
            total: totalHabits,
            completed: completedTodayCount,
            remaining: remainingTodayCount,
          });
          return revertedHabits;
        });
      }
    }
  };

  const handleDeleteHabit = async () => {
    if (!habitToDelete) return;

    const { error } = await supabase.from('habits').delete().match({ id: habitToDelete.id });

    if (error) {
      showError("Falha ao excluir o hábito.");
    } else {
      showSuccess("Hábito excluído com sucesso.");
      setHabits(currentHabits => {
        const updatedHabits = currentHabits.filter(h => h.id !== habitToDelete.id);
        const totalHabits = updatedHabits.length;
        const completedTodayCount = updatedHabits.filter(h => h.completed_today).length;
        const remainingTodayCount = totalHabits - completedTodayCount;
        setDailySummary({
          total: totalHabits,
          completed: completedTodayCount,
          remaining: remainingTodayCount,
        });
        return updatedHabits;
      });
    }
    setHabitToDelete(null);
  };

  const handleExportHabits = async () => {
    if (!user) return;

    // Fetch all habit completions for export
    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('habit_id, completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (completionsError) {
      showError('Falha ao carregar dados de hábitos para exportação.');
      return;
    }

    const exportData = habits.map(habit => {
      const completions = completionsData?.filter(c => c.habit_id === habit.id) || [];
      return {
        Nome: habit.name,
        Descrição: habit.description || '',
        'Data de Criação': habit.created_at.split('T')[0],
        'Total de Conclusões': completions.length,
        'Última Conclusão': completions.length > 0 ? completions[0].completed_at : '',
      };
    });

    exportToCSV(exportData, `habitos_${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const filteredHabits = habits.filter(habit =>
    habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (habit.description && habit.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-6 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredHabits.length === 0 && searchTerm === '') {
      return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Nenhum hábito encontrado</h2>
          <p className="text-gray-600">
            Clique em "Adicionar Hábito" para começar a rastrear.
          </p>
        </div>
      );
    }

    if (filteredHabits.length === 0 && searchTerm !== '') {
      return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Nenhum hábito corresponde à sua busca.</h2>
          <p className="text-gray-600">
            Tente um termo de busca diferente ou adicione um novo hábito.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHabits.map((habit) => (
          <Link to={`/habit/${habit.id}`} key={habit.id} className="block hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <Card className="flex flex-col h-full transition-all border-2 border-transparent hover:border-primary">
              <CardHeader className="flex-row items-start justify-between">
                <CardTitle className="pr-2">{habit.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setHabitToDelete(habit);
                  }}
                  aria-label={`Excluir hábito ${habit.name}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {habit.description || "Nenhuma descrição fornecida."}
                </p>
                {habit.reminder_time && (
                  <p className="text-xs text-muted-foreground mt-2">
                    🔔 Lembrete: {habit.reminder_time}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <div
                  className="flex items-center space-x-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Checkbox
                    id={`habit-${habit.id}`}
                    checked={habit.completed_today}
                    onCheckedChange={() => handleToggleCompletion(habit)}
                    aria-label={`Marcar ${habit.name} como feito hoje`}
                  />
                  <label
                    htmlFor={`habit-${habit.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Feito hoje
                  </label>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && <Confetti recycle={false} onConfettiComplete={() => setShowConfetti(false)} />}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Meu Painel de Controle</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleExportHabits} disabled={habits.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Hábitos
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/finance">Finanças</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/profile">Perfil</Link>
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">Sair</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Daily Summary Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Total de Hábitos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{dailySummary.total}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Completados Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">{dailySummary.completed}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Restantes Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-600">{dailySummary.remaining}</p>
            </CardContent>
          </Card>
          <FinancialOverview />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Seus Hábitos</h2>
          <div className="flex gap-4 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Buscar hábitos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <AddHabitDialog onHabitAdded={fetchHabits} />
          </div>
        </div>
        {renderContent()}
      </main>
      <MadeWithDyad />

      <AlertDialog open={!!habitToDelete} onOpenChange={() => setHabitToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o hábito
              "{habitToDelete?.name}" e todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHabit} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;