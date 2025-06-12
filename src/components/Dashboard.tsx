import React from 'react';
import { Trophy, Coins, Flame, Calendar, Target, Award, LogOut } from 'lucide-react';
import { UserProfile, UserStats, WorkoutPlan, DietPlan, WaterGoal, SleepGoal } from '../types';
import { WorkoutCard } from './WorkoutCard';
import { DietCard } from './DietCard';
import { WaterTracker } from './WaterTracker';
import { SleepTracker } from './SleepTracker';
import { AIChat } from './AIChat';

interface DashboardProps {
  profile: UserProfile;
  stats: UserStats;
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  waterGoal: WaterGoal;
  sleepGoal: SleepGoal;
  onCompleteTask: (type: string, reward: number, verificationData?: any) => void;
  onUpdateWater: (amount: number) => void;
  onUpdateSleep: (hours: number) => void;
  onSignOut: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  stats,
  workoutPlan,
  dietPlan,
  waterGoal,
  sleepGoal,
  onCompleteTask,
  onUpdateWater,
  onUpdateSleep,
  onSignOut,
}) => {
  const fitcoinValue = (stats.totalFitcoins * 277.87) / 10000;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to FitMyself, {profile.name}! 👋</h1>
              <p className="text-emerald-100">Your goal: {profile.goal.replace('_', ' ').toUpperCase()}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center bg-white/20 rounded-full p-3 mb-2">
                  <Coins className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{stats.totalFitcoins.toLocaleString()}</div>
                <div className="text-sm text-emerald-100">FitCoins</div>
                <div className="text-xs text-emerald-200">₹{fitcoinValue.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center bg-white/20 rounded-full p-3 mb-2">
                  <Flame className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{stats.streak}</div>
                <div className="text-sm text-emerald-100">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center bg-white/20 rounded-full p-3 mb-2">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">L{stats.level}</div>
                <div className="text-sm text-emerald-100">Level</div>
              </div>
              <button
                onClick={onSignOut}
                className="flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-emerald-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Today's Plan</h2>
            </div>
            
            <WorkoutCard 
              workoutPlan={workoutPlan} 
              onComplete={(verificationData) => onCompleteTask('workout', workoutPlan.fitcoins, verificationData)} 
            />
            
            <DietCard 
              dietPlan={dietPlan} 
              onComplete={(verificationData) => onCompleteTask('diet', dietPlan.fitcoins, verificationData)} 
            />
          </div>

          {/* Progress Trackers */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Daily Trackers</h2>
            </div>
            
            <WaterTracker 
              waterGoal={waterGoal} 
              onUpdate={onUpdateWater}
              onComplete={() => onCompleteTask('water', waterGoal.fitcoins)}
            />
            
            <SleepTracker 
              sleepGoal={sleepGoal} 
              onUpdate={onUpdateSleep}
              onComplete={() => onCompleteTask('sleep', sleepGoal.fitcoins)}
            />

            {/* Achievement Summary */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Today's Progress</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tasks Completed</span>
                  <span className="font-semibold">
                    {[workoutPlan.completed, dietPlan.completed, waterGoal.completed, sleepGoal.completed].filter(Boolean).length}/4
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${([workoutPlan.completed, dietPlan.completed, waterGoal.completed, sleepGoal.completed].filter(Boolean).length / 4) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  Potential FitCoins: {workoutPlan.fitcoins + dietPlan.fitcoins + waterGoal.fitcoins + sleepGoal.fitcoins}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat */}
      <AIChat userProfile={profile} />
    </div>
  );
};