import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  WALLETS: 'wallets',
  TRANSACTIONS: 'transactions',
  CONTESTS: 'contests',
  CONTEST_PARTICIPANTS: 'contest_participants',
  TEAMS: 'teams',
  PLAYERS: 'players',
  MATCHES: 'matches',
  SPORTS: 'sports',
  PLAYER_PERFORMANCE: 'player_performance'
} as const; 