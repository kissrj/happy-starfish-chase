"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const transactionSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória."),
  amount: z.coerce.number().positive("O valor deve ser positivo."),
  type: z.enum(["income", "expense"], { required_error: "O tipo é obrigatório." }),
  category: z.string().min(1, "A categoria é obrigatória."),
  newCategoryName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.category === "Outra" && (!data.newCategoryName || data.newCategoryName.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Por favor, insira o nome da nova categoria.",
      path: ["newCategoryName"],
    });
  }
});
type TransactionFormValues = z.infer<typeof transactionSchema>;

const AddTransactionDialog = ({ onTransactionAdded, budgets }: { onTransactionAdded: () => void; budgets: { category: string }[] }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
      category: "",
      newCategoryName: "",
    },
  });

  const onSubmit = async (data: TransactionFormValues) => {
    if (!user) {
      showError("Você precisa estar logado para adicionar uma transação.");
      return;
    }

    let finalCategory = data.category;
    if (data.category === "Outra") {
      finalCategory = data.newCategoryName!; // Use the new category name
      // Add the new category to the budgets table
      const { error: budgetInsertError } = await supabase
        .from("budgets")
        .insert([{ user_id: user.id, category: finalCategory, amount: 0 }]); // amount can be 0 or some default
      if (budgetInsertError) {
        console.error("Erro ao adicionar nova categoria aos orçamentos:", budgetInsertError);
        showError("Ocorreu um erro ao adicionar a nova categoria.");
        return; // Prevent transaction from being added if category fails
      }
    }

    const { newCategoryName, ...transactionData } = data; // Destructure newCategoryName to exclude it

    const { error } = await supabase
      .from("transactions")
      .insert([{ ...transactionData, category: finalCategory, user_id: user.id }]);

    if (error) {
      showError("Ocorreu um erro ao adicionar a transação.");
      console.error(error);
    } else {
      showSuccess("Transação adicionada com sucesso!");
      form.reset();
      onTransactionAdded();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Transação</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da sua nova transação.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Café da manhã" {...field} />
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
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Ex: 15.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Despesa</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Receita</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    if (value !== "Outra") {
                      form.setValue("newCategoryName", ""); // Clear newCategoryName if not "Outra"
                    }
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {budgets.map(budget => (
                        <SelectItem key={budget.category} value={budget.category}>{budget.category}</SelectItem>
                      ))}
                       <SelectItem value="Outra">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("category") === "Outra" && (
              <FormField
                control={form.control}
                name="newCategoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Nova Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Lazer, Educação" {...field} />
                    </FormControl>
                    <FormDescription>
                      Esta categoria será adicionada para uso futuro.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  created_at: string;
}

interface Budget {
    category: string;
}

const TransactionManager = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (transactionsError) {
      showError('Falha ao carregar as transações.');
    } else {
      setTransactions(transactionsData || []);
    }

    const { data: budgetsData, error: budgetsError } = await supabase
      .from('budgets')
      .select('category');

    if (budgetsError) {
        showError('Falha ao carregar os orçamentos.');
    } else {
        setBudgets(budgetsData || []);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Nenhuma transação encontrada</h2>
          <p className="text-gray-600">
            Clique em "Adicionar Transação" para começar.
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className="text-right">
                <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'} className={transaction.type === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}>
                  {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{format(new Date(transaction.created_at), 'dd/MM/yyyy')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Acompanhe suas receitas e despesas.</CardDescription>
        </div>
        <AddTransactionDialog onTransactionAdded={fetchData} budgets={budgets} />
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default TransactionManager;