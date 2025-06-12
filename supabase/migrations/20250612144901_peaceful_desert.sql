/*
  # Create fitness app database schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `age` (integer)
      - `height` (integer, in cm)
      - `weight` (integer, in kg)
      - `goal` (text, fitness goal)
      - `gender` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `total_fitcoins` (integer)
      - `streak` (integer)
      - `level` (integer)
      - `completed_tasks` (integer)
      - `last_activity_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `daily_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `workout_completed` (boolean)
      - `diet_completed` (boolean)
      - `water_completed` (boolean)
      - `sleep_completed` (boolean)
      - `water_current` (decimal)
      - `water_target` (decimal)
      - `sleep_actual` (decimal)
      - `sleep_target` (decimal)
      - `fitcoins_earned` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 13 AND age <= 100),
  height integer NOT NULL CHECK (height >= 120 AND height <= 250),
  weight integer NOT NULL CHECK (weight >= 30 AND weight <= 200),
  goal text NOT NULL CHECK (goal IN ('muscle_gain', 'strength_gain', 'stamina_gain', 'fat_loss')),
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_fitcoins integer DEFAULT 0,
  streak integer DEFAULT 0,
  level integer DEFAULT 1,
  completed_tasks integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create daily_progress table
CREATE TABLE IF NOT EXISTS daily_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE,
  workout_completed boolean DEFAULT false,
  diet_completed boolean DEFAULT false,
  water_completed boolean DEFAULT false,
  sleep_completed boolean DEFAULT false,
  water_current decimal DEFAULT 0,
  water_target decimal DEFAULT 2.5,
  sleep_actual decimal DEFAULT 0,
  sleep_target decimal DEFAULT 8,
  fitcoins_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for user_stats
CREATE POLICY "Users can read own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for daily_progress
CREATE POLICY "Users can read own progress"
  ON daily_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON daily_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON daily_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_progress_updated_at
  BEFORE UPDATE ON daily_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();