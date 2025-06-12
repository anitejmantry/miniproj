export interface UserProfile {
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  goal: 'muscle_gain' | 'strength_gain' | 'stamina_gain' | 'fat_loss';
  gender: 'male' | 'female';
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: Exercise[];
  completed: boolean;
  fitcoins: number;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restTime: string;
}

export interface DietPlan {
  id: string;
  meals: Meal[];
  completed: boolean;
  fitcoins: number;
}

export interface Meal {
  name: string;
  time: string;
  foods: string[];
  calories: number;
}

export interface WaterGoal {
  target: number; // in liters
  current: number;
  completed: boolean;
  fitcoins: number;
}

export interface SleepGoal {
  target: number; // in hours
  actual: number;
  completed: boolean;
  fitcoins: number;
}

export interface UserStats {
  totalFitcoins: number;
  streak: number;
  level: number;
  completedTasks: number;
}