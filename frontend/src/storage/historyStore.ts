import { db, type HistoryItem } from './db';
import { getSetting } from './settingsStore';
import { recordSolvedProblem } from './activityStore';

export async function addHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<number | null> {
  const saveHistory = await getSetting<boolean>('saveHistory', true);
  if (!saveHistory) {
    return null; // History disabled by user preference
  }

  const timestamp = Date.now();
  const id = await db.history.add({
    ...item,
    timestamp,
  });

  if (item.type === 'math') {
    await recordSolvedProblem();
  }

  return id;
}

export async function getHistoryItems(limit = 100): Promise<HistoryItem[]> {
  return await db.history
    .orderBy('timestamp')
    .reverse()
    .limit(limit)
    .toArray();
}

export async function deleteHistoryItem(id: number): Promise<void> {
  await db.history.delete(id);
}

export async function toggleFlagHistoryItem(id: number, currentFlag?: boolean): Promise<void> {
  await db.history.update(id, { flagged: !currentFlag });
}

export async function clearAllHistory(): Promise<void> {
  await db.history.clear();
}
