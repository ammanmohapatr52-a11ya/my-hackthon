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

export class NeurobridgeDB extends Dexie {
  settings!: Table<AppSetting, string>;
  flashcards!: Table<Flashcard, number>;
  history!: Table<HistoryItem, number>;
  activity!: Table<DailyActivity, string>;

  constructor() {
    super('NeurobridgeDB');
    this.version(1).stores({
      settings: 'key',
      flashcards: '++id, dueAt, createdAt, category',
      history: '++id, type, timestamp, flagged',
      activity: 'date, timestamp'
    });
  }
}

export const db = new NeurobridgeDB();
