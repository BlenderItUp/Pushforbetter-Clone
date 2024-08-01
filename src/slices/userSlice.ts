import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../types';
import { AppDispatch, RootState } from '../store';
import { createClient } from '@supabase/supabase-js';
import { fetchAllPrograms, fetchUserPrograms } from './programsSlice';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

interface UserState {
  user: User | null;
  error: string | null;
}

const loadUserFromLocalStorage = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      localStorage.removeItem('user');
    }
  }
  return null;
};

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

export const loadUser = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  'user/loadUser',
  async (_, { dispatch }) => {
    const user = loadUserFromLocalStorage();
    if (user) {
      dispatch(setUser(user));
      dispatch(fetchAllPrograms());
      dispatch(fetchUserPrograms(user.id));
    }
  }
);

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
      dispatch(fetchAllPrograms());
      dispatch(fetchUserPrograms(data.id));
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
      dispatch(fetchAllPrograms());
      dispatch(fetchUserPrograms(data.id));
    }

    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};

export default userSlice.reducer;
