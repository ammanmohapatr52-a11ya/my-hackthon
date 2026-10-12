import { db } from './db';

export async function exportAllDataAsJSON(): Promise<string> {
  const settings = await db.settings.toArray();
  const flashcards = await db.flashcards.toArray();
  const history = await db.history.toArray();
  const activity = await db.activity.toArray();

  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    settings,
    flashcards,
    history,
    activity,
  };

  return JSON.stringify(exportPayload, null, 2);
}

export function downloadJSONFile(content: string, filename = 'neurobridge-backup.json') {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importDataFromJSON(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonString);
    if (!data.version) {
      return { success: false, message: 'Invalid backup file format: missing version.' };
    }

    if (Array.isArray(data.flashcards)) {
      await db.flashcards.clear();
      await db.flashcards.bulkAdd(data.flashcards);
    }

    if (Array.isArray(data.history)) {
      await db.history.clear();
      await db.history.bulkAdd(data.history);
    }

    if (Array.isArray(data.activity)) {
      await db.activity.clear();
      await db.activity.bulkAdd(data.activity);
    }

    if (Array.isArray(data.settings)) {
      await db.settings.clear();
      await db.settings.bulkAdd(data.settings);
    }

    return { success: true, message: 'All data restored successfully!' };
  } catch (error: any) {
    return { success: false, message: `Failed to import data: ${error.message || 'unknown error'}` };
  }
}

export async function deleteAllLocalData(): Promise<void> {
  await db.flashcards.clear();
  await db.history.clear();
  await db.activity.clear();
  await db.settings.clear();
}
