-- Fix: Keep the two-table design but resolve policy conflicts
-- This preserves the better relational structure

-- First, let's see the current structure
SELECT 'Current journeys table:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'journeys' 
ORDER BY ordinal_position;

SELECT 'Current journey_steps table:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'journey_steps' 
ORDER BY ordinal_position;

-- Show existing policies that are causing conflicts
SELECT 'Existing policies:' as info;
SELECT tablename, policyname, cmd FROM pg_policies 
WHERE tablename IN ('journeys', 'journey_steps');

-- Drop ALL existing policies on both tables
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all policies on journeys table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'journeys'
    LOOP
        EXECUTE format('DROP POLICY %I ON journeys', policy_record.policyname);
    END LOOP;
    
    -- Drop all policies on journey_steps table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'journey_steps'
    LOOP
        EXECUTE format('DROP POLICY %I ON journey_steps', policy_record.policyname);
    END LOOP;
END $$;

-- Ensure both tables have the correct structure for Phase 3
-- Update journeys table if needed
ALTER TABLE journeys 
  ADD COLUMN IF NOT EXISTS current_step INTEGER DEFAULT -1,
  ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;

-- Ensure RLS is enabled on both tables
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_steps ENABLE ROW LEVEL SECURITY;

-- Create fresh policies for journeys table
CREATE POLICY "journeys_user_access" ON journeys
  FOR ALL USING (auth.uid() = user_id);

-- Create fresh policies for journey_steps table  
CREATE POLICY "journey_steps_user_access" ON journey_steps
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM journeys WHERE id = journey_steps.journey_id)
  );

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_created_at ON journeys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journey_steps_journey_id ON journey_steps(journey_id);
CREATE INDEX IF NOT EXISTS idx_journey_steps_step_number ON journey_steps(step_number);

-- Verify the setup
SELECT 'Setup complete! Final structure:' as result;

SELECT 'Journeys policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'journeys';

SELECT 'Journey_steps policies:' as info;  
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'journey_steps';
