import { ConnectorConfig } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Exercise_Key {
  id: UUIDString;
  __typename?: 'Exercise_Key';
}

export interface RoutineExercise_Key {
  routineId: UUIDString;
  exerciseId: UUIDString;
  __typename?: 'RoutineExercise_Key';
}

export interface Routine_Key {
  id: UUIDString;
  __typename?: 'Routine_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface WorkoutSession_Key {
  id: UUIDString;
  __typename?: 'WorkoutSession_Key';
}

export interface WorkoutSet_Key {
  id: UUIDString;
  __typename?: 'WorkoutSet_Key';
}

