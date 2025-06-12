import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const geminiService = {
  async verifyWorkoutImage(imageFile: File, workoutType: string): Promise<{ verified: boolean; confidence: number; feedback: string }> {
    if (!genAI) {
      throw new Error('Gemini API not configured');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const imageData = await fileToGenerativePart(imageFile);
      
      const prompt = `Analyze this image to verify if it shows someone performing a ${workoutType} workout or exercise. 
      
      Please respond with a JSON object containing:
      - verified: boolean (true if this appears to be a legitimate workout/exercise photo)
      - confidence: number (0-100, confidence level in your assessment)
      - feedback: string (brief explanation of what you see and why it does/doesn't qualify)
      
      Look for:
      - Person in workout attire or exercise position
      - Exercise equipment if relevant
      - Proper form or exercise setup
      - Gym/home workout environment
      
      Be reasonably lenient but reject obviously fake submissions like random objects, food, or non-exercise activities.`;

      const result = await model.generateContent([prompt, imageData]);
      const response = await result.response;
      const text = response.text();
      
      try {
        const parsed = JSON.parse(text);
        return {
          verified: parsed.verified || false,
          confidence: Math.min(Math.max(parsed.confidence || 0, 0), 100),
          feedback: parsed.feedback || 'Unable to analyze image'
        };
      } catch {
        // Fallback if JSON parsing fails
        const verified = text.toLowerCase().includes('verified') || text.toLowerCase().includes('legitimate');
        return {
          verified,
          confidence: verified ? 75 : 25,
          feedback: text.substring(0, 200)
        };
      }
    } catch (error) {
      console.error('Error verifying workout image:', error);
      throw new Error('Failed to verify workout image');
    }
  },

  async verifyMealImage(imageFile: File, mealType: string): Promise<{ verified: boolean; confidence: number; feedback: string }> {
    if (!genAI) {
      throw new Error('Gemini API not configured');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const imageData = await fileToGenerativePart(imageFile);
      
      const prompt = `Analyze this image to verify if it shows a healthy meal appropriate for ${mealType}. 
      
      Please respond with a JSON object containing:
      - verified: boolean (true if this appears to be a legitimate healthy meal photo)
      - confidence: number (0-100, confidence level in your assessment)
      - feedback: string (brief explanation of what you see and nutritional assessment)
      
      Look for:
      - Real food items (not junk food, candy, or unhealthy options)
      - Balanced meal components (proteins, vegetables, grains, etc.)
      - Proper portion sizes
      - Home-cooked or restaurant meal presentation
      
      Accept reasonable healthy meals but reject junk food, candy, alcohol, or obviously unhealthy choices.`;

      const result = await model.generateContent([prompt, imageData]);
      const response = await result.response;
      const text = response.text();
      
      try {
        const parsed = JSON.parse(text);
        return {
          verified: parsed.verified || false,
          confidence: Math.min(Math.max(parsed.confidence || 0, 0), 100),
          feedback: parsed.feedback || 'Unable to analyze meal'
        };
      } catch {
        const verified = text.toLowerCase().includes('healthy') || text.toLowerCase().includes('nutritious');
        return {
          verified,
          confidence: verified ? 70 : 30,
          feedback: text.substring(0, 200)
        };
      }
    } catch (error) {
      console.error('Error verifying meal image:', error);
      throw new Error('Failed to verify meal image');
    }
  },

  async chatWithAI(message: string, context?: string): Promise<string> {
    if (!genAI) {
      throw new Error('Gemini API not configured');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const systemPrompt = `You are FitBot, an AI fitness coach for the FitMyself app. You're knowledgeable, encouraging, and provide practical fitness advice.

      Guidelines:
      - Keep responses concise but helpful (2-3 sentences max)
      - Focus on fitness, nutrition, wellness, and motivation
      - Be encouraging and positive
      - Provide actionable advice when possible
      - If asked about medical issues, recommend consulting healthcare professionals
      
      ${context ? `User context: ${context}` : ''}
      
      User message: ${message}`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in AI chat:', error);
      return "I'm having trouble connecting right now. Please try again in a moment!";
    }
  }
};

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}