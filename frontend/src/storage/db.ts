import Dexie, { type Table } from 'dexie';

export interface AppSetting {
  key: string;
  value: any;
}

export interface Flashcard {
  id?: number;
  front: string;
  back: string;
  mathLatex?: string;
  category?: string;
  image?: string | null;
  ease: number; // starts at 2.5, min 1.3
  interval: number; // in days
  reps: number;
  dueAt: number; // timestamp in ms
  createdAt: number;
}

export interface HistoryItem {
  id?: number;
  type: 'math' | 'ask';
  title: string;
  input: string;
  output: string;
  steps?: any[];
  verified?: boolean;
  timestamp: number;
  flagged?: boolean;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  problemsSolved: number;
  flashcardsReviewed: number;
  timestamp: number;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'study' | 'assignment' | 'project' | 'other';
export type TaskStatus = 'upcoming' | 'in_progress' | 'due_soon' | 'due_today' | 'due_tomorrow' | 'overdue' | 'completed';

export interface StudyTask {
  id?: number;
  userId?: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  progressPercent: number; // 0 - 100
  createdAt: number;
  completedAt?: number;
}

export class NeurobridgeDB extends Dexie {
  settings!: Table<AppSetting, string>;
  flashcards!: Table<Flashcard, number>;
  history!: Table<HistoryItem, number>;
  activity!: Table<DailyActivity, string>;
  studyTasks!: Table<StudyTask, number>;

  constructor() {
    super('NeurobridgeDB');
    this.version(1).stores({
      settings: 'key',
      flashcards: '++id, dueAt, createdAt, category',
      history: '++id, type, timestamp, flagged',
      activity: 'date, timestamp'
    });
    this.version(2).stores({
      studyTasks: '++id, userId, dueDate, startDate, category, priority, completed'
    });
  }
}

export const db = new NeurobridgeDB();
