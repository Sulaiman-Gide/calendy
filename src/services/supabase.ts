import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, User } from '../types';

// 🔥 REPLACE THESE WITH YOUR SUPABASE CREDENTIALS 🔥
// Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
const supabaseUrl = 'https://txfvlcrivhtlinsrefqr.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4ZnZsY3Jpdmh0bGluc3JlZnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDU5NzAsImV4cCI6MjA2ODU4MTk3MH0.YO0NuZ7QRgxNIR_dX_M7VuLGl0DFbfvGHfsFyMFhJ0E';

// ⚠️  IMPORTANT: Replace the above values with your actual Supabase credentials
// 1. Go to your Supabase dashboard
// 2. Navigate to Settings → API
// 3. Copy the Project URL and Anon Key
// 4. Replace the values above

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Event service
export const eventService = {
  async getEvents(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true });

    if (startDate && endDate) {
      query = query.gte('start_date', startDate).lte('start_date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createEvent(
    event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) throw error;
  },
};

// User service
export const userService = {
  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
