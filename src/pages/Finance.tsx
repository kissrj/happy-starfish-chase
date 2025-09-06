"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BudgetManager from '@/components/BudgetManager';
import TransactionManager from '@/components/TransactionManager';
import ExpenseChart from '@/components/ExpenseChart';

const FinancePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Controle Financeiro</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Hábitos
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
            <TabsTrigger value="analysis">Análise</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <TransactionManager />
          </TabsContent>
          <TabsContent value="budgets">
            <BudgetManager />
          </TabsContent>
          <TabsContent value="analysis">
            <ExpenseChart />
          </TabsContent>
        </Tabs>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default FinancePage;