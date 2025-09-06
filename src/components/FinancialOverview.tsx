"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

interface FinancialOverviewData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

const FinancialOverview = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinancialOverview = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

    // Fetch income
    const { data: incomeData, error: incomeError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('type', 'income')
      .gte('created_at', firstDayOfMonth)
      .lte('created_at', lastDayOfMonth);

    if (incomeError) {
      showError('Falha ao carregar receitas.');
      console.error(incomeError);
      setLoading(false);
      return;
    }

    const totalIncome = incomeData.reduce((sum, transaction) => sum + transaction.amount, 0);

    // Fetch expenses
    const { data: expenseData, error: expenseError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('type', 'expense')
      .gte('created_at', firstDayOfMonth)
      .lte('created_at', lastDayOfMonth);

    if (expenseError) {
      showError('Falha ao carregar despesas.');
      console.error(expenseError);
      setLoading(false);
      return;
    }

    const totalExpenses = expenseData.reduce((sum, transaction) => sum + transaction.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    setSummary({ totalIncome, totalExpenses, netBalance });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFinancialOverview();
  }, [fetchFinancialOverview]);

  if (loading) {
    return (
      <Card className="col-span-full md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Visão Geral Financeira</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Visão Geral Financeira</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm">Receita</span>
          </div>
          <span className="text-sm font-medium text-green-600">R$ {summary?.totalIncome.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-sm">Despesas</span>
          </div>
          <span className="text-sm font-medium text-red-600">R$ {summary?.totalExpenses.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Saldo</span>
          </div>
          <span className={`text-sm font-bold ${summary && summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {summary?.netBalance.toFixed(2) || '0.00'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;