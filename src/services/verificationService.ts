import { supabase } from '../lib/supabase';

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

export const verificationService = {
  async saveVerification(
    userId: string,
    taskType: 'workout' | 'meal' | 'water' | 'sleep',
    taskName: string,
    verificationData: VerificationData
  ) {
    const { data, error } = await supabase
      .from('task_verifications')
      .insert([{
        user_id: userId,
        task_type: taskType,
        task_name: taskName,
        image_url: verificationData.imageUrl,
        location_lat: verificationData.location.latitude,
        location_lng: verificationData.location.longitude,
        location_address: verificationData.location.address,
        ai_verified: verificationData.aiVerification.verified,
        ai_confidence: verificationData.aiVerification.confidence,
        ai_feedback: verificationData.aiVerification.feedback,
        verified_at: verificationData.timestamp,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserVerifications(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('task_verifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async getVerificationsByDate(userId: string, date: string) {
    const { data, error } = await supabase
      .from('task_verifications')
      .select('*')
      .eq('user_id', userId)
      .gte('verified_at', `${date}T00:00:00`)
      .lt('verified_at', `${date}T23:59:59`)
      .order('verified_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};