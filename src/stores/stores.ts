// src/stores/stores.ts
import { create } from 'zustand';
import { User } from '../types';
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
export const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

interface UserStore {
  user: User | null;
  error: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setError: (error: string | null) => void;
  loginUser: (name: string) => Promise<void>;
  createUser: (name: string) => Promise<void>;
}

const getUserFromLocalStorage = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const setUserInLocalStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const useUserStore = create<UserStore>((set) => ({
  user: getUserFromLocalStorage(),
  error: null,
  setUser: (user) => {
    console.log('Setting user in store:', user);
    setUserInLocalStorage(user);
    set({ user });
  },
  clearUser: () => {
    console.log('Clearing user in store');
    setUserInLocalStorage(null);
    set({ user: null });
  },
  setError: (error) => {
    console.log('Setting error in store:', error);
    set({ error });
  },

  loginUser: async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('User not found');
        }
        throw error;
      }

      set((state) => {
        state.setUser(data);
        return { ...state, error: null };
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createUser: async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name }])
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('User already exists');
        }
        throw error;
      }

      set((state) => {
        state.setUser(data);
        return { ...state, error: null };
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
