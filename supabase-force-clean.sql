-- Force clean setup - handles existing tables
-- This will completely remove and recreate both tables

-- Drop tables if they exist (CASCADE removes all dependencies)
DROP TABLE IF EXISTS journey_steps CASCADE;
DROP TABLE IF EXISTS journeys CASCADE;

-- Now run the clean setup
-- Create journeys table (main journey metadata)
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT -1,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create journey_steps table (individual step responses)
CREATE TABLE journey_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL,
  step_key TEXT NOT NULL, -- 'reflect', 'respond', 'thoughts', etc.
  prompt_text TEXT NOT NULL,
  user_response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(journey_id, step_number) -- Prevent duplicate steps per journey
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at on both tables
CREATE TRIGGER update_journeys_updated_at
    BEFORE UPDATE ON journeys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journey_steps_updated_at
    BEFORE UPDATE ON journey_steps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on both tables
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_steps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for journeys table
CREATE POLICY "journeys_user_access" ON journeys
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for journey_steps table
CREATE POLICY "journey_steps_user_access" ON journey_steps
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM journeys WHERE id = journey_steps.journey_id)
  );

-- Create indexes for performance
CREATE INDEX idx_journeys_user_id ON journeys(user_id);
CREATE INDEX idx_journeys_created_at ON journeys(created_at DESC);
CREATE INDEX idx_journeys_is_completed ON journeys(is_completed);

CREATE INDEX idx_journey_steps_journey_id ON journey_steps(journey_id);
CREATE INDEX idx_journey_steps_step_number ON journey_steps(step_number);
CREATE INDEX idx_journey_steps_step_key ON journey_steps(step_key);

-- Verify table creation
SELECT 'Tables created successfully!' as result;
SELECT 'Setup complete - both tables ready for Phase 3!' as status;
