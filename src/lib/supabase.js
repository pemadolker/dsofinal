import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rupgzpseekycvtwnrvrl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1cGd6cHNlZWt5Y3Z0d25ydnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMDQ5ODUsImV4cCI6MjA4OTc4MDk4NX0.x1IVukn-ISV7d8ZPe0fZPtIa9evDObtfwlAwXqcmxbE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
