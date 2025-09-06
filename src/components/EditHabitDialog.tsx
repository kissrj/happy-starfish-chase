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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Pencil } from "lucide-react";
import { requestNotificationPermission } from "@/utils/notifications";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const habitSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  description: z.string().optional(),
  reminder_time: z.string().optional(),
  goal_type: z.enum(["none", "daily", "weekly", "monthly"], { required_error: "Selecione um tipo de meta." }),
  goal_target: z.coerce.number().optional(),
  category: z.string().min(1, "A categoria é obrigatória."),
}).superRefine((data, ctx) => {
  if (data.goal_type !== "none" && (!data.goal_target || data.goal_target <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Defina um alvo válido para a meta.",
      path: ["goal_target"],
    });
  }
});

type HabitFormValues = z.infer<typeof habitSchema>;

interface EditHabitDialogProps {
  habit: {
    id: string;
    name: string;
    description: string | null;
    reminder_time?: string;
    goal_type?: string;
    goal_target?: number;
    category?: string;
  };
  onHabitUpdated: () => void;
}

export const EditHabitDialog = ({ habit, onHabitUpdated }: EditHabitDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit.name,
      description: habit.description || "",
      reminder_time: habit.reminder_time || "",
      goal_type: (habit.goal_type as "none" | "daily" | "weekly" | "monthly") || "none",
      goal_target: habit.goal_target || undefined,
      category: habit.category || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: habit.name,
      description: habit.description || "",
      reminder_time: habit.reminder_time || "",
      goal_type: (habit.goal_type as "none" | "daily" | "weekly" | "monthly") || "none",
      goal_target: habit.goal_target || undefined,
      category: habit.category || "",
    });
  }, [habit, form]);

  const onSubmit = async (data: HabitFormValues) => {
    // Request notification permission if reminder is set
    if (data.reminder_time) {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        showError("Permissão para notificações negada. O lembrete não será configurado.");
        // Continue without reminder
        data.reminder_time = undefined;
      }
    }

    const { error } = await supabase
      .from("habits")
      .update({ name: data.name, description: data.description, reminder_time: data.reminder_time, goal_type: data.goal_type, goal_target: data.goal_target, category: data.category })
      .eq("id", habit.id);

    if (error) {
      showError("Ocorreu um erro ao atualizar o hábito.");
      console.error(error);
    } else {
      showSuccess("Hábito atualizado com sucesso!");
      onHabitUpdated();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Editar Hábito
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Hábito</DialogTitle>
          <DialogDescription>
            Faça alterações no seu hábito aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Hábito</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ler 10 páginas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Ler um livro de ficção por 15 minutos."
                      {...field}
                    />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Saúde">Saúde</SelectItem>
                      <SelectItem value="Produtividade">Produtividade</SelectItem>
                      <SelectItem value="Aprendizado">Aprendizado</SelectItem>
                      <SelectItem value="Finanças">Finanças</SelectItem>
                      <SelectItem value="Relacionamentos">Relacionamentos</SelectItem>
                      <SelectItem value="Criatividade">Criatividade</SelectItem>
                      <SelectItem value="Bem-estar">Bem-estar</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reminder_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora do Lembrete (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      placeholder="Ex: 09:00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Meta (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo de meta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma meta</SelectItem>
                      <SelectItem value="daily">Diária</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("goal_type") !== "none" && (
              <FormField
                control={form.control}
                name="goal_target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Meta de Conclusões ({form.watch("goal_type") === "daily" ? "por dia" : form.watch("goal_type") === "weekly" ? "por semana" : "por mês"})
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Ex: 5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};