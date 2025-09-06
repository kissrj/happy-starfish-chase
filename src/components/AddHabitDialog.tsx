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
import HabitTemplatesGrid from "@/components/HabitTemplatesGrid";
import { HabitTemplate } from "@/hooks/useHabitTemplates";

const habitSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().optional(),
  reminder_time: z.string().optional(),
  goal_type: z.enum(["none", "daily", "weekly", "monthly"], { required_error: "Please select a goal type." }),
  goal_target: z.coerce.number().optional(),
  category: z.string().min(1, "Category is required."),
}).superRefine((data, ctx) => {
  if (data.goal_type !== "none" && (!data.goal_target || data.goal_target <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please set a valid goal target.",
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
      showError("You must be logged in to add a habit.");
      return;
    }

    // Request notification permission if reminder is set
    if (data.reminder_time) {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        showError("Notification permission denied. The reminder will not be set.");
        // Continue without reminder
        data.reminder_time = undefined;
      }
    }

    const { error } = await supabase
      .from("habits")
      .insert([{ ...data, user_id: user.id }]);

    if (error) {
      showError("An error occurred while adding the habit.");
      console.error(error);
    } else {
      showSuccess("Habit added successfully!");
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
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
          <DialogDescription>
            Choose a pre-configured template or create your own custom habit.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
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
                  Cancel
                </Button>
                <Button onClick={handleCreateFromTemplate}>
                  Create Habit
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
                      <FormLabel>Habit Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Read 10 pages" {...field} />
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="E.g., Read a fiction book for 15 minutes."
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
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Productivity">Productivity</SelectItem>
                          <SelectItem value="Learning">Learning</SelectItem>
                          <SelectItem value="Finances">Finances</SelectItem>
                          <SelectItem value="Relationships">Relationships</SelectItem>
                          <SelectItem value="Creativity">Creativity</SelectItem>
                          <SelectItem value="Wellness">Wellness</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
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
                      <FormLabel>Reminder Time (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="E.g., 09:00"
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
                      <FormLabel>Goal Type (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a goal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No goal</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
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
                          Completion Goal ({form.watch("goal_type") === "daily" ? "per day" : form.watch("goal_type") === "weekly" ? "per week" : "per month"})
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="E.g., 5"
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
                    {form.formState.isSubmitting ? "Saving..." : "Save"}
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