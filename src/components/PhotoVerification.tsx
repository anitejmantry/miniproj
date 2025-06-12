import React, { useState, useRef } from 'react';
import { Camera, MapPin, Clock, CheckCircle, X, Upload, Loader } from 'lucide-react';
import { geminiService } from '../lib/gemini';

interface PhotoVerificationProps {
  taskType: 'workout' | 'meal';
  taskName: string;
  onVerificationComplete: (verified: boolean, data: VerificationData) => void;
  onCancel: () => void;
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

export const PhotoVerification: React.FC<PhotoVerificationProps> = ({
  taskType,
  taskName,
  onVerificationComplete,
  onCancel,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Try to get address from coordinates
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&limit=1`
          );
          
          let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              address = data.results[0].formatted || address;
            }
          }

          setLocation({ latitude, longitude, address });
        } catch (err) {
          setLocation({ latitude, longitude });
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setError(`Location error: ${error.message}`);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleSubmit = async () => {
    if (!image || !location) {
      setError('Please capture an image and enable location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verify image with Gemini AI
      const aiVerification = taskType === 'workout' 
        ? await geminiService.verifyWorkoutImage(image, taskName)
        : await geminiService.verifyMealImage(image, taskName);

      // Create verification data
      const verificationData: VerificationData = {
        imageUrl: imagePreview!,
        location,
        timestamp: new Date().toISOString(),
        aiVerification,
      };

      onVerificationComplete(aiVerification.verified, verificationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Verify {taskType === 'workout' ? 'Workout' : 'Meal'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Task Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-1">Task: {taskName}</h3>
              <p className="text-sm text-blue-700">
                Take a photo to verify completion with AI verification
              </p>
            </div>

            {/* Image Capture */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                Capture Photo
              </h4>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Verification"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Take a photo or upload an image</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Camera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location Verification
              </h4>
              
              {location ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center text-green-800 mb-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Location Captured
                  </div>
                  <p className="text-sm text-green-700">
                    {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date().toLocaleString()}
                  </p>
                </div>
              ) : (
                <button
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {locationLoading ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                  )}
                  {locationLoading ? 'Getting Location...' : 'Enable Location'}
                </button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!image || !location || loading}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Complete'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};