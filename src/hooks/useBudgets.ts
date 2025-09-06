"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

export const useBudgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: budgetsData, error: budgetsError } = await supabase
      .from('budgets')
      .select('*');

    if (budgetsError) {
      showError('Falha ao carregar os orçamentos.');
      console.error(budgetsError);
      setLoading(false);
      return;
    }

    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();

    const budgetsWithSpent = await Promise.all(
      (budgetsData || []).map(async (budget) => {
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('category', budget.category)
          .eq('type', 'expense')
          .gte('created_at', firstDayOfMonth)
          .lte('created_at', lastDayOfMonth);

        if (transactionsError) {
          console.error(`Error fetching transactions for ${budget.category}`, transactionsError);
          return { ...budget, spent: 0 };
        }

        const spent = (transactionsData || []).reduce((sum, t) => sum + t.amount, 0);
        return { ...budget, spent };
      })
    );

    setBudgets(budgetsWithSpent);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = async (budgetData: Omit<Budget, 'id' | 'spent'>) => {
    if (!user) {
      showError("Você precisa estar logado para adicionar um orçamento.");
      return;
    }

    const { error } = await supabase
      .from("budgets")
      .insert([{ ...budgetData, user_id: user.id }]);

    if (error) {
      showError("Falha ao adicionar o orçamento.");
      console.error(error);
      return false;
    } else {
      showSuccess("Orçamento adicionado com sucesso!");
      fetchBudgets();
      return true;
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    const { error } = await supabase
      .from("budgets")
      .update(updates)
      .eq("id", id);

    if (error) {
      showError("Falha ao atualizar o orçamento.");
      console.error(error);
      return false;
    } else {
      showSuccess("Orçamento atualizado com sucesso!");
      fetchBudgets();
      return true;
    }
  };

  const deleteBudget = async (id: string) => {
    const { error } = await supabase.from('budgets').delete().match({ id });

    if (error) {
      showError("Falha ao excluir o orçamento.");
      return false;
    } else {
      showSuccess("Orçamento excluído com sucesso.");
      fetchBudgets();
      return true;
    }
  };

  return {
    budgets,
    loading,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  };
};