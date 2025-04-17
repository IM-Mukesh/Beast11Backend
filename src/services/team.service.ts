import { supabase } from '../server';

export class TeamService {
  static async createTeam(teamData: {
    user_id: string;
    name: string;
    match_id: string;
    players: string[]; // Array of player IDs
    captain_id: string;
    vice_captain_id: string;
  }) {
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTeam(teamId: string) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        players:players (*),
        captain:captain_id (*),
        vice_captain:vice_captain_id (*)
      `)
      .eq('id', teamId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserTeams(userId: string, matchId: string) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        players:players (*),
        captain:captain_id (*),
        vice_captain:vice_captain_id (*)
      `)
      .eq('user_id', userId)
      .eq('match_id', matchId);

    if (error) throw error;
    return data;
  }

  static async updateTeam(teamId: string, updateData: {
    name?: string;
    players?: string[];
    captain_id?: string;
    vice_captain_id?: string;
  }) {
    const { data, error } = await supabase
      .from('teams')
      .update(updateData)
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
} 