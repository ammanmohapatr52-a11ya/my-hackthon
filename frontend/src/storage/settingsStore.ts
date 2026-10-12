import { db, type AppSetting } from './db';

export interface AccessibilityModes {
  captions: boolean;
  visualAlerts: boolean;
  voice: boolean;
  keyboardNav: boolean;
  textScale: '100' | '125' | '150' | '200';
  highContrast: boolean;
  simplifiedLearning: boolean;
}

export interface AppSettings {
  profile: 'standard' | 'deaf-hoh';
  modes: AccessibilityModes;
  aiProvider: 'openrouter' | 'ollama';
  openRouterApiKey: string;
  openRouterModel: string;
  ollamaUrl: string;
  selectedModel: string;
  defaultLevel: 1 | 2 | 3;
  speechSpeed: number;
  speechVoice: string;
  language: string;
  saveHistory: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  profile: 'standard',
  modes: {
    captions: false,
    visualAlerts: false,
    voice: false,
    keyboardNav: false,
    textScale: '100',
    highContrast: false,
    simplifiedLearning: false,
  },
  aiProvider: 'openrouter',
  openRouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  openRouterModel: 'liquid/lfm-2.5-2.6b:free',
  ollamaUrl: 'http://localhost:11434',
  selectedModel: '',
  defaultLevel: 2,
  speechSpeed: 1.0,
  speechVoice: '',
  language: 'en',
  saveHistory: true,
};

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const item = await db.settings.get(key);
    return item ? (item.value as T) : defaultValue;
  } catch (error) {
    console.warn(`Failed to read setting "${key}", falling back to default.`, error);
    return defaultValue;
  }
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  try {
    await db.settings.put({ key, value });
  } catch (error) {
    console.error(`Failed to save setting "${key}".`, error);
  }
}

export async function getAllSettings(): Promise<AppSettings> {
  try {
    const settings = { ...DEFAULT_SETTINGS };
    const allRecords = await db.settings.toArray();
    for (const record of allRecords) {
      if (record.key in settings) {
        (settings as any)[record.key] = record.value;
      }
    }
    return settings;
  } catch (error) {
    console.warn('Error reading all settings, using defaults.', error);
    return DEFAULT_SETTINGS;
  }
}

export async function applyProfile(profileId: 'standard' | 'deaf-hoh'): Promise<AccessibilityModes> {
  const currentModes = (await getSetting('modes', DEFAULT_SETTINGS.modes)) as AccessibilityModes;
  let updatedModes: AccessibilityModes;

  if (profileId === 'deaf-hoh') {
    updatedModes = {
      ...currentModes,
      captions: true,
      visualAlerts: true,
      voice: false,
    };
  } else {
    updatedModes = {
      ...DEFAULT_SETTINGS.modes,
    };
  }

  await setSetting('profile', profileId);
  await setSetting('modes', updatedModes);
  return updatedModes;
}
