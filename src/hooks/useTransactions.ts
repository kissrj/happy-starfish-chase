"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  created_at: string;
}

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showError('Failed to load transactions.');
      console.error(error);
    } else {
      setTransactions(data || []);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at'>) => {
    if (!user) {
      showError("You must be logged in to add a transaction.");
      return;
    }

    const { error } = await supabase.from('transactions').insert({
      ...transactionData,
      user_id: user.id,
    });

    if (error) {
      showError("Failed to add transaction.");
      console.error(error);
      return false;
    } else {
      showSuccess("Transaction added successfully!");
      fetchTransactions();
      return true;
    }
  };

  return {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
  };
};