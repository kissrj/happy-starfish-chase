"use client";

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Budgets Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Orçamentos</CardTitle>
                <CardDescription>Defina e acompanhe seus orçamentos por categoria.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">O gerenciamento de orçamentos estará disponível em breve.</p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Transações</CardTitle>
                <CardDescription>Registre suas receitas e despesas.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">O gerenciamento de transações estará disponível em breve.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default FinanceTracker;