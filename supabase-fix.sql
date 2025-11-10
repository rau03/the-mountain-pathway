-- Fix: Handle existing journeys and journey_steps tables
-- This will clean up the old schema and create the new Phase 3 schema

-- First, let's see what we're working with
SELECT 'Current state before cleanup:' as info;

-- Show existing policies on both tables
SELECT 'Policies on journeys:' as table_name, policyname, cmd FROM pg_policies WHERE tablename = 'journeys'
UNION ALL
SELECT 'Policies on journey_steps:' as table_name, policyname, cmd FROM pg_policies WHERE tablename = 'journey_steps';

-- Drop both tables completely (this removes all policies and data)
-- WARNING: This will delete any existing journey data!
DROP TABLE IF EXISTS journey_steps CASCADE;
DROP TABLE IF EXISTS journeys CASCADE;

-- Create the NEW Phase 3 journeys table (single table design)
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  journey_data JSONB NOT NULL,
  current_step INTEGER NOT NULL DEFAULT -1,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_journeys_updated_at
    BEFORE UPDATE ON journeys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (fresh table = no conflicts)
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
CREATE INDEX idx_journeys_user_id ON journeys(user_id);
CREATE INDEX idx_journeys_created_at ON journeys(created_at DESC);
CREATE INDEX idx_journeys_is_completed ON journeys(is_completed);

-- Verify the new setup
SELECT 'Setup complete! New table structure:' as result;
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'journeys' 
ORDER BY ordinal_position;

SELECT 'New policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'journeys';
