export interface LearnerProfile {
  id: 'standard' | 'deaf-hoh' | 'blind-low-vision' | 'deafblind';
  title: string;
  description: string;
  isAvailableInV1: boolean;
  comingSoonNote?: string;
  iconName: 'standard' | 'deaf' | 'eye' | 'hand';
}

export const LEARNER_PROFILES: LearnerProfile[] = [
  {
    id: 'standard',
    title: 'Standard',
    description: 'Clean, step-by-step problem solver with interactive formulas, flashcards, and adaptive explanation levels.',
    isAvailableInV1: true,
    iconName: 'standard',
  },
  {
    id: 'deaf-hoh',
    title: 'Deaf / Hard of Hearing',
    description: 'Synchronized on-screen captions for all spoken content, instant visual status badges, and audio-free prompts.',
    isAvailableInV1: true,
    iconName: 'deaf',
  },
  {
    id: 'blind-low-vision',
    title: 'Blind / Low Vision',
    description: 'Requires screen-reader-grade audio architecture and tactile diagram descriptions.',
    isAvailableInV1: false,
    comingSoonNote: 'Coming in desktop release (Phase 3)',
    iconName: 'eye',
  },
  {
    id: 'deafblind',
    title: 'Deafblind',
    description: 'Requires refreshable Braille display hardware drivers and tactile haptics.',
    isAvailableInV1: false,
    comingSoonNote: 'Coming in Phase 3',
    iconName: 'hand',
  },
];
