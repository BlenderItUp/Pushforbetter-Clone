// src/slices/programsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Program {
    id: number;
    name: string;
  }
  
  interface UserDayProgress {
    id: number;
    reps: number;
    completed: boolean;
  }
  
  interface DayProgress {
    id: number;
    programid: number;  // Include programid in the interface
    name: string;
    actiondate: string; // or Date if you prefer
    maxreps: number;
    userdayprogress: UserDayProgress | null; // Single object or null
  }
  
  
  interface UserProgram {
    programId: number;
    days: DayProgress[];
  }
  
  interface ProgramsState {
    allPrograms: Program[];
    userPrograms: Record<number, UserProgram>;
    isLoading: boolean;
    error: string | null;
  }
  
  const initialState: ProgramsState = {
    allPrograms: [],
    userPrograms: {},
    isLoading: false,
    error: null,
  };

const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    setAllPrograms(state, action: PayloadAction<Program[]>) {
      state.allPrograms = action.payload;
    },
    setUserPrograms(state, action: PayloadAction<Record<number, UserProgram>>) {
      state.userPrograms = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setAllPrograms, setUserPrograms, setLoading, setError } = programsSlice.actions;

export const fetchAllPrograms = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    
    dispatch(setAllPrograms(data));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchUserPrograms = (userId: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      // Fetch user-specific programs
      const { data: programs, error: programsError } = await supabase
        .from('userprogram')
        .select('programid')
        .eq('userid', userId);
  
      if (programsError) {
        throw new Error(programsError.message);
      }
  
      const programIds = programs.map((program) => program.programid);
  
      // Fetch all days and progress related to these programs
      const { data: days, error: daysError } = await supabase
      .from('day')
      .select(`
        id,
        programid, 
        name,
        actiondate,
        maxreps,
        userdayprogress (id, reps, completed)
      `)
      .in('programid', programIds);
  
      if (daysError) {
        throw new Error(daysError.message);
      }
  
      const userPrograms: Record<number, UserProgram> = {};
  
      // Organize the fetched days into the corresponding programs
      days.forEach((day) => {
        const { programid, ...dayData } = day;
  
        if (!userPrograms[programid]) {
          userPrograms[programid] = { programId: programid, days: [] };
        }
  
        // Process userdayprogress to ensure it is an object or null
        const processedDayData = {
          ...dayData,
          userdayprogress: dayData.userdayprogress.length > 0 ? dayData.userdayprogress[0] : null
        };
  
        userPrograms[programid].days.push(processedDayData);
      });
  
      dispatch(setUserPrograms(userPrograms));
      dispatch(setError(null));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const createProgram = (name: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data, error } = await supabase
      .from('programs')
      .insert([{ name }])
      .single();

    if (error) {
      throw new Error(error.message);
    }

    dispatch(fetchAllPrograms()); // Refresh the list
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default programsSlice.reducer;
