"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

const budgetSchema = z.object({
  category: z.string().min(1, "A categoria é obrigatória."),
  amount: z.coerce.number().positive("O valor deve ser positivo."),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface EditBudgetDialogProps {
  budget: {
    id: string;
    category: string;
    amount: number;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBudgetUpdated: () => void;
}

export const EditBudgetDialog = ({ budget, open, onOpenChange, onBudgetUpdated }: EditBudgetDialogProps) => {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "",
      amount: 0,
    },
  });

  useEffect(() => {
    if (budget) {
      form.reset({
        category: budget.category,
        amount: budget.amount,
      });
    }
  }, [budget, form]);

  const onSubmit = async (data: BudgetFormValues) => {
    if (!budget) return;

    const { error } = await supabase
      .from("budgets")
      .update({ category: data.category, amount: data.amount })
      .eq("id", budget.id);

    if (error) {
      showError("Ocorreu um erro ao atualizar o orçamento.");
      console.error(error);
    } else {
      showSuccess("Orçamento atualizado com sucesso!");
      onBudgetUpdated();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Orçamento</DialogTitle>
          <DialogDescription>
            Faça alterações no seu orçamento aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
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
              {form.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};