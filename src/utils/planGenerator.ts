import { UserProfile, WorkoutPlan, DietPlan, WaterGoal, SleepGoal } from '../types';

export const generateWorkoutPlan = (profile: UserProfile): WorkoutPlan => {
  const plans = {
    muscle_gain: {
      name: 'Muscle Building Workout',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: '12-15', restTime: '60s' },
        { name: 'Squats', sets: 3, reps: '15-20', restTime: '60s' },
        { name: 'Dumbbell Rows', sets: 3, reps: '10-12', restTime: '90s' },
        { name: 'Plank', sets: 3, reps: '30-45s', restTime: '60s' },
        { name: 'Lunges', sets: 3, reps: '12 each leg', restTime: '60s' },
      ],
      fitcoins: 150,
    },
    strength_gain: {
      name: 'Strength Training',
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: '6-8', restTime: '2-3min' },
        { name: 'Bench Press', sets: 4, reps: '6-8', restTime: '2-3min' },
        { name: 'Squats', sets: 4, reps: '8-10', restTime: '2-3min' },
        { name: 'Overhead Press', sets: 3, reps: '8-10', restTime: '2min' },
        { name: 'Pull-ups', sets: 3, reps: '5-8', restTime: '2min' },
      ],
      fitcoins: 200,
    },
    stamina_gain: {
      name: 'Cardio & Endurance',
      exercises: [
        { name: 'Jumping Jacks', sets: 3, reps: '30s', restTime: '30s' },
        { name: 'High Knees', sets: 3, reps: '30s', restTime: '30s' },
        { name: 'Burpees', sets: 3, reps: '8-10', restTime: '60s' },
        { name: 'Mountain Climbers', sets: 3, reps: '30s', restTime: '30s' },
        { name: 'Running in Place', sets: 3, reps: '45s', restTime: '30s' },
      ],
      fitcoins: 120,
    },
    fat_loss: {
      name: 'Fat Burning Circuit',
      exercises: [
        { name: 'Burpees', sets: 4, reps: '10-12', restTime: '45s' },
        { name: 'Jump Squats', sets: 4, reps: '15-20', restTime: '45s' },
        { name: 'Push-ups', sets: 3, reps: '12-15', restTime: '45s' },
        { name: 'Plank Jacks', sets: 3, reps: '15-20', restTime: '45s' },
        { name: 'Bicycle Crunches', sets: 3, reps: '20 each side', restTime: '45s' },
      ],
      fitcoins: 180,
    },
  };

  const plan = plans[profile.goal];
  return {
    id: `workout-${Date.now()}`,
    name: plan.name,
    exercises: plan.exercises,
    completed: false,
    fitcoins: plan.fitcoins,
  };
};

export const generateDietPlan = (profile: UserProfile): DietPlan => {
  const baseMeals = {
    muscle_gain: [
      {
        name: 'Protein Power Breakfast',
        time: '7:00 AM',
        foods: ['Scrambled eggs', 'Whole grain toast', 'Greek yogurt', 'Banana'],
        calories: 450,
      },
      {
        name: 'Pre-Workout Snack',
        time: '10:00 AM',
        foods: ['Protein shake', 'Apple slices', 'Almonds'],
        calories: 280,
      },
      {
        name: 'Muscle Building Lunch',
        time: '1:00 PM',
        foods: ['Grilled chicken breast', 'Brown rice', 'Steamed broccoli', 'Avocado'],
        calories: 520,
      },
      {
        name: 'Post-Workout Dinner',
        time: '7:00 PM',
        foods: ['Lean beef', 'Sweet potato', 'Green salad', 'Quinoa'],
        calories: 480,
      },
    ],
    strength_gain: [
      {
        name: 'High-Protein Breakfast',
        time: '7:00 AM',
        foods: ['Oatmeal with protein powder', 'Berries', 'Nuts', 'Milk'],
        calories: 420,
      },
      {
        name: 'Mid-Morning Fuel',
        time: '10:30 AM',
        foods: ['Greek yogurt', 'Granola', 'Honey'],
        calories: 250,
      },
      {
        name: 'Power Lunch',
        time: '1:00 PM',
        foods: ['Salmon fillet', 'Quinoa', 'Roasted vegetables', 'Olive oil'],
        calories: 550,
      },
      {
        name: 'Recovery Dinner',
        time: '7:30 PM',
        foods: ['Turkey breast', 'Brown rice', 'Steamed spinach', 'Chickpeas'],
        calories: 460,
      },
    ],
    stamina_gain: [
      {
        name: 'Energy Breakfast',
        time: '6:30 AM',
        foods: ['Whole grain cereal', 'Banana', 'Low-fat milk', 'Berries'],
        calories: 350,
      },
      {
        name: 'Pre-Workout Boost',
        time: '10:00 AM',
        foods: ['Energy bar', 'Orange juice', 'Dates'],
        calories: 200,
      },
      {
        name: 'Endurance Lunch',
        time: '12:30 PM',
        foods: ['Pasta with lean meat', 'Tomato sauce', 'Green salad', 'Whole grain bread'],
        calories: 480,
      },
      {
        name: 'Recovery Dinner',
        time: '7:00 PM',
        foods: ['Grilled fish', 'Sweet potato', 'Steamed vegetables', 'Brown rice'],
        calories: 430,
      },
    ],
    fat_loss: [
      {
        name: 'Lean Start',
        time: '7:30 AM',
        foods: ['Egg whites', 'Spinach', 'Whole grain toast', 'Grapefruit'],
        calories: 280,
      },
      {
        name: 'Healthy Snack',
        time: '10:30 AM',
        foods: ['Apple', 'Almonds', 'Green tea'],
        calories: 150,
      },
      {
        name: 'Light Lunch',
        time: '1:00 PM',
        foods: ['Grilled chicken salad', 'Mixed greens', 'Cucumber', 'Olive oil dressing'],
        calories: 320,
      },
      {
        name: 'Balanced Dinner',
        time: '6:30 PM',
        foods: ['Grilled fish', 'Steamed broccoli', 'Cauliflower rice', 'Lemon'],
        calories: 280,
      },
    ],
  };

  const meals = baseMeals[profile.goal];
  return {
    id: `diet-${Date.now()}`,
    meals,
    completed: false,
    fitcoins: 100,
  };
};

export const generateWaterGoal = (profile: UserProfile): WaterGoal => {
  // Base water requirement: 35ml per kg of body weight
  const baseWater = (profile.weight * 35) / 1000; // Convert to liters
  
  // Adjust based on goal
  const adjustments = {
    muscle_gain: 0.5,
    strength_gain: 0.3,
    stamina_gain: 0.7,
    fat_loss: 0.4,
  };

  const target = Math.round((baseWater + adjustments[profile.goal]) * 4) / 4; // Round to nearest 0.25L

  return {
    target,
    current: 0,
    completed: false,
    fitcoins: 50,
  };
};

export const generateSleepGoal = (profile: UserProfile): SleepGoal => {
  // Recommended sleep based on age
  let target = 8; // Default for adults
  
  if (profile.age < 18) {
    target = 9;
  } else if (profile.age < 26) {
    target = 8.5;
  } else if (profile.age < 65) {
    target = 8;
  } else {
    target = 7.5;
  }

  // Adjust slightly based on goal
  const adjustments = {
    muscle_gain: 0.5,
    strength_gain: 0.5,
    stamina_gain: 0,
    fat_loss: 0,
  };

  const finalTarget = Math.round((target + adjustments[profile.goal]) * 2) / 2; // Round to nearest 0.5

  return {
    target: finalTarget,
    actual: 0,
    completed: false,
    fitcoins: 75,
  };
};