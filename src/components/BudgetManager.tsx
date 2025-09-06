"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { showError, showSuccess } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import BudgetList from '@/components/BudgetList';
import { AddBudgetDialog } from '@/components/AddBudgetDialog';
import { EditBudgetDialog } from '@/components/EditBudgetDialog';
import { useBudgets, Budget } from '@/hooks/useBudgets';

const BudgetManager = () => {
  const { budgets, loading, fetchBudgets, addBudget, updateBudget, deleteBudget } = useBudgets();
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleAddBudget = async (budgetData: Omit<Budget, 'id' | 'spent'>) => {
    await addBudget(budgetData);
  };

  const handleEditBudget = (budget: Budget) => {
    setBudgetToEdit(budget);
    setEditDialogOpen(true);
  };

  const handleUpdateBudget = async () => {
    if (!budgetToEdit) return;
    // The update logic is handled in the EditBudgetDialog component
    fetchBudgets();
  };

  const handleDeleteBudget = async () => {
    if (!budgetToDelete) return;

    const success = await deleteBudget(budgetToDelete.id);
    if (success) {
      setBudgetToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Budgets</CardTitle>
            <CardDescription>Track your spending against your budgets.</CardDescription>
          </div>
          <AddBudgetDialog onBudgetAdded={() => {}} />
        </CardHeader>
        <CardContent>
          <BudgetList
            budgets={budgets}
            loading={loading}
            onEditBudget={handleEditBudget}
            onDeleteBudget={setBudgetToDelete}
          />
        </CardContent>
      </Card>

      <EditBudgetDialog
        budget={budgetToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onBudgetUpdated={handleUpdateBudget}
      />

      <AlertDialog open={!!budgetToDelete} onOpenChange={() => setBudgetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the budget for "{budgetToDelete?.category}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBudget} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BudgetManager;