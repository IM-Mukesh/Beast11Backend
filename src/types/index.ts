// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Wallet Types
export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'contest_entry' | 'contest_winnings';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  reference_id?: string;
  created_at: string;
}

// Contest Types
export interface Contest {
  id: string;
  name: string;
  entry_fee: number;
  prize_pool: number;
  max_participants: number;
  sport_id: string;
  match_id: string;
  status: 'upcoming' | 'live' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ContestParticipant {
  id: string;
  contest_id: string;
  user_id: string;
  team_id: string;
  status: 'joined' | 'left';
  created_at: string;
}

// Team Types
export interface Team {
  id: string;
  user_id: string;
  name: string;
  match_id: string;
  players: string[];
  captain_id: string;
  vice_captain_id: string;
  points?: number;
  created_at: string;
  updated_at: string;
}

// Player Types
export interface Player {
  id: string;
  name: string;
  sport_id: string;
  team_id: string;
  position: string;
  status: 'active' | 'injured' | 'suspended';
  created_at: string;
  updated_at: string;
}

// Match Types
export interface Match {
  id: string;
  sport_id: string;
  team1_id: string;
  team2_id: string;
  start_time: string;
  status: 'upcoming' | 'live' | 'completed';
  created_at: string;
  updated_at: string;
}

// Sport Types
export interface Sport {
  id: string;
  name: string;
  rules: Record<string, any>;
  scoring_config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Player Performance Types
export interface PlayerPerformance {
  id: string;
  player_id: string;
  match_id: string;
  points: number;
  stats: Record<string, any>;
  created_at: string;
  updated_at: string;
} 