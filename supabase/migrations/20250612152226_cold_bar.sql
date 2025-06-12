/*
  # Add verification tables for photo verification

  1. New Tables
    - `task_verifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `task_type` (text - workout, meal, water, sleep)
      - `task_name` (text)
      - `image_url` (text)
      - `location_lat` (decimal)
      - `location_lng` (decimal)
      - `location_address` (text)
      - `ai_verified` (boolean)
      - `ai_confidence` (integer)
      - `ai_feedback` (text)
      - `verified_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on verification table
    - Add policies for authenticated users to manage their own verifications
*/

-- Create task_verifications table
CREATE TABLE IF NOT EXISTS task_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_type text NOT NULL CHECK (task_type IN ('workout', 'meal', 'water', 'sleep')),
  task_name text NOT NULL,
  image_url text,
  location_lat decimal,
  location_lng decimal,
  location_address text,
  ai_verified boolean DEFAULT false,
  ai_confidence integer DEFAULT 0,
  ai_feedback text,
  verified_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE task_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies for task_verifications
CREATE POLICY "Users can read own verifications"
  ON task_verifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verifications"
  ON task_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verifications"
  ON task_verifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);