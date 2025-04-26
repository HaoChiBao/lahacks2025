import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import { UserEntry } from '../types/user';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_API_KEY || ''

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or API key is not defined in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);


