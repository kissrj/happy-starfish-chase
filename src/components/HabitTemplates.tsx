"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Target, Clock, TrendingUp } from 'lucide-react';

interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  goal_type: 'daily' | 'weekly' | 'monthly';
  goal_target: number;
  reminder_time?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  benefits: string[];
}

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
    benefits: ['Melhora a energia', 'Ajuda na digestão', 'Reduz dores de cabeça']
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
    benefits: ['Melhora o humor', 'Aumenta a energia', 'Reduz o estresse']
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
    benefits: ['Reduz ansiedade', 'Melhora foco', 'Aumenta bem-estar']
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
    benefits: ['Expande conhecimento', 'Melhora vocabulário', 'Reduz estresse']
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
    benefits: ['Melhora organização', 'Reduz procrastinação', 'Aumenta produtividade']
  },
  {
    id: 'no-phone-hour',
    name: '1 hora sem celular',
    description: 'Tempo dedicado sem distrações digitais para foco e criatividade.',
    category: 'Produtividade',
    goal_type: 'daily',
    goal_target: 1,
    difficulty: 'medium',
    benefits: ['Melhora concentração', 'Reduz ansiedade', 'Aumenta criatividade']
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
    benefits: ['Melhora controle financeiro', 'Identifica gastos desnecessários', 'Ajuda a economizar']
  },
  {
    id: 'save-money',
    name: 'Guardar dinheiro',
    description: 'Separar uma quantia diária para poupança ou investimento.',
    category: 'Finanças',
    goal_type: 'daily',
    goal_target: 1,
    difficulty: 'medium',
    benefits: ['Constrói patrimônio', 'Cria segurança financeira', 'Desenvolve disciplina']
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
    benefits: ['Fortalece laços familiares', 'Reduz solidão', 'Melhora comunicação']
  },
  {
    id: 'gratitude-note',
    name: 'Nota de gratidão',
    description: 'Escrever uma nota de gratidão para alguém especial.',
    category: 'Relacionamentos',
    goal_type: 'weekly',
    goal_target: 1,
    difficulty: 'easy',
    benefits: ['Aumenta empatia', 'Melhora relacionamentos', 'Promove positividade']
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
    benefits: ['Melhora auto-conhecimento', 'Processa emoções', 'Desenvolve escrita']
  },
  {
    id: 'learn-new-skill',
    name: 'Aprender nova habilidade',
    description: 'Dedicar tempo para aprender algo novo, como um idioma ou instrumento.',
    category: 'Aprendizado',
    goal_type: 'weekly',
    goal_target: 3,
    difficulty: 'medium',
    benefits: ['Expande habilidades', 'Mantém mente ativa', 'Aumenta confiança']
  }
];

interface HabitTemplatesProps {
  onSelectTemplate: (template: HabitTemplate) => void;
}

const HabitTemplates = ({ onSelectTemplate }: HabitTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [open, setOpen] = useState(false);

  const categories = ['all', ...Array.from(new Set(habitTemplates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'all'
    ? habitTemplates
    : habitTemplates.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Target className="mr-2 h-4 w-4" />
          Modelos de Hábitos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Modelos de Hábitos
          </DialogTitle>
          <DialogDescription>
            Escolha entre nossos modelos pré-configurados para começar rapidamente.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {categories.filter(cat => cat !== 'all').map(category => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
                      <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty === 'easy' ? 'Fácil' :
                         template.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {template.goal_type === 'daily' ? 'Diário' :
                         template.goal_type === 'weekly' ? 'Semanal' : 'Mensal'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Target className="h-3 w-3 text-primary" />
                        <span>Meta: {template.goal_target} {template.goal_type === 'daily' ? 'vezes/dia' :
                          template.goal_type === 'weekly' ? 'vezes/semana' : 'vezes/mês'}</span>
                      </div>
                      {template.reminder_time && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Lembrete: {template.reminder_time}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Benefícios:
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {template.benefits.slice(0, 2).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-primary mt-0.5">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button
                      onClick={() => {
                        onSelectTemplate(template);
                        setOpen(false);
                      }}
                      className="w-full"
                      size="sm"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Usar Este Modelo
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HabitTemplates;