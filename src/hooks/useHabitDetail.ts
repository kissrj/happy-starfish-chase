export interface HabitDetail {
  id: string;
  name: string;
  description: string | null;
  goal_type?: string;
  goal_target?: number;
  category?: string;
  completed_today: boolean;
}