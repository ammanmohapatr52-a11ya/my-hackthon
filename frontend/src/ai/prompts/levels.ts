/**
 * P4 — Level modifiers
 * From Document 06: AI Prompt Pack, GK Improvement Plan and Backend Build Prompt
 */

export function getLevelModifier(level: 1 | 2 | 3): string {
  switch (level) {
    case 1:
      return `LEVEL 1 — VERY SIMPLE
Use words a 12-year-old knows. Sentences of 12 words or fewer. One idea per sentence. Use a small everyday comparison if it helps. Give a memory hook. Explain any hard word in brackets. At most 3 key facts.`;

    case 2:
      return `LEVEL 2 — STUDENT
Use standard textbook language and correct terms. Give 3 to 5 key facts and one line of context. A memory hook is optional.`;

    case 3:
      return `LEVEL 3 — ADVANCED
Be precise and technical. Give background, cause and effect, and important exceptions or debates. Up to 5 key facts. Mention how details differ between sources when they do.`;
  }
}
