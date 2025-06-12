import React, { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { UserSetup } from './components/UserSetup';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/useAuth';
import { fitnessService } from './services/fitnessService';
import { verificationService } from './services/verificationService';
import { UserProfile, UserStats, WorkoutPlan, DietPlan, WaterGoal, SleepGoal } from './types';
import { generateWorkoutPlan, generateDietPlan, generateWaterGoal, generateSleepGoal } from './utils/planGenerator';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalFitcoins: 0,
    streak: 0,
    level: 1,
    completedTasks: 0,
  });
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [waterGoal, setWaterGoal] = useState<WaterGoal | null>(null);
  const [sleepGoal, setSleepGoal] = useState<SleepGoal | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load user profile
      const profile = await fitnessService.getUserProfile(user.id);
      
      if (profile) {
        setUserProfile({
          name: profile.name,
          age: profile.age,
          height: profile.height,
          weight: profile.weight,
          goal: profile.goal,
          gender: profile.gender,
        });

        // Load user stats
        let stats = await fitnessService.getUserStats(user.id);
        if (!stats) {
          stats = await fitnessService.createUserStats(user.id);
        }
        
        setUserStats({
          totalFitcoins: stats.total_fitcoins,
          streak: stats.streak,
          level: stats.level,
          completedTasks: stats.completed_tasks,
        });

        // Generate daily plans
        const workout = generateWorkoutPlan(profile);
        const diet = generateDietPlan(profile);
        const water = generateWaterGoal(profile);
        const sleep = generateSleepGoal(profile);

        // Load today's progress
        const todayProgress = await fitnessService.getTodayProgress(user.id);
        
        if (todayProgress) {
          // Update plans with saved progress
          workout.completed = todayProgress.workout_completed;
          diet.completed = todayProgress.diet_completed;
          water.completed = todayProgress.water_completed;
          water.current = todayProgress.water_current;
          sleep.completed = todayProgress.sleep_completed;
          sleep.actual = todayProgress.sleep_actual;
        } else {
          // Create today's progress entry
          await fitnessService.createTodayProgress(user.id, water, sleep);
        }

        setWorkoutPlan(workout);
        setDietPlan(diet);
        setWaterGoal(water);
        setSleepGoal(sleep);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSetupComplete = async (profile: UserProfile) => {
    if (!user) return;

    try {
      // Save user profile to database
      await fitnessService.createUserProfile({
        ...profile,
        user_id: user.id,
      });

      // Create initial user stats
      const initialStats = {
        totalFitcoins: 0,
        streak: 1,
        level: 1,
        completedTasks: 0,
      };
      
      await fitnessService.createUserStats(user.id, initialStats);

      // Generate personalized plans
      const workout = generateWorkoutPlan(profile);
      const diet = generateDietPlan(profile);
      const water = generateWaterGoal(profile);
      const sleep = generateSleepGoal(profile);

      // Create today's progress entry
      await fitnessService.createTodayProgress(user.id, water, sleep);

      setUserProfile(profile);
      setUserStats(initialStats);
      setWorkoutPlan(workout);
      setDietPlan(diet);
      setWaterGoal(water);
      setSleepGoal(sleep);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const handleTaskComplete = async (type: string, reward: number, verificationData?: any) => {
    if (!user) return;

    const newStats = {
      ...userStats,
      totalFitcoins: userStats.totalFitcoins + reward,
      completedTasks: userStats.completedTasks + 1,
    };

    // Level up every 500 FitCoins
    const newLevel = Math.floor(newStats.totalFitcoins / 500) + 1;
    if (newLevel > userStats.level) {
      newStats.level = newLevel;
      newStats.totalFitcoins += 100; // Bonus for leveling up
    }

    // Update local state
    setUserStats(newStats);

    // Mark the specific task as completed
    const updates: any = {};
    if (type === 'workout' && workoutPlan) {
      setWorkoutPlan({ ...workoutPlan, completed: true });
      updates.workout_completed = true;
    } else if (type === 'diet' && dietPlan) {
      setDietPlan({ ...dietPlan, completed: true });
      updates.diet_completed = true;
    } else if (type === 'water' && waterGoal) {
      setWaterGoal({ ...waterGoal, completed: true });
      updates.water_completed = true;
    } else if (type === 'sleep' && sleepGoal) {
      setSleepGoal({ ...sleepGoal, completed: true });
      updates.sleep_completed = true;
    }

    // Check if all daily tasks are completed to update streak
    const tasksCompleted = [
      workoutPlan?.completed || type === 'workout',
      dietPlan?.completed || type === 'diet',
      waterGoal?.completed || type === 'water',
      sleepGoal?.completed || type === 'sleep',
    ].filter(Boolean).length;

    if (tasksCompleted === 4) {
      newStats.streak = userStats.streak + 1;
      newStats.totalFitcoins += 50; // Bonus for maintaining streak
      setUserStats(newStats);
    }

    updates.fitcoins_earned = (updates.fitcoins_earned || 0) + reward;

    try {
      // Save verification data if provided
      if (verificationData && (type === 'workout' || type === 'diet')) {
        const taskName = type === 'workout' ? workoutPlan?.name : dietPlan?.meals[0]?.name;
        if (taskName) {
          await verificationService.saveVerification(
            user.id,
            type as 'workout' | 'diet',
            taskName,
            verificationData
          );
        }
      }

      // Save to database
      await fitnessService.updateUserStats(user.id, newStats);
      await fitnessService.upsertTodayProgress(user.id, updates);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleWaterUpdate = async (amount: number) => {
    if (!user || !waterGoal) return;

    const updatedWaterGoal = { ...waterGoal, current: amount };
    setWaterGoal(updatedWaterGoal);

    try {
      await fitnessService.upsertTodayProgress(user.id, {
        water_current: amount,
      });
    } catch (error) {
      console.error('Error updating water progress:', error);
    }
  };

  const handleSleepUpdate = async (hours: number) => {
    if (!user || !sleepGoal) return;

    const updatedSleepGoal = { ...sleepGoal, actual: hours };
    setSleepGoal(updatedSleepGoal);

    try {
      await fitnessService.upsertTodayProgress(user.id, {
        sleep_actual: hours,
      });
    } catch (error) {
      console.error('Error updating sleep progress:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserProfile(null);
    setUserStats({ totalFitcoins: 0, streak: 0, level: 1, completedTasks: 0 });
    setWorkoutPlan(null);
    setDietPlan(null);
    setWaterGoal(null);
    setSleepGoal(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">FitMyself</h2>
          <p className="text-gray-600">Loading your fitness journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  if (!userProfile || !workoutPlan || !dietPlan || !waterGoal || !sleepGoal) {
    return <UserSetup onComplete={handleUserSetupComplete} />;
  }

  return (
    <Dashboard
      profile={userProfile}
      stats={userStats}
      workoutPlan={workoutPlan}
      dietPlan={dietPlan}
      waterGoal={waterGoal}
      sleepGoal={sleepGoal}
      onCompleteTask={handleTaskComplete}
      onUpdateWater={handleWaterUpdate}
      onUpdateSleep={handleSleepUpdate}
      onSignOut={handleSignOut}
    />
  );
}

export default App;