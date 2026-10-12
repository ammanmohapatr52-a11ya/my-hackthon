export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface SRSCardState {
  ease: number;
  interval: number; // in days
  reps: number;
  dueAt: number; // timestamp in ms
}

export function calculateNextReview(card: SRSCardState, rating: Rating): SRSCardState {
  let { ease, interval, reps } = card;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  switch (rating) {
    case 'again':
      reps = 0;
      interval = 1;
      ease = Math.max(1.3, ease - 0.2);
      break;

    case 'hard':
      reps += 1;
      interval = Math.max(1, Math.round(interval * 1.2));
      ease = Math.max(1.3, ease - 0.15);
      break;

    case 'good':
      reps += 1;
      if (reps === 1) {
        interval = 1;
      } else if (reps === 2) {
        interval = 3;
      } else {
        interval = Math.max(1, Math.round(interval * ease));
      }
      break;

    case 'easy':
      reps += 1;
      interval = Math.max(2, Math.round(Math.max(1, interval) * ease * 1.3));
      ease += 0.15;
      break;
  }

  const dueAt = Date.now() + interval * ONE_DAY_MS;

  return {
    ease: Number(ease.toFixed(2)),
    interval,
    reps,
    dueAt,
  };
}
