"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/utils/exportData';
import { format } from 'date-fns';
import TransactionTable from '@/components/TransactionTable';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';

const TransactionManager = () => {
  const { user } = useAuth();
  const { transactions, loading: transactionsLoading, fetchTransactions } = useTransactions();
  const { budgets, loading: budgetsLoading } = useBudgets();

  const handleExportTransactions = () => {
    const exportData = transactions.map(t => ({
      Date: format(new Date(t.created_at), 'MM/dd/yyyy'),
      Description: t.description,
      Category: t.category,
      Type: t.type === 'income' ? 'Income' : 'Expense',
      Amount: t.amount.toFixed(2),
    }));
    exportToCSV(exportData, `transactions_${format(new Date(), 'yyyy-MM-dd')}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Track your income and expenses.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportTransactions} disabled={transactions.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <AddTransactionDialog onTransactionAdded={fetchTransactions} budgets={budgets} />
        </div>
      </CardHeader>
      <CardContent>
        <TransactionTable transactions={transactions} loading={transactionsLoading || budgetsLoading} />
      </CardContent>
    </Card>
  );
};

export default TransactionManager;