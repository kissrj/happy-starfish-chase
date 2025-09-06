"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  goal_type: 'daily' | 'weekly' | 'monthly';
  goal_target: number;
  reminder_time?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  benefits: string[];
  estimated_time: number; // in minutes
  tags: string[];
  is_popular: boolean;
  success_rate: number; // percentage
}

export const useHabitTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<HabitTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const habitTemplates: HabitTemplate[] = [
    // Health Category
    {
      id: 'drink-water',
      name: 'Beber 8 copos de água',
      description: 'Manter-se hidratado é essencial para a saúde e energia.',
      category: 'Saúde',
      goal_type: 'daily',
      goal_target: 8,
      difficulty: 'easy',
      estimated_time: 5,
      benefits: ['Melhora a energia', 'Ajuda na digestão', 'Reduz dores de cabeça'],
      tags: ['hidratação', 'saúde', 'bem-estar'],
      is_popular: true,
      success_rate: 85
    },
    {
      id: 'morning-walk',
      name: 'Caminhada matinal',
      description: 'Uma caminhada de 30 minutos pela manhã para começar o dia bem.',
      category: 'Saúde',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '07:00',
      difficulty: 'easy',
      estimated_time: 30,
      benefits: ['Melhora o humor', 'Aumenta a energia', 'Reduz o estresse'],
      tags: ['exercício', 'manhã', 'natureza'],
      is_popular: true,
      success_rate: 78
    },
    {
      id: 'meditation',
      name: 'Meditação diária',
      description: '10 minutos de meditação para clareza mental e redução do estresse.',
      category: 'Bem-estar',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '08:00',
      difficulty: 'medium',
      estimated_time: 10,
      benefits: ['Reduz ansiedade', 'Melhora foco', 'Aumenta bem-estar'],
      tags: ['mente', 'calma', 'foco'],
      is_popular: true,
      success_rate: 72
    },
    {
      id: 'strength-training',
      name: 'Treino de força',
      description: 'Sessão de musculação 3x por semana para ganho de força e saúde.',
      category: 'Saúde',
      goal_type: 'weekly',
      goal_target: 3,
      difficulty: 'hard',
      estimated_time: 60,
      benefits: ['Aumenta força muscular', 'Melhora densidade óssea', 'Acelera metabolismo'],
      tags: ['academia', 'força', 'musculação'],
      is_popular: false,
      success_rate: 65
    },

    // Productivity Category
    {
      id: 'read-30-min',
      name: 'Ler por 30 minutos',
      description: 'Dedicar tempo diário para leitura e aprendizado contínuo.',
      category: 'Aprendizado',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '20:00',
      difficulty: 'medium',
      estimated_time: 30,
      benefits: ['Expande conhecimento', 'Melhora vocabulário', 'Reduz estresse'],
      tags: ['leitura', 'aprendizado', 'conhecimento'],
      is_popular: true,
      success_rate: 76
    },
    {
      id: 'plan-day',
      name: 'Planejar o dia',
      description: 'Criar uma lista de tarefas e prioridades para o dia.',
      category: 'Produtividade',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '06:30',
      difficulty: 'easy',
      estimated_time: 15,
      benefits: ['Melhora organização', 'Reduz procrastinação', 'Aumenta produtividade'],
      tags: ['planejamento', 'organização', 'produtividade'],
      is_popular: true,
      success_rate: 82
    },
    {
      id: 'no-phone-hour',
      name: '1 hora sem celular',
      description: 'Tempo dedicado sem distrações digitais para foco e criatividade.',
      category: 'Produtividade',
      goal_type: 'daily',
      goal_target: 1,
      difficulty: 'medium',
      estimated_time: 60,
      benefits: ['Melhora concentração', 'Reduz ansiedade', 'Aumenta criatividade'],
      tags: ['foco', 'criatividade', 'digital detox'],
      is_popular: false,
      success_rate: 68
    },
    {
      id: 'learn-new-skill',
      name: 'Aprender nova habilidade',
      description: 'Dedicar tempo para aprender algo novo, como um idioma ou instrumento.',
      category: 'Aprendizado',
      goal_type: 'weekly',
      goal_target: 3,
      difficulty: 'medium',
      estimated_time: 45,
      benefits: ['Expande habilidades', 'Mantém mente ativa', 'Aumenta confiança'],
      tags: ['aprendizado', 'habilidades', 'crescimento'],
      is_popular: false,
      success_rate: 71
    },

    // Finance Category
    {
      id: 'track-expenses',
      name: 'Acompanhar gastos',
      description: 'Registrar todas as despesas do dia para controle financeiro.',
      category: 'Finanças',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '22:00',
      difficulty: 'easy',
      estimated_time: 10,
      benefits: ['Melhora controle financeiro', 'Identifica gastos desnecessários', 'Ajuda a economizar'],
      tags: ['finanças', 'controle', 'economia'],
      is_popular: true,
      success_rate: 79
    },
    {
      id: 'save-money',
      name: 'Guardar dinheiro',
      description: 'Separar uma quantia diária para poupança ou investimento.',
      category: 'Finanças',
      goal_type: 'daily',
      goal_target: 1,
      difficulty: 'medium',
      estimated_time: 5,
      benefits: ['Constrói patrimônio', 'Cria segurança financeira', 'Desenvolve disciplina'],
      tags: ['poupança', 'investimento', 'disciplina'],
      is_popular: false,
      success_rate: 63
    },
    {
      id: 'budget-review',
      name: 'Revisar orçamento semanal',
      description: 'Analisar gastos da semana e ajustar orçamento conforme necessário.',
      category: 'Finanças',
      goal_type: 'weekly',
      goal_target: 1,
      difficulty: 'medium',
      estimated_time: 20,
      benefits: ['Melhora planejamento financeiro', 'Identifica oportunidades de economia', 'Mantém controle'],
      tags: ['orçamento', 'análise', 'planejamento'],
      is_popular: false,
      success_rate: 74
    },

    // Relationships Category
    {
      id: 'call-family',
      name: 'Ligar para um familiar',
      description: 'Manter contato com familiares próximos regularmente.',
      category: 'Relacionamentos',
      goal_type: 'weekly',
      goal_target: 2,
      difficulty: 'easy',
      estimated_time: 15,
      benefits: ['Fortalece laços familiares', 'Reduz solidão', 'Melhora comunicação'],
      tags: ['família', 'relacionamentos', 'comunicação'],
      is_popular: false,
      success_rate: 69
    },
    {
      id: 'gratitude-note',
      name: 'Nota de gratidão',
      description: 'Escrever uma nota de gratidão para alguém especial.',
      category: 'Relacionamentos',
      goal_type: 'weekly',
      goal_target: 1,
      difficulty: 'easy',
      estimated_time: 10,
      benefits: ['Aumenta empatia', 'Melhora relacionamentos', 'Promove positividade'],
      tags: ['gratidão', 'positividade', 'relacionamentos'],
      is_popular: false,
      success_rate: 77
    },
    {
      id: 'quality-time',
      name: 'Tempo de qualidade',
      description: 'Dedicar tempo focado para estar presente com entes queridos.',
      category: 'Relacionamentos',
      goal_type: 'daily',
      goal_target: 1,
      difficulty: 'easy',
      estimated_time: 30,
      benefits: ['Fortalece vínculos', 'Melhora comunicação', 'Cria memórias'],
      tags: ['presença', 'qualidade', 'relacionamentos'],
      is_popular: false,
      success_rate: 73
    },

    // Creativity Category
    {
      id: 'write-journal',
      name: 'Escrever no diário',
      description: 'Registrar pensamentos, experiências e reflexões diárias.',
      category: 'Criatividade',
      goal_type: 'daily',
      goal_target: 1,
      reminder_time: '21:00',
      difficulty: 'easy',
      estimated_time: 15,
      benefits: ['Melhora auto-conhecimento', 'Processa emoções', 'Desenvolve escrita'],
      tags: ['escrita', 'reflexão', 'auto-conhecimento'],
      is_popular: false,
      success_rate: 75
    },
    {
      id: 'creative-project',
      name: 'Projeto criativo',
      description: 'Trabalhar em um projeto pessoal criativo, como arte ou música.',
      category: 'Criatividade',
      goal_type: 'weekly',
      goal_target: 2,
      difficulty: 'medium',
      estimated_time: 60,
      benefits: ['Desenvolve criatividade', 'Reduz estresse', 'Aumenta satisfação'],
      tags: ['arte', 'criatividade', 'expressão'],
      is_popular: false,
      success_rate: 67
    },
    {
      id: 'mindful-observation',
      name: 'Observação consciente',
      description: 'Passar 10 minutos observando a natureza ou o ambiente com atenção plena.',
      category: 'Bem-estar',
      goal_type: 'daily',
      goal_target: 1,
      difficulty: 'easy',
      estimated_time: 10,
      benefits: ['Reduz estresse', 'Aumenta mindfulness', 'Melhora apreciação'],
      tags: ['mindfulness', 'natureza', 'presença'],
      is_popular: false,
      success_rate: 80
    }
  ];

  const createHabitFromTemplate = useCallback(async (template: HabitTemplate) => {
    if (!user) {
      showError("Você precisa estar logado para adicionar um hábito.");
      return false;
    }

    setLoading(true);
    const { error } = await supabase
      .from("habits")
      .insert([{
        name: template.name,
        description: template.description,
        category: template.category,
        goal_type: template.goal_type,
        goal_target: template.goal_target,
        reminder_time: template.reminder_time,
        user_id: user.id
      }]);

    setLoading(false);

    if (error) {
      showError("Falha ao adicionar o hábito do modelo.");
      console.error(error);
      return false;
    } else {
      showSuccess(`Hábito "${template.name}" adicionado com sucesso!`);
      return true;
    }
  }, [user]);

  const getTemplatesByCategory = useCallback((category: string) => {
    return habitTemplates.filter(template => template.category === category);
  }, []);

  const getPopularTemplates = useCallback(() => {
    return habitTemplates.filter(template => template.is_popular);
  }, []);

  const getTemplatesByDifficulty = useCallback((difficulty: string) => {
    return habitTemplates.filter(template => template.difficulty === difficulty);
  }, []);

  const searchTemplates = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return habitTemplates.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, []);

  return {
    templates: habitTemplates,
    loading,
    createHabitFromTemplate,
    getTemplatesByCategory,
    getPopularTemplates,
    getTemplatesByDifficulty,
    searchTemplates,
  };
};