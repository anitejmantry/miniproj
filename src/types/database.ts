export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          age: number;
          height: number;
          weight: number;
          goal: 'muscle_gain' | 'strength_gain' | 'stamina_gain' | 'fat_loss';
          gender: 'male' | 'female';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          age: number;
          height: number;
          weight: number;
          goal: 'muscle_gain' | 'strength_gain' | 'stamina_gain' | 'fat_loss';
          gender: 'male' | 'female';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          age?: number;
          height?: number;
          weight?: number;
          goal?: 'muscle_gain' | 'strength_gain' | 'stamina_gain' | 'fat_loss';
          gender?: 'male' | 'female';
          created_at?: string;
          updated_at?: string;
        };
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          total_fitcoins: number;
          streak: number;
          level: number;
          completed_tasks: number;
          last_activity_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_fitcoins?: number;
          streak?: number;
          level?: number;
          completed_tasks?: number;
          last_activity_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_fitcoins?: number;
          streak?: number;
          level?: number;
          completed_tasks?: number;
          last_activity_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_progress: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          workout_completed: boolean;
          diet_completed: boolean;
          water_completed: boolean;
          sleep_completed: boolean;
          water_current: number;
          water_target: number;
          sleep_actual: number;
          sleep_target: number;
          fitcoins_earned: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          workout_completed?: boolean;
          diet_completed?: boolean;
          water_completed?: boolean;
          sleep_completed?: boolean;
          water_current?: number;
          water_target?: number;
          sleep_actual?: number;
          sleep_target?: number;
          fitcoins_earned?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          workout_completed?: boolean;
          diet_completed?: boolean;
          water_completed?: boolean;
          sleep_completed?: boolean;
          water_current?: number;
          water_target?: number;
          sleep_actual?: number;
          sleep_target?: number;
          fitcoins_earned?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}