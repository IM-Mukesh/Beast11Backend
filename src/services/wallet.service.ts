import { supabase } from '../server';

export class WalletService {
  static async createWallet(userId: string) {
    const { data, error } = await supabase
      .from('wallets')
      .insert([{ user_id: userId, balance: 0 }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getWallet(userId: string) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async addTransaction(transactionData: {
    user_id: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'contest_entry' | 'contest_winnings';
    status: 'pending' | 'completed' | 'failed';
    reference_id?: string;
  }) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateWalletBalance(userId: string, amount: number) {
    const { data, error } = await supabase.rpc('update_wallet_balance', {
      p_user_id: userId,
      p_amount: amount
    });

    if (error) throw error;
    return data;
  }

  static async getTransactionHistory(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
} 