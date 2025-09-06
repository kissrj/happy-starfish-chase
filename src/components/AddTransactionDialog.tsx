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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import { showError, showSuccess } from "@/utils/toast";

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

interface AddTransactionDialogProps {
  onTransactionAdded: () => void;
  budgets: { category: string }[];
}

export const AddTransactionDialog = ({ onTransactionAdded, budgets }: AddTransactionDialogProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
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

    const { error } = await supabase.from('transactions').insert({
      ...transactionData,
      category: finalCategory,
      user_id: user.id,
    });

    if (error) {
      showError("Falha ao adicionar a transação.");
      console.error(error);
    } else {
      showSuccess("Transação adicionada com sucesso!");
      onTransactionAdded();
      form.reset();
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
                    <Input placeholder="Ex: Café da manhã, Salário" {...field} />
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