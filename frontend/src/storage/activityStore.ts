import { db, type DailyActivity } from './db';

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function recordSolvedProblem(): Promise<void> {
  const today = getTodayString();
  const existing = await db.activity.get(today);
  if (existing) {
    await db.activity.update(today, {
      problemsSolved: existing.problemsSolved + 1,
      timestamp: Date.now(),
    });
  } else {
    await db.activity.put({
      date: today,
      problemsSolved: 1,
      flashcardsReviewed: 0,
      timestamp: Date.now(),
    });
  }
}

export async function recordReviewedFlashcard(): Promise<void> {
  const today = getTodayString();
  const existing = await db.activity.get(today);
  if (existing) {
    await db.activity.update(today, {
      flashcardsReviewed: existing.flashcardsReviewed + 1,
      timestamp: Date.now(),
    });
  } else {
    await db.activity.put({
      date: today,
      problemsSolved: 0,
      flashcardsReviewed: 1,
      timestamp: Date.now(),
    });
  }
}

export async function getTotalProblemsSolved(): Promise<number> {
  const all = await db.activity.toArray();
  return all.reduce((sum, item) => sum + (item.problemsSolved || 0), 0);
}

export async function calculateStreak(): Promise<number> {
  const activities = await db.activity.toArray();
  if (activities.length === 0) return 0;

  const dateSet = new Set(activities.filter(a => (a.problemsSolved > 0 || a.flashcardsReviewed > 0)).map(a => a.date));
  
  const today = new Date();
  let current = new Date(today);
  let streak = 0;

  // Format helper
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = fmt(today);
  // Check if today has activity; if not, check if yesterday was active to continue streak
  if (!dateSet.has(todayStr)) {
    current.setDate(current.getDate() - 1);
  }

  while (dateSet.has(fmt(current))) {
    streak++;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

export interface WeekDayActivity {
  dayName: string; // M, T, W, T, F, S, S
  dateStr: string;
  hasActivity: boolean;
  isToday: boolean;
}

export async function getThisWeekActivity(): Promise<WeekDayActivity[]> {
  const activities = await db.activity.toArray();
  const activeDates = new Set(activities.filter(a => a.problemsSolved > 0).map(a => a.date));

  const now = new Date();
  // Get Monday of current week
  const dayOfWeek = now.getDay(); // 0 is Sunday
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  const days: WeekDayActivity[] = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    days.push({
      dayName: dayNames[i],
      dateStr,
      hasActivity: activeDates.has(dateStr),
      isToday,
    });
  }

  return days;
}
