"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

interface FinancialSummaryData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

const FinancialSummary = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinancialSummary = useCallback(async () => {
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
      showError('Failed to load income.');
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
      showError('Failed to load expenses.');
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
    fetchFinancialSummary();
  }, [fetchFinancialSummary]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">$ {summary?.totalIncome.toFixed(2) || '0.00'}</div>
          <p className="text-xs text-muted-foreground">In the current month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">$ {summary?.totalExpenses.toFixed(2) || '0.00'}</div>
          <p className="text-xs text-muted-foreground">In the current month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${summary && summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            $ {summary?.netBalance.toFixed(2) || '0.00'}
          </div>
          <p className="text-xs text-muted-foreground">In the current month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;