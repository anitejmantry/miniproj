import React, { useState } from 'react';
import { Moon, Clock, CheckCircle } from 'lucide-react';
import { SleepGoal } from '../types';

interface SleepTrackerProps {
  sleepGoal: SleepGoal;
  onUpdate: (hours: number) => void;
  onComplete: () => void;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({ sleepGoal, onUpdate, onComplete }) => {
  const [sleepHours, setSleepHours] = useState(sleepGoal.actual);

  const handleSleepUpdate = (hours: number) => {
    const clampedHours = Math.max(0, Math.min(hours, 12));
    setSleepHours(clampedHours);
    onUpdate(clampedHours);
    
    if (clampedHours >= sleepGoal.target && !sleepGoal.completed) {
      onComplete();
    }
  };

  const progress = (sleepGoal.actual / sleepGoal.target) * 100;
  const sleepQuality = sleepGoal.actual >= sleepGoal.target ? 'Excellent' : 
                      sleepGoal.actual >= sleepGoal.target * 0.8 ? 'Good' : 
                      sleepGoal.actual >= sleepGoal.target * 0.6 ? 'Fair' : 'Poor';

  const qualityColor = sleepQuality === 'Excellent' ? 'text-green-600' :
                      sleepQuality === 'Good' ? 'text-blue-600' :
                      sleepQuality === 'Fair' ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className={`bg-white border-2 rounded-xl shadow-sm transition-all hover:shadow-md ${
      sleepGoal.completed ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${
              sleepGoal.completed ? 'bg-purple-500' : 'bg-indigo-500'
            }`}>
              <Moon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Sleep Tracker</h3>
              <p className="text-gray-600">{sleepGoal.actual}h / {sleepGoal.target}h</p>
            </div>
          </div>
          <div className="text-right">
            {sleepGoal.completed ? (
              <CheckCircle className="h-8 w-8 text-purple-500" />
            ) : (
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                +{sleepGoal.fitcoins} FitCoins
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Sleep Quality</span>
            <span className={`font-medium ${qualityColor}`}>{sleepQuality}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-400 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Hours Slept Last Night
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => handleSleepUpdate(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0h</span>
              <span>6h</span>
              <span>12h</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sleep Duration</span>
              <span className="text-2xl font-bold text-indigo-600">{sleepHours}h</span>
            </div>
            <div className="text-sm text-gray-600">
              {sleepHours < sleepGoal.target ? 
                `${sleepGoal.target - sleepHours}h more needed for optimal sleep` :
                'Great! You got enough sleep last night 🌟'
              }
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-indigo-600">{sleepGoal.target}h</div>
              <div className="text-xs text-gray-600">Target</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg">
              <div className={`text-lg font-semibold ${qualityColor}`}>{sleepQuality}</div>
              <div className="text-xs text-gray-600">Quality</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};