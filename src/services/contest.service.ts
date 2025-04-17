import { supabase } from '../server';

export class ContestService {
  static async createContest(contestData: {
    name: string;
    entry_fee: number;
    prize_pool: number;
    max_participants: number;
    sport_id: string;
    match_id: string;
  }) {
    const { data, error } = await supabase
      .from('contests')
      .insert([contestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getContest(contestId: string) {
    const { data, error } = await supabase
      .from('contests')
      .select('*')
      .eq('id', contestId)
      .single();

    if (error) throw error;
    return data;
  }

  static async joinContest(contestId: string, userId: string, teamId: string) {
    const { data, error } = await supabase
      .from('contest_participants')
      .insert([{
        contest_id: contestId,
        user_id: userId,
        team_id: teamId,
        status: 'joined'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getContestParticipants(contestId: string) {
    const { data, error } = await supabase
      .from('contest_participants')
      .select(`
        *,
        users:user_id (*),
        teams:team_id (*)
      `)
      .eq('contest_id', contestId);

    if (error) throw error;
    return data;
  }
} 