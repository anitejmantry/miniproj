import React, { useState } from 'react';
import { Droplets, Plus, Minus, CheckCircle } from 'lucide-react';
import { WaterGoal } from '../types';

interface WaterTrackerProps {
  waterGoal: WaterGoal;
  onUpdate: (amount: number) => void;
  onComplete: () => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ waterGoal, onUpdate, onComplete }) => {
  const [glassSize, setGlassSize] = useState(0.25); // Default 250ml

  const handleAddWater = () => {
    const newAmount = Math.min(waterGoal.current + glassSize, waterGoal.target);
    onUpdate(newAmount);
    
    if (newAmount >= waterGoal.target && !waterGoal.completed) {
      onComplete();
    }
  };

  const handleRemoveWater = () => {
    const newAmount = Math.max(waterGoal.current - glassSize, 0);
    onUpdate(newAmount);
  };

  const progress = (waterGoal.current / waterGoal.target) * 100;

  return (
    <div className={`bg-white border-2 rounded-xl shadow-sm transition-all hover:shadow-md ${
      waterGoal.completed ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${
              waterGoal.completed ? 'bg-blue-500' : 'bg-cyan-500'
            }`}>
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Water Intake</h3>
              <p className="text-gray-600">{waterGoal.current}L / {waterGoal.target}L</p>
            </div>
          </div>
          <div className="text-right">
            {waterGoal.completed ? (
              <CheckCircle className="h-8 w-8 text-blue-500" />
            ) : (
              <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
                +{waterGoal.fitcoins} FitCoins
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Glass Size</label>
            <select
              value={glassSize}
              onChange={(e) => setGlassSize(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value={0.25}>250ml</option>
              <option value={0.5}>500ml</option>
              <option value={0.75}>750ml</option>
              <option value={1}>1L</option>
            </select>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleRemoveWater}
              disabled={waterGoal.current <= 0}
              className="flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-6 w-6" />
            </button>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{glassSize}L</div>
              <div className="text-sm text-gray-600">per glass</div>
            </div>
            
            <button
              onClick={handleAddWater}
              disabled={waterGoal.current >= waterGoal.target}
              className="flex items-center justify-center w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full hover:bg-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>

          <button
            onClick={handleAddWater}
            disabled={waterGoal.current >= waterGoal.target}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            Add {glassSize}L Water
          </button>
        </div>
      </div>
    </div>
  );
};