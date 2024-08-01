import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SettingsState {
  currentProgramId: number;
  currentDayId: number;
}

const initialState: SettingsState = {
  currentProgramId: 1, 
  currentDayId: 0,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrentProgramId(state, action: PayloadAction<number>) {
      state.currentProgramId = action.payload;
    },
    setCurrentDayId(state, action: PayloadAction<number>) {
      state.currentDayId = action.payload;
    },
    setSettings(state, action: PayloadAction<SettingsState>) {
      return action.payload;
    },
  },
});

export const { setCurrentProgramId, setCurrentDayId, setSettings } = settingsSlice.actions;

export const initializeSettings = () => async (dispatch: AppDispatch) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Fetch the day data for the current program
    const { data: days, error } = await supabase
      .from('day')
      .select('id, actiondate')
      .eq('actiondate', today);

    if (error) {
      throw new Error(error.message);
    }

    // If there is a matching day, set it as the currentDayId
    if (days.length > 0) {
      dispatch(setCurrentDayId(days[0].id));
    }

  } catch (error: any) {
    console.error("Failed to initialize settings:", error.message);
  }
};

export default settingsSlice.reducer;
