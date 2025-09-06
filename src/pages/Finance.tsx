"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { AddBudgetDialog } from "@/components/AddBudgetDialog";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { showError } from "@/utils/toast";

interface Budget {
  id: string;
  category: string;
  amount: number;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  created_at: string;
}

const Finance = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const fetchBudgets = supabase.from("budgets").select("*").order("created_at", { ascending: false });
    const fetchTransactions = supabase.from("transactions").select("*").order("created_at", { ascending: false });

    const [budgetsResult, transactionsResult] = await Promise.all([fetchBudgets, fetchTransactions]);

    if (budgetsResult.error) {
      showError("Falha ao carregar os orçamentos.");
      console.error(budgetsResult.error);
    } else {
      setBudgets(budgetsResult.data);
    }

    if (transactionsResult.error) {
      showError("Falha ao carregar as transações.");
      console.error(transactionsResult.error);
    } else {
      setTransactions(transactionsResult.data);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderBudgets = () => {
    if (loading) {
      return <Skeleton className="h-40 w-full" />;
    }
    if (budgets.length === 0) {
      return <p className="text-center text-muted-foreground py-8">Nenhum orçamento definido.</p>;
    }
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => (
          <Card key={budget.id}>
            <CardHeader>
              <CardTitle>{budget.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(budget.amount)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderTransactions = () => {
    if (loading) {
      return <Skeleton className="h-60 w-full" />;
    }
    if (transactions.length === 0) {
      return <p className="text-center text-muted-foreground py-8">Nenhuma transação registrada.</p>;
    }
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium">{tx.description}</TableCell>
                <TableCell>{tx.category}</TableCell>
                <TableCell>{formatDate(tx.created_at)}</TableCell>
                <TableCell className={`text-right font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Controle Financeiro</h1>
        </div>
        <Tabs defaultValue="transactions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="mt-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Suas Transações</CardTitle>
                  <CardDescription>Acompanhe suas receitas e despesas.</CardDescription>
                </div>
                <AddTransactionDialog onTransactionAdded={fetchData} />
              </CardHeader>
              <CardContent>
                {renderTransactions()}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="budgets" className="mt-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Seus Orçamentos</CardTitle>
                  <CardDescription>Defina limites de gastos por categoria.</CardDescription>
                </div>
                <AddBudgetDialog onBudgetAdded={fetchData} />
              </CardHeader>
              <CardContent>
                {renderBudgets()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Finance;