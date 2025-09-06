"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { EditHabitDialog } from '@/components/EditHabitDialog';

interface Habit {
  id: string;
  name: string;
  description: string | null;
}

const HabitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

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
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchHabitDetails();
  }, [fetchHabitDetails]);

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

          <Card>
            <CardHeader>
              <CardTitle>Calendário de Progresso</CardTitle>
              <CardDescription>Os dias marcados indicam quando você completou este hábito.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="multiple"
                selected={completedDates}
                disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                initialFocus
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default HabitDetail;