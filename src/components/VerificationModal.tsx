import React from 'react';
import { CheckCircle, XCircle, MapPin, Clock, Camera, Star } from 'lucide-react';

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

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationData: VerificationData;
  taskName: string;
  taskType: 'workout' | 'meal';
  onConfirm: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  verificationData,
  taskName,
  taskType,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const { aiVerification, location, timestamp, imageUrl } = verificationData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              aiVerification.verified ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {aiVerification.verified ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {aiVerification.verified ? 'Verification Successful!' : 'Verification Failed'}
            </h2>
            <p className={`text-sm ${
              aiVerification.verified ? 'text-green-700' : 'text-red-700'
            }`}>
              {taskType === 'workout' ? 'Workout' : 'Meal'} verification for "{taskName}"
            </p>
          </div>

          {/* Image Preview */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Camera className="h-4 w-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Submitted Photo</span>
            </div>
            <img
              src={imageUrl}
              alt="Verification"
              className="w-full h-48 object-cover rounded-lg border"
            />
          </div>

          {/* AI Analysis */}
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">AI Analysis</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600">{aiVerification.confidence}% confidence</span>
                </div>
              </div>
              <p className="text-sm text-gray-700">{aiVerification.feedback}</p>
            </div>
          </div>

          {/* Location & Time */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{new Date(timestamp).toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {aiVerification.verified ? 'Cancel' : 'Try Again'}
            </button>
            {aiVerification.verified && (
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Complete Task
              </button>
            )}
          </div>

          {!aiVerification.verified && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Tip:</strong> Make sure your photo clearly shows the {taskType === 'workout' ? 'exercise or workout activity' : 'healthy meal'} for better verification results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};