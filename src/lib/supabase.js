import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rvxcgjwzmbmmdwvfvkiu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2eGNnand6bWJtbWR3dmZ2a2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDQyMzAsImV4cCI6MjA4OTI4MDIzMH0.lRSFWfMXLV2cn2geSEbGSntC4p0vfjvrp82ERFd9Sfc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
