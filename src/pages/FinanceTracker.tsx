"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BudgetManager from '@/components/BudgetManager';
import TransactionManager from '@/components/TransactionManager';
import FinancialSummary from '@/components/FinancialSummary';

const FinanceTracker = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Controle Financeiro</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos Hábitos
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <FinancialSummary />
        <div className="grid gap-8 md:grid-cols-2">
          {/* Budgets Section */}
          <BudgetManager />

          {/* Transactions Section */}
          <TransactionManager />
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default FinanceTracker;