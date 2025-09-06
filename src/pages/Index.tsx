"use client";

import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Rastreador de Hábitos</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">Sair</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Bem-vindo ao seu Painel!</h2>
          <p className="text-lg text-gray-600">
            Em breve, você poderá adicionar e rastrear seus hábitos aqui.
          </p>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;