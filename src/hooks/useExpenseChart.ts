"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

export interface ExpenseData {
  category: string;
  amount: number;
}

export const useExpenseChart = () => {
  const { user } = useAuth();
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenseData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

    const { data, error } = await supabase
      .from('transactions')
      .select('category, amount')
      .eq('user_id', user.id)
      .eq('type', 'expense')
      .gte('created_at', firstDayOfMonth)
      .lte('created_at', lastDayOfMonth);

    if (error) {
      showError('Falha ao carregar dados de despesas.');
      console.error(error);
      setLoading(false);
      return;
    }

    // Group expenses by category
    const categoryTotals: { [key: string]: number } = {};
    data.forEach((transaction) => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));

    setExpenseData(chartData);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchExpenseData();
  }, [fetchExpenseData]);

  return {
    expenseData,
    loading,
    fetchExpenseData,
  };
};