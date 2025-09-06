"use client";

import { useState } from "react";
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
import { useAuth } from "@/context/AuthProvider";
import { showSuccess, showError } from "@/utils/toast";
import { PlusCircle } from "lucide-react";
import { requestNotificationPermission } from "@/utils/notifications";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHabitTemplates } from "@/hooks/useHabitTemplates";
import { HabitTemplatesGrid } from "@/components/HabitTemplatesGrid";
import { HabitTemplate } from "@/hooks/useHabitTemplates";

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

interface AddHabitDialogProps {
  onHabitAdded: () => void;
}

const AddHabitDialog = ({ onHabitAdded }: AddHabitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null);
  const { user } = useAuth();
  const { templates, createHabitFromTemplate } = useHabitTemplates();

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      description: "",
      reminder_time: "",
      goal_type: "none",
      goal_target: undefined,
      category: "",
    },
  });

  const onSubmit = async (data: HabitFormValues) => {
    if (!user) {
      showError("Você precisa estar logado para adicionar um hábito.");
      return;
    }

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
      .insert([{ ...data, user_id: user.id }]);

    if (error) {
      showError("Ocorreu um erro ao adicionar o hábito.");
      console.error(error);
    } else {
      showSuccess("Hábito adicionado com sucesso!");
      form.reset();
      setSelectedTemplate(null);
      onHabitAdded();
      setOpen(false);
    }
  };

  const handleTemplateSelect = (template: HabitTemplate) => {
    setSelectedTemplate(template);
    form.reset({
      name: template.name,
      description: template.description,
      reminder_time: template.reminder_time || "",
      goal_type: template.goal_type,
      goal_target: template.goal_target,
      category: template.category,
    });
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return;

    const success = await createHabitFromTemplate(selectedTemplate);
    if (success) {
      setSelectedTemplate(null);
      onHabitAdded();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Hábito
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Hábito</DialogTitle>
          <DialogDescription>
            Escolha um modelo pré-configurado ou crie seu próprio hábito personalizado.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Modelos</TabsTrigger>
            <TabsTrigger value="custom">Personalizado</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <HabitTemplatesGrid
              templates={templates}
              onSelectTemplate={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
            />

            {selectedTemplate && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateFromTemplate}>
                  Criar Hábito
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
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
                    {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;