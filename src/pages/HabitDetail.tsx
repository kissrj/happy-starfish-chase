"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { EditHabitDialog } from '@/components/EditHabitDialog';
import HabitCompletionChart from '@/components/HabitCompletionChart';
import { format, isSameDay, subDays, addDays, isFuture } from 'date-fns';
import { useAuth } from '@/context/AuthProvider'; // Import useAuth to get user ID

interface Habit {
  id: string;
  name: string;
  description: string | null;
}

const HabitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); // Get user from AuthProvider
  const [habit, setHabit] = useState<Habit | null>(null);
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);

  const calculateStreaks = useCallback((dates: Date[]) => {
    if (dates.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }

    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    // Calculate current streak
    let checkDateForCurrentStreak = today;
    const isTodayCompleted = sortedDates.some(d => isSameDay(d, today));
    const isYesterdayCompleted = sortedDates.some(d => isSameDay(d, subDays(today, 1)));

    if (isTodayCompleted) {
      current = 1;
      checkDateForCurrentStreak = subDays(today, 1);
    } else if (isYesterdayCompleted) {
      current = 1; // Streak continues from yesterday if today is not completed
      checkDateForCurrentStreak = subDays(today, 2);
    } else {
      current = 0;
    }

    if (current > 0) {
      let i = 0;
      while (true) {
        const targetDate = subDays(checkDateForCurrentStreak, i);
        const isCompleted = sortedDates.some(d => isSameDay(d, targetDate));
        if (isCompleted) {
          current++;
          i++;
        } else {
          break;
        }
      }
    }
    setCurrentStreak(current);

    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = sortedDates[i - 1];
        const currentDate = sortedDates[i];
        // Check if current date is exactly one day after previous date
        if (isSameDay(currentDate, addDays(prevDate, 1))) {
          tempStreak++;
        } else if (!isSameDay(currentDate, prevDate)) { // If not consecutive and not same day, reset
          tempStreak = 1;
        }
      }
      if (tempStreak > longest) {
        longest = tempStreak;
      }
    }
    setLongestStreak(longest);
  }, []);

  const fetchHabitDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    const { data: habitData, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single();

    if (habitError || !habitData) {
      showError('Falha ao carregar os detalhes do hábito.');
      setLoading(false);
      return;
    }
    setHabit(habitData);

    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('habit_id', id);

    if (completionsError) {
      showError('Falha ao carregar o histórico do hábito.');
    } else {
      const dates = completionsData.map(c => new Date(c.completed_at + 'T00:00:00'));
      setCompletedDates(dates);
      calculateStreaks(dates); // Calculate streaks after fetching dates
    }

    setLoading(false);
  }, [id, calculateStreaks]);

  useEffect(() => {
    fetchHabitDetails();
  }, [fetchHabitDetails]);

  const handleMarkDate = async () => {
    if (!selectedCalendarDate || !user || !habit) return;

    const formattedDate = format(selectedCalendarDate, 'yyyy-MM-dd');
    const isAlreadyCompleted = completedDates.some(d => isSameDay(d, selectedCalendarDate));

    if (isAlreadyCompleted) {
      showError('Hábito já marcado como concluído nesta data.');
      return;
    }

    const { error } = await supabase.from('habit_completions').insert({
      habit_id: habit.id,
      user_id: user.id,
      completed_at: formattedDate,
    });

    if (error) {
      showError('Erro ao marcar o hábito nesta data.');
      console.error(error);
    } else {
      showSuccess('Hábito marcado como concluído nesta data!');
      const newCompletedDates = [...completedDates, selectedCalendarDate];
      setCompletedDates(newCompletedDates);
      calculateStreaks(newCompletedDates);
    }
  };

  const handleUnmarkDate = async () => {
    if (!selectedCalendarDate || !user || !habit) return;

    const formattedDate = format(selectedCalendarDate, 'yyyy-MM-dd');
    const isAlreadyCompleted = completedDates.some(d => isSameDay(d, selectedCalendarDate));

    if (!isAlreadyCompleted) {
      showError('Hábito não está marcado como concluído nesta data.');
      return;
    }

    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .match({ habit_id: habit.id, completed_at: formattedDate });

    if (error) {
      showError('Erro ao desmarcar o hábito nesta data.');
      console.error(error);
    } else {
      showSuccess('Hábito desmarcado nesta data!');
      const newCompletedDates = completedDates.filter(d => !isSameDay(d, selectedCalendarDate));
      setCompletedDates(newCompletedDates);
      calculateStreaks(newCompletedDates);
    }
  };

  const isSelectedDateCompleted = selectedCalendarDate ? completedDates.some(d => isSameDay(d, selectedCalendarDate)) : false;
  const isSelectedDateFuture = selectedCalendarDate ? isFuture(selectedCalendarDate) : false;

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-64 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <Skeleton className="h-[300px] w-[340px]" />
          </CardContent>
        </Card>
        <Skeleton className="h-[300px] w-full mt-6" />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <h2 className="text-xl font-semibold">Hábito não encontrado</h2>
        <Button asChild variant="link" className="mt-4">
          <Link to="/">Voltar para o painel</Link>
        </Button>
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
          {habit && <EditHabitDialog habit={habit} onHabitUpdated={fetchHabitDetails} />}
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800">{habit.name}</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            {habit.description || "Nenhuma descrição fornecida."}
          </p>

          {/* Streak Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Sequência Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600">{currentStreak} dias</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Maior Sequência</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-600">{longestStreak} dias</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Calendário de Progresso</CardTitle>
              <CardDescription>Clique em uma data para marcar/desmarcar a conclusão do hábito.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={selectedCalendarDate}
                onSelect={setSelectedCalendarDate}
                disabled={(date) => isFuture(date)} // Disable future dates
                initialFocus
                className="rounded-md border"
              />
              {selectedCalendarDate && (
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={handleMarkDate}
                    disabled={isSelectedDateCompleted || isSelectedDateFuture}
                  >
                    Marcar {format(selectedCalendarDate, 'dd/MM/yyyy')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleUnmarkDate}
                    disabled={!isSelectedDateCompleted || isSelectedDateFuture}
                  >
                    Desmarcar {format(selectedCalendarDate, 'dd/MM/yyyy')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <HabitCompletionChart completedDates={completedDates} />

        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default HabitDetail;