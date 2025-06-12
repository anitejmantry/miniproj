import React, { useState } from 'react';
import { Dumbbell, Clock, CheckCircle, Play, Camera } from 'lucide-react';
import { WorkoutPlan } from '../types';
import { PhotoVerification } from './PhotoVerification';
import { VerificationModal } from './VerificationModal';

interface WorkoutCardProps {
  workoutPlan: WorkoutPlan;
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

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workoutPlan, onComplete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [showPhotoVerification, setShowPhotoVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleExerciseComplete = (index: number) => {
    const newCompleted = new Set(completedExercises);
    if (completedExercises.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedExercises(newCompleted);
  };

  const handleVerifyWorkout = () => {
    if (completedExercises.size === workoutPlan.exercises.length) {
      setShowPhotoVerification(true);
    }
  };

  const handleVerificationComplete = (verified: boolean, data: VerificationData) => {
    setShowPhotoVerification(false);
    setVerificationData(data);
    setShowVerificationModal(true);
  };

  const handleConfirmCompletion = () => {
    setShowVerificationModal(false);
    onComplete(verificationData);
  };

  return (
    <>
      <div className={`bg-white border-2 rounded-xl shadow-sm transition-all hover:shadow-md ${
        workoutPlan.completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg mr-4 ${
                workoutPlan.completed ? 'bg-emerald-500' : 'bg-orange-500'
              }`}>
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{workoutPlan.name}</h3>
                <p className="text-gray-600">{workoutPlan.exercises.length} exercises</p>
              </div>
            </div>
            <div className="text-right">
              {workoutPlan.completed ? (
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              ) : (
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  +{workoutPlan.fitcoins} FitCoins
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completedExercises.size}/{workoutPlan.exercises.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedExercises.size / workoutPlan.exercises.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide Details' : 'View Workout'}
            </button>
            
            {!workoutPlan.completed && completedExercises.size === workoutPlan.exercises.length && (
              <button
                onClick={handleVerifyWorkout}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Camera className="h-4 w-4 mr-2" />
                Verify Completion
              </button>
            )}
          </div>

          {showDetails && (
            <div className="mt-4 space-y-3 border-t pt-4">
              {workoutPlan.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg transition-all ${
                    completedExercises.has(index)
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{exercise.sets} sets × {exercise.reps}</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {exercise.restTime} rest
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleExerciseComplete(index)}
                      className={`p-2 rounded-full transition-colors ${
                        completedExercises.has(index)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showPhotoVerification && (
        <PhotoVerification
          taskType="workout"
          taskName={workoutPlan.name}
          onVerificationComplete={handleVerificationComplete}
          onCancel={() => setShowPhotoVerification(false)}
        />
      )}

      {showVerificationModal && verificationData && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          verificationData={verificationData}
          taskName={workoutPlan.name}
          taskType="workout"
          onConfirm={handleConfirmCompletion}
        />
      )}
    </>
  );
};