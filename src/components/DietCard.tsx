import React, { useState } from 'react';
import { Utensils, Clock, CheckCircle, ChefHat, Camera } from 'lucide-react';
import { DietPlan } from '../types';
import { PhotoVerification } from './PhotoVerification';
import { VerificationModal } from './VerificationModal';

interface DietCardProps {
  dietPlan: DietPlan;
  onComplete: (verificationData?: any) => void;
}

interface VerificationData {
  imageUrl: string;
  location: { latitude: number; longitude: number; address?: string };
  timestamp: string;
  aiVerification: {
    verified: boolean;
    confidence: number;
    feedback: string;
  };
}

export const DietCard: React.FC<DietCardProps> = ({ dietPlan, onComplete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [completedMeals, setCompletedMeals] = useState<Set<number>>(new Set());
  const [showPhotoVerification, setShowPhotoVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verifyingMealIndex, setVerifyingMealIndex] = useState<number | null>(null);

  const handleMealComplete = (index: number) => {
    const newCompleted = new Set(completedMeals);
    if (completedMeals.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedMeals(newCompleted);
  };

  const handleVerifyMeal = (index: number) => {
    setVerifyingMealIndex(index);
    setShowPhotoVerification(true);
  };

  const handleVerificationComplete = (verified: boolean, data: VerificationData) => {
    setShowPhotoVerification(false);
    setVerificationData(data);
    setShowVerificationModal(true);
  };

  const handleConfirmCompletion = () => {
    setShowVerificationModal(false);
    if (verifyingMealIndex !== null) {
      handleMealComplete(verifyingMealIndex);
      setVerifyingMealIndex(null);
    }
    
    // Check if all meals are completed
    const newCompleted = new Set(completedMeals);
    if (verifyingMealIndex !== null) {
      newCompleted.add(verifyingMealIndex);
    }
    
    if (newCompleted.size === dietPlan.meals.length && !dietPlan.completed) {
      onComplete(verificationData);
    }
  };

  const totalCalories = dietPlan.meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <>
      <div className={`bg-white border-2 rounded-xl shadow-sm transition-all hover:shadow-md ${
        dietPlan.completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg mr-4 ${
                dietPlan.completed ? 'bg-emerald-500' : 'bg-blue-500'
              }`}>
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Today's Nutrition</h3>
                <p className="text-gray-600">{dietPlan.meals.length} meals • {totalCalories} cal</p>
              </div>
            </div>
            <div className="text-right">
              {dietPlan.completed ? (
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              ) : (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  +{dietPlan.fitcoins} FitCoins
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Meals Completed</span>
              <span>{completedMeals.size}/{dietPlan.meals.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedMeals.size / dietPlan.meals.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ChefHat className="h-4 w-4 mr-2" />
            {showDetails ? 'Hide Meal Plan' : 'View Meal Plan'}
          </button>

          {showDetails && (
            <div className="mt-4 space-y-3 border-t pt-4">
              {dietPlan.meals.map((meal, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg transition-all ${
                    completedMeals.has(index)
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="font-medium text-gray-900 mr-3">{meal.name}</h4>
                        <span className="flex items-center text-sm text-gray-600">
                          <Clock className="h-3 w-3 mr-1" />
                          {meal.time}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {meal.foods.join(', ')}
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        {meal.calories} calories
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!completedMeals.has(index) && !dietPlan.completed && (
                        <button
                          onClick={() => handleVerifyMeal(index)}
                          className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Camera className="h-3 w-3 mr-1" />
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleMealComplete(index)}
                        className={`p-2 rounded-full transition-colors ${
                          completedMeals.has(index)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showPhotoVerification && verifyingMealIndex !== null && (
        <PhotoVerification
          taskType="meal"
          taskName={dietPlan.meals[verifyingMealIndex].name}
          onVerificationComplete={handleVerificationComplete}
          onCancel={() => {
            setShowPhotoVerification(false);
            setVerifyingMealIndex(null);
          }}
        />
      )}

      {showVerificationModal && verificationData && verifyingMealIndex !== null && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => {
            setShowVerificationModal(false);
            setVerifyingMealIndex(null);
          }}
          verificationData={verificationData}
          taskName={dietPlan.meals[verifyingMealIndex].name}
          taskType="meal"
          onConfirm={handleConfirmCompletion}
        />
      )}
    </>
  );
};