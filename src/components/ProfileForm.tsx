"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@supabase/supabase-js';

interface ProfileFormProps {
  user: User | null;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  loading: boolean;
  isUpdating: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileForm = ({
  user,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  loading,
  isUpdating,
  onSubmit
}: ProfileFormProps) => {
  if (loading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-28" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Seu Perfil</CardTitle>
        <CardDescription>Atualize suas informações pessoais.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">Primeiro Nome</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Seu primeiro nome"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Seu sobrenome"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? 'Atualizando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;