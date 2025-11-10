-- Phase 3: Journey Persistence - Supabase Table Setup
-- Run this SQL in your Supabase SQL Editor

-- Create journeys table
CREATE TABLE IF NOT EXISTS journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  journey_data JSONB NOT NULL,
  current_step INTEGER NOT NULL DEFAULT -1,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_journeys_updated_at ON journeys;
CREATE TRIGGER update_journeys_updated_at
    BEFORE UPDATE ON journeys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for journeys table (handles any naming variations)
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'journeys' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON journeys', policy_record.policyname);
    END LOOP;
END $$;

-- Create RLS policies with new names
CREATE POLICY "journeys_select_policy" 
ON journeys FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "journeys_insert_policy" 
ON journeys FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journeys_update_policy" 
ON journeys FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journeys_delete_policy" 
ON journeys FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_created_at ON journeys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journeys_is_completed ON journeys(is_completed);

-- Verify table creation
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'journeys' 
ORDER BY ordinal_position;
