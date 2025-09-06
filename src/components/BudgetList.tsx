"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Budget } from '@/hooks/useBudgets';

interface BudgetListProps {
  budgets: Budget[];
  loading: boolean;
  onEditBudget: (budget: Budget) => void;
  onDeleteBudget: (budget: Budget) => void;
}

const BudgetList = ({ budgets, loading, onEditBudget, onDeleteBudget }: BudgetListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Nenhum orçamento encontrado</h2>
        <p className="text-gray-600">
          Adicione orçamentos para acompanhar seus gastos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {budgets.map((budget) => {
        const progress = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
        const spentFormatted = budget.spent.toFixed(2);
        const amountFormatted = budget.amount.toFixed(2);
        const progressColor = progress > 100 ? 'bg-red-600' : 'bg-primary';

        return (
          <div key={budget.id}>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold">{budget.category}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  R$ {spentFormatted} / R$ {amountFormatted}
                </p>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditBudget(budget)}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Editar Orçamento</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDeleteBudget(budget)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir Orçamento</span>
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" indicatorClassName={progressColor} />
            {progress > 100 && (
              <p className="text-xs text-red-600 mt-1">Você ultrapassou o orçamento!</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BudgetList;