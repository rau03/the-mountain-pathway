-- Debug: Let's see what's actually in your database
-- Run this first to understand the current state

-- Check if journeys table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'journeys') 
    THEN 'journeys table EXISTS' 
    ELSE 'journeys table does NOT exist' 
  END as table_status;

-- If table exists, show its structure
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'journeys' 
ORDER BY ordinal_position;

-- Show ALL policies that mention "journeys" (including any variations)
SELECT 
  schemaname,
  tablename, 
  policyname, 
  cmd,
  qual
FROM pg_policies 
WHERE tablename LIKE '%journey%' OR tablename LIKE '%journeys%';

-- Show RLS status
SELECT 
  schemaname,
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename LIKE '%journey%' OR tablename LIKE '%journeys%';

-- Check for any tables with similar names
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE '%journey%' 
  AND table_schema = 'public';
