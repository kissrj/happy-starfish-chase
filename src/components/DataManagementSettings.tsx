"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, Trash2 } from 'lucide-react';
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
import { useState } from 'react';

interface DataManagementSettingsProps {
  onExportAllData: () => void;
  onDeleteAllData: () => void;
}

const DataManagementSettings = ({ onExportAllData, onDeleteAllData }: DataManagementSettingsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Gerenciamento de Dados
          </CardTitle>
          <CardDescription>
            Exporte ou exclua seus dados pessoais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exportar todos os dados</Label>
              <p className="text-sm text-muted-foreground">
                Baixe uma cópia de todos os seus dados em formato CSV.
              </p>
            </div>
            <Button variant="outline" onClick={onExportAllData}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-destructive">Excluir todos os dados</Label>
              <p className="text-sm text-muted-foreground">
                Exclua permanentemente todos os seus hábitos, transações e orçamentos.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Tudo
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Todos os Dados</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente todos os seus hábitos,
              transações, orçamentos e dados relacionados. Você tem certeza?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteAllData();
                setShowDeleteDialog(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DataManagementSettings;