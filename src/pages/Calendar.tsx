"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { showError } from '@/utils/toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Habit {
  id: string;
  name: string;
  description: string | null;
  category?: string;
}

interface CompletionData {
  [habitId: string]: {
    [date: string]: boolean;
  };
}

const Calendar = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completionData, setCompletionData] = useState<CompletionData>({});
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState<string>('all');

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Fetch habits
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

    setHabits(habitsData || []);

    // Fetch completion data for the current month
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);

    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('habit_id, completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', format(startDate, 'yyyy-MM-dd'))
      .lte('completed_at', format(endDate, 'yyyy-MM-dd'));

    if (completionsError) {
      showError('Falha ao carregar dados de conclusão.');
      console.error(completionsError);
    } else {
      // Organize completion data by habit and date
      const organizedData: CompletionData = {};
      completionsData?.forEach(completion => {
        if (!organizedData[completion.habit_id]) {
          organizedData[completion.habit_id] = {};
        }
        organizedData[completion.habit_id][completion.completed_at] = true;
      });
      setCompletionData(organizedData);
    }

    setLoading(false);
  }, [user, currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getCompletionStatus = (date: Date, habitId: string) => {
    if (selectedHabit === 'all') {
      // For "all habits" view, show if ANY habit was completed that day
      return habits.some(habit => completionData[habit.id]?.[format(date, 'yyyy-MM-dd')]);
    } else {
      // For specific habit view
      return completionData[selectedHabit]?.[format(date, 'yyyy-MM-dd')] || false;
    }
  };

  const getCompletionCount = (date: Date) => {
    if (selectedHabit === 'all') {
      return habits.filter(habit => completionData[habit.id]?.[format(date, 'yyyy-MM-dd')]).length;
    }
    return getCompletionStatus(date, selectedHabit) ? 1 : 0;
  };

  const renderCalendar = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      );
    }

    const days = getDaysInMonth();
    const firstDayOfMonth = startOfMonth(currentMonth).getDay();
    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    return (
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first day of the month */}
        {emptyCells.map(i => (
          <div key={`empty-${i}`} className="h-20 border rounded-lg bg-gray-50"></div>
        ))}

        {/* Calendar days */}
        {days.map(day => {
          const isCompleted = getCompletionStatus(day, selectedHabit);
          const completionCount = getCompletionCount(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`h-20 border rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isToday ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
              } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
            >
              <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                {format(day, 'd')}
              </span>
              {isCompleted && (
                <div className="mt-1 flex items-center gap-1">
                  {selectedHabit === 'all' ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{completionCount}</span>
                    </>
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getMonthStats = () => {
    const days = getDaysInMonth();
    let totalCompletions = 0;
    let completedDays = 0;

    days.forEach(day => {
      const count = getCompletionCount(day);
      if (count > 0) {
        totalCompletions += count;
        completedDays += 1;
      }
    });

    const totalPossible = selectedHabit === 'all' ? days.length * habits.length : days.length;
    const completionRate = totalPossible > 0 ? (totalCompletions / totalPossible) * 100 : 0;

    return {
      totalCompletions,
      completedDays,
      totalDays: days.length,
      completionRate: Math.round(completionRate)
    };
  };

  const stats = getMonthStats();

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
            <CalendarIcon className="h-5 w-5" />
            Calendário de Hábitos
          </h1>
          <div></div> {/* Spacer for flex layout */}
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => navigateMonth('prev')}>
              ← Mês Anterior
            </Button>
            <h2 className="text-2xl font-bold text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <Button variant="outline" onClick={() => navigateMonth('next')}>
              Próximo Mês →
            </Button>
          </div>

          {/* Habit Filter */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filtrar por Hábito</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedHabit}
                onChange={(e) => setSelectedHabit(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">Todos os Hábitos</option>
                {habits.map(habit => (
                  <option key={habit.id} value={habit.id}>
                    {habit.name} {habit.category ? `(${habit.category})` : ''}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Monthly Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total de Conclusões</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{stats.totalCompletions}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Dias Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{stats.completedDays}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{stats.completionRate}%</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Hábitos Rastreados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedHabit === 'all' ? habits.length : 1}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Calendário de Progresso</CardTitle>
              <CardDescription>
                {selectedHabit === 'all'
                  ? 'Dias verdes indicam conclusão de pelo menos um hábito. O número mostra quantos hábitos foram concluídos.'
                  : 'Dias verdes indicam conclusão do hábito selecionado.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCalendar()}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Legenda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border rounded bg-green-50 border-green-200"></div>
                  <span className="text-sm">Dia com conclusão</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border rounded border-primary bg-primary/5"></div>
                  <span className="text-sm">Hoje</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Hábito concluído</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Calendar;