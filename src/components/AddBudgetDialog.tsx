"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showError, showSuccess } from "@/utils/toast";
import { PlusCircle } from "lucide-react";

const budgetSchema = z.object({
  category: z.string().min(1, "A categoria é obrigatória."),
  amount: z.coerce.number().positive("O valor deve ser positivo."),
});

interface AddBudgetDialogProps {
  onBudgetAdded: () => void;
}

export const AddBudgetDialog = ({ onBudgetAdded }: AddBudgetDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "",
      amount: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof budgetSchema>) => {
    if (!user) {
      showError("Você precisa estar logado para adicionar um orçamento.");
      return;
    }

    const { error } = await supabase.from("budgets").insert({
      ...values,
      user_id: user.id,
    });

    if (error) {
      showError("Falha ao adicionar o orçamento.");
      console.error(error);
    } else {
      showSuccess("Orçamento adicionado com sucesso!");
      onBudgetAdded();
      form.reset();
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
            Defina um novo orçamento para uma categoria de despesas.
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
                    <Input placeholder="Ex: Alimentação, Transporte" {...field} />
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
                    <Input type="number" placeholder="Ex: 500" {...field} />
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