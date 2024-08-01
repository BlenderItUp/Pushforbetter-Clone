// src/types.ts
export interface User {
  id: number;
  name: string;
}

export interface Program {
  id: number;
  name: string;
}

export interface UserProgram {
  userId: number;
  programId: number;
}

export interface Day {
  id: number;
  programId: number;
  name: string;
  actionDate: string;
  maxReps: number;
}

export interface UserDayProgress {
  id: number;
  userId: number;
  dayId: number;
  reps: number;
  completed: boolean;
}
