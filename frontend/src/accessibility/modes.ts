export interface AccessibilityModes {
  captions: boolean;
  visualAlerts: boolean;
  voice: boolean;
  keyboardNav: boolean;
  textScale: '100' | '125' | '150' | '200';
  highContrast: boolean;
  simplifiedLearning: boolean;
}

export const DEFAULT_MODES: AccessibilityModes = {
  captions: false,
  visualAlerts: false,
  voice: false,
  keyboardNav: false,
  textScale: '100',
  highContrast: false,
  simplifiedLearning: false,
};

export const DEAF_HOH_MODES: AccessibilityModes = {
  captions: true,
  visualAlerts: true,
  voice: false,
  keyboardNav: false,
  textScale: '100',
  highContrast: false,
  simplifiedLearning: false,
};
