import { supabase } from '../lib/supabase';
import { UserProfile, UserStats, WaterGoal, SleepGoal } from '../types';

export const fitnessService = {
  // User Profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createUserProfile(profile: UserProfile & { user_id: string }) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // User Stats
  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createUserStats(userId: string, stats: Partial<UserStats> = {}) {
    const { data, error } = await supabase
      .from('user_stats')
      .insert([{
        user_id: userId,
        total_fitcoins: stats.totalFitcoins || 0,
        streak: stats.streak || 1,
        level: stats.level || 1,
        completed_tasks: stats.completedTasks || 0,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserStats(userId: string, stats: Partial<UserStats>) {
    const { data, error } = await supabase
      .from('user_stats')
      .update({
        total_fitcoins: stats.totalFitcoins,
        streak: stats.streak,
        level: stats.level,
        completed_tasks: stats.completedTasks,
        last_activity_date: new Date().toISOString().split('T')[0],
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Daily Progress
  async getTodayProgress(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createTodayProgress(userId: string, waterGoal: WaterGoal, sleepGoal: SleepGoal) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_progress')
      .insert([{
        user_id: userId,
        date: today,
        water_target: waterGoal.target,
        water_current: waterGoal.current,
        sleep_target: sleepGoal.target,
        sleep_actual: sleepGoal.actual,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTodayProgress(userId: string, updates: any) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_progress')
      .update(updates)
      .eq('user_id', userId)
      .eq('date', today)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async upsertTodayProgress(userId: string, progress: any) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_progress')
      .upsert({
        user_id: userId,
        date: today,
        ...progress,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};