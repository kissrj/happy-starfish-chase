"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User } from '@supabase/supabase-js';

interface AccountInformationProps {
  user: User | null;
}

const AccountInformation = ({ user }: AccountInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Conta</CardTitle>
        <CardDescription>
          Detalhes da sua conta atual.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Email</Label>
          <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
        </div>
        <div>
          <Label>ID do Usuário</Label>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{user?.id}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInformation;