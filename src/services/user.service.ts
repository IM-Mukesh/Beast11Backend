import { supabase } from '../config/database';
import { User } from '../types';

export class UserService {
  async createUserProfile(userId: string, profileData: {
    username: string;
    full_name: string;
    avatar_url?: string;
  }): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([{ id: userId, ...profileData }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserProfile(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId: string, profileData: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  }): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
} 