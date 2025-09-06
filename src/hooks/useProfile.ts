"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (error) {
      showError('Falha ao carregar o perfil.');
      console.error(error);
    } else if (data) {
      setProfile({
        id: user.id,
        first_name: data.first_name,
        last_name: data.last_name,
        avatar_url: data.avatar_url,
      });
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      showError('Falha ao atualizar o perfil.');
      console.error(error);
    } else {
      showSuccess('Perfil atualizado com sucesso!');
      fetchProfile(); // Re-fetch to ensure data consistency
    }
    setIsUpdating(false);
  };

  return {
    profile,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    loading,
    isUpdating,
    handleUpdateProfile,
    fetchProfile,
  };
};