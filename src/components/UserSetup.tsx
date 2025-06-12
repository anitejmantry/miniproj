import React, { useState } from 'react';
import { User, Target, Scale, Ruler } from 'lucide-react';
import { UserProfile } from '../types';

interface UserSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export const UserSetup: React.FC<UserSetupProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.age && profile.height && profile.weight && profile.goal && profile.gender) {
      onComplete(profile as UserProfile);
    }
  };

  const goals = [
    { id: 'muscle_gain', label: 'Muscle Gain', icon: '💪', description: 'Build lean muscle mass' },
    { id: 'strength_gain', label: 'Strength Gain', icon: '🏋️', description: 'Increase power and lifting capacity' },
    { id: 'stamina_gain', label: 'Stamina Gain', icon: '🏃', description: 'Improve endurance and cardio' },
    { id: 'fat_loss', label: 'Fat Loss', icon: '🔥', description: 'Burn fat and get lean' },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FitQuest</h1>
          <p className="text-gray-600">Let's create your personalized fitness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Your name"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="25"
                  min="13"
                  max="100"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="inline h-4 w-4 mr-1" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="170"
                  min="120"
                  max="250"
                  value={profile.height || ''}
                  onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Scale className="inline h-4 w-4 mr-1" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="70"
                  min="30"
                  max="200"
                  value={profile.weight || ''}
                  onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="mr-2 text-emerald-600 focus:ring-emerald-500"
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value as 'male' | 'female' })}
                    required
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="mr-2 text-emerald-600 focus:ring-emerald-500"
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value as 'male' | 'female' })}
                    required
                  />
                  Female
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <Target className="inline h-5 w-5 mr-2 text-emerald-600" />
              Your Fitness Goal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <label
                  key={goal.id}
                  className={`cursor-pointer p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                    profile.goal === goal.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={goal.id}
                    className="sr-only"
                    onChange={(e) => setProfile({ ...profile, goal: e.target.value as any })}
                    required
                  />
                  <div className="text-center">
                    <div className="text-3xl mb-2">{goal.icon}</div>
                    <h3 className="font-semibold text-gray-900">{goal.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start My Fitness Journey
          </button>
        </form>
      </div>
    </div>
  );
};