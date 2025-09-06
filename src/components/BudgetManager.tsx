"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { showError, showSuccess } from '@/utils/toast';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { EditBudgetDialog } from './EditBudgetDialog';

const budgetSchema = z.object({
  category: z.string().min(1, "A categoria é obrigatória."),
  amount: z.coerce.number().positive("O valor deve ser positivo."),
});
type BudgetFormValues = z.infer<typeof budgetSchema>;

const AddBudgetDialog = ({ onBudgetAdded }: { onBudgetAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "",
      amount: 0,
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    if (!user) {
      showError("Você precisa estar logado para adicionar um orçamento.");
      return;
    }

    const { error } = await supabase
      .from("budgets")
      .insert([{ ...data, user_id: user.id }]);

    if (error) {
      showError("Ocorreu um erro ao adicionar o orçamento.");
      console.error(error);
    } else {
      showSuccess("Orçamento adicionado com sucesso!");
      form.reset();
      onBudgetAdded();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Orçamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Orçamento</DialogTitle>
          <DialogDescription>
            Defina um novo orçamento para uma categoria.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Alimentação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Orçamento</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Ex: 500.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface Budget {
  id: string;
  category: string;
  amount: number;
}

interface BudgetWithSpent extends Budget {
    spent: number;
}

const BudgetManager = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<BudgetWithSpent[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgetToDelete, setBudgetToDelete] = useState<BudgetWithSpent | null>(null);

  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: budgetsData, error: budgetsError } = await supabase
      .from('budgets')
      .select('*');

    if (budgetsError) {
      showError('Falha ao carregar os orçamentos.');
      setLoading(false);
      return;
    }

    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();

    const budgetsWithSpent = await Promise.all(
        (budgetsData || []).map(async (budget) => {
            const { data: transactionsData, error: transactionsError } = await supabase
                .from('transactions')
                .select('amount')
                .eq('user_id', user.id)
                .eq('category', budget.category)
                .eq('type', 'expense')
                .gte('created_at', firstDayOfMonth)
                .lte('created_at', lastDayOfMonth);
            
            if (transactionsError) {
                console.error(`Error fetching transactions for ${budget.category}`, transactionsError);
                return { ...budget, spent: 0 };
            }

            const spent = (transactionsData || []).reduce((sum, t) => sum + t.amount, 0);
            return { ...budget, spent };
        })
    );

    setBudgets(budgetsWithSpent);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleDeleteBudget = async () => {
    if (!budgetToDelete) return;

    const { error } = await supabase.from('budgets').delete().match({ id: budgetToDelete.id });

    if (error) {
      showError("Falha ao excluir o orçamento.");
    } else {
      showSuccess("Orçamento excluído com sucesso.");
      fetchBudgets();
    }
    setBudgetToDelete(null);
  };

  const renderContent = () => {
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
            Clique em "Adicionar Orçamento" para começar a planejar.
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
                          <EditBudgetDialog budget={budget} onBudgetUpdated={fetchBudgets} />
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setBudgetToDelete(budget)}>
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
            )
        })}
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Orçamentos do Mês</CardTitle>
            <CardDescription>Acompanhe seus gastos em relação aos seus orçamentos.</CardDescription>
          </div>
          <AddBudgetDialog onBudgetAdded={fetchBudgets} />
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      <AlertDialog open={!!budgetToDelete} onOpenChange={() => setBudgetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o orçamento para "{budgetToDelete?.category}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBudget} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BudgetManager;