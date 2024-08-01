// src/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { AppDispatch } from '../store';
import { createClient } from '@supabase/supabase-js';
import { fetchAllPrograms, fetchUserPrograms } from './programsSlice'; // Import the fetchUserPrograms action

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

interface UserState {
  user: User | null;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearUser(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setError } = userSlice.actions;

export const loginUser = (name: string) => async (dispatch: AppDispatch) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      dispatch(setUser(data));
      dispatch(fetchAllPrograms())
      dispatch(fetchUserPrograms(data.id)); // Dispatch fetchUserPrograms with the user ID
    }

    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};

export const createUser = (name: string) => async (dispatch: AppDispatch) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ name }])
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      dispatch(setUser(data));
    //   dispatch(fetchUserPrograms(data.id)); // Dispatch fetchUserPrograms with the user ID
    }

    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};

export default userSlice.reducer;
