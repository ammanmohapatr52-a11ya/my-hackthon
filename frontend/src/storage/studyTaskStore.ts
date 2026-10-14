import { db, type StudyTask, type TaskPriority, type TaskCategory, type TaskStatus } from './db';
import { getCurrentAuthUser } from '../services/userService';

export type { StudyTask, TaskPriority, TaskCategory, TaskStatus };

export interface TaskComputedMeta {
  daysRemaining: number;
  status: TaskStatus;
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  reminderNotice: string;
  calculatedProgress: number;
  formattedDeadline: string;
}

export interface StudyPlannerStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueSoon: number;
  completionRate: number;
}

const LOCAL_STORAGE_KEY = 'neurobridge_study_tasks_backup';

function getActiveUserId(): string {
  const user = getCurrentAuthUser();
  return user?.username || user?.id || 'guest';
}

function formatDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Computes live status, countdown days, progress bar, and user-friendly reminders
 */
export function calculateTaskMeta(task: StudyTask): TaskComputedMeta {
  const now = new Date();
  const todayStr = formatDateISO(now);
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let daysRemaining = 0;
  if (task.dueDate) {
    const [y, m, d] = task.dueDate.split('-').map(Number);
    const dueMidnight = new Date(y, m - 1, d).getTime();
    daysRemaining = Math.round((dueMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
  }

  // Determine status & notifications
  let status: TaskStatus;
  let statusLabel: string;
  let statusColor: string;
  let statusBg: string;
  let reminderNotice: string;

  if (task.completed) {
    status = 'completed';
    statusLabel = 'Completed';
    statusColor = '#10b981';
    statusBg = 'rgba(16, 185, 129, 0.15)';
    reminderNotice = 'Great work! You have completed this task.';
  } else if (task.dueDate && task.dueDate < todayStr) {
    status = 'overdue';
    statusLabel = 'Overdue';
    statusColor = '#ef4444';
    statusBg = 'rgba(239, 68, 68, 0.16)';
    reminderNotice = 'This task is overdue. Please review it and update your plan.';
  } else if (daysRemaining === 0) {
    status = 'due_today';
    statusLabel = 'Due today';
    statusColor = '#f97316';
    statusBg = 'rgba(249, 115, 22, 0.16)';
    reminderNotice = 'Your task is due today. Make time to complete it!';
  } else if (daysRemaining === 1) {
    status = 'due_tomorrow';
    statusLabel = 'Due tomorrow';
    statusColor = '#f59e0b';
    statusBg = 'rgba(245, 158, 11, 0.16)';
    reminderNotice = 'Reminder: Your task is due tomorrow. Try to finish it on time!';
  } else if (daysRemaining <= 3 && daysRemaining > 1) {
    status = 'due_soon';
    statusLabel = 'Due soon';
    statusColor = '#ea580c';
    statusBg = 'rgba(234, 88, 12, 0.14)';
    reminderNotice = 'Your deadline is coming soon! Please complete your task on time.';
  } else if (task.startDate && task.startDate > todayStr) {
    status = 'upcoming';
    statusLabel = 'Upcoming';
    statusColor = '#64748b';
    statusBg = 'rgba(100, 116, 139, 0.16)';
    reminderNotice = `Upcoming task. Scheduled to begin on ${formatFriendlyDate(task.startDate)}.`;
  } else {
    status = 'in_progress';
    statusLabel = 'In progress';
    statusColor = '#0284c7';
    statusBg = 'rgba(2, 132, 199, 0.15)';
    reminderNotice = `In progress · ${daysRemaining} days remaining until deadline.`;
  }

  // Calculate timeline progress percentage
  let calculatedProgress = task.progressPercent ?? 0;
  if (task.completed) {
    calculatedProgress = 100;
  } else if (task.progressPercent === undefined || task.progressPercent === 0) {
    if (task.startDate && task.dueDate) {
      const [sy, sm, sd] = task.startDate.split('-').map(Number);
      const [dy, dm, dd] = task.dueDate.split('-').map(Number);
      const startT = new Date(sy, sm - 1, sd).getTime();
      const dueT = new Date(dy, dm - 1, dd).getTime();
      const totalSpan = dueT - startT;
      const elapsed = todayMidnight - startT;

      if (totalSpan <= 0) {
        calculatedProgress = 50;
      } else {
        const pct = Math.round((elapsed / totalSpan) * 100);
        calculatedProgress = Math.max(10, Math.min(95, pct));
      }
    } else {
      calculatedProgress = 25;
    }
  }

  return {
    daysRemaining,
    status,
    statusLabel,
    statusColor,
    statusBg,
    reminderNotice,
    calculatedProgress,
    formattedDeadline: formatFriendlyDate(task.dueDate),
  };
}

function broadcastChange(): void {
  try {
    window.dispatchEvent(new CustomEvent('neurobridge_study_tasks_changed'));
  } catch (err) {
    console.warn('Could not broadcast tasks change:', err);
  }
}

function saveLocalStorageBackup(tasks: StudyTask[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.warn('Could not write tasks to localStorage:', err);
  }
}

function getLocalStorageBackup(): StudyTask[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Initial sample tasks matching the user mockup presentation
 */
function createDefaultSeedTasks(): Omit<StudyTask, 'id'>[] {
  const now = new Date();
  const userId = getActiveUserId();

  const addDays = (days: number): string => {
    const target = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return formatDateISO(target);
  };

  return [
    {
      userId,
      title: 'Complete DSA Assignment',
      description: 'Implement AVL Tree balanced insertions, traversal algorithms, and complexity analysis.',
      startDate: addDays(-4),
      dueDate: addDays(1), // due tomorrow / soon
      priority: 'high',
      category: 'assignment',
      completed: false,
      progressPercent: 65,
      createdAt: Date.now() - 4 * 86400000,
    },
    {
      userId,
      title: 'Database Project Report',
      description: 'Document ER diagrams, normalization steps up to BCNF, and PostgreSQL indexing benchmarks.',
      startDate: addDays(0),
      dueDate: addDays(5),
      priority: 'medium',
      category: 'project',
      completed: false,
      progressPercent: 25,
      createdAt: Date.now() - 1 * 86400000,
    },
    {
      userId,
      title: 'Calculus Chapter Review',
      description: 'Revise integration by parts, partial fractions, and differential equations.',
      startDate: addDays(-7),
      dueDate: addDays(-1),
      priority: 'medium',
      category: 'study',
      completed: true,
      progressPercent: 100,
      createdAt: Date.now() - 7 * 86400000,
      completedAt: Date.now() - 1 * 86400000,
    },
    {
      userId,
      title: 'Chemistry Lab Submission',
      description: 'Submit titration curve data, error percentage calculations, and lab logbook signoff.',
      startDate: addDays(-2),
      dueDate: addDays(3),
      priority: 'high',
      category: 'other',
      completed: false,
      progressPercent: 40,
      createdAt: Date.now() - 2 * 86400000,
    },
  ];
}

/**
 * Retrieve all tasks for current user or session, seeding default sample tasks if empty.
 */
export async function getAllStudyTasks(): Promise<StudyTask[]> {
  try {
    let tasks: StudyTask[] = [];
    try {
      tasks = await db.studyTasks.toArray();
    } catch (dbErr) {
      console.warn('Dexie studyTasks query error, falling back to localStorage:', dbErr);
      tasks = getLocalStorageBackup();
    }

    if (!tasks || tasks.length === 0) {
      const seeds = createDefaultSeedTasks();
      const createdTasks: StudyTask[] = [];

      for (const item of seeds) {
        try {
          const id = await db.studyTasks.add(item as StudyTask);
          createdTasks.push({ ...item, id });
        } catch {
          const fallbackId = Date.now() + Math.floor(Math.random() * 1000);
          createdTasks.push({ ...item, id: fallbackId });
        }
      }

      saveLocalStorageBackup(createdTasks);
      return createdTasks;
    }

    saveLocalStorageBackup(tasks);
    return tasks;
  } catch (err) {
    console.error('getAllStudyTasks failed:', err);
    return getLocalStorageBackup();
  }
}

/**
 * Add a new study task with validation
 */
export async function addStudyTask(
  data: Omit<StudyTask, 'id' | 'createdAt' | 'completed' | 'progressPercent'> & {
    progressPercent?: number;
    completed?: boolean;
  }
): Promise<StudyTask> {
  if (!data.title || !data.title.trim()) {
    throw new Error('Task title is required.');
  }
  if (!data.dueDate) {
    throw new Error('Due date is required.');
  }

  const userId = data.userId || getActiveUserId();
  const newTask: StudyTask = {
    userId,
    title: data.title.trim(),
    description: data.description?.trim() || '',
    startDate: data.startDate || formatDateISO(new Date()),
    dueDate: data.dueDate,
    priority: data.priority || 'medium',
    category: data.category || 'study',
    completed: Boolean(data.completed),
    progressPercent: data.progressPercent ?? 15,
    createdAt: Date.now(),
  };

  try {
    const id = await db.studyTasks.add(newTask);
    newTask.id = id;
  } catch (err) {
    console.warn('Could not insert to Dexie, using fallback ID:', err);
    newTask.id = Date.now();
  }

  const currentList = getLocalStorageBackup();
  currentList.push(newTask);
  saveLocalStorageBackup(currentList);

  broadcastChange();
  return newTask;
}

/**
 * Update an existing task
 */
export async function updateStudyTask(id: number, changes: Partial<StudyTask>): Promise<void> {
  try {
    await db.studyTasks.update(id, changes);
  } catch (err) {
    console.warn('Could not update task in Dexie:', err);
  }

  const list = getLocalStorageBackup();
  const idx = list.findIndex((t) => t.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...changes };
    saveLocalStorageBackup(list);
  }

  broadcastChange();
}

/**
 * Toggle task completion
 */
export async function toggleStudyTaskCompleted(id: number): Promise<boolean> {
  const tasks = await getAllStudyTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return false;

  const nextCompleted = !task.completed;
  await updateStudyTask(id, {
    completed: nextCompleted,
    progressPercent: nextCompleted ? 100 : Math.max(10, task.progressPercent || 25),
    completedAt: nextCompleted ? Date.now() : undefined,
  });

  return nextCompleted;
}

/**
 * Delete a study task
 */
export async function deleteStudyTask(id: number): Promise<void> {
  try {
    await db.studyTasks.delete(id);
  } catch (err) {
    console.warn('Could not delete from Dexie:', err);
  }

  const list = getLocalStorageBackup().filter((t) => t.id !== id);
  saveLocalStorageBackup(list);

  broadcastChange();
}

/**
 * Compute aggregate statistics for the dashboard
 */
export function calculateStudyPlannerStats(tasks: StudyTask[]): StudyPlannerStats {
  const total = tasks.length;
  if (total === 0) {
    return {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      dueSoon: 0,
      completionRate: 0,
    };
  }

  let completed = 0;
  let overdue = 0;
  let dueSoon = 0;

  for (const t of tasks) {
    const meta = calculateTaskMeta(t);
    if (t.completed) {
      completed++;
    } else if (meta.status === 'overdue') {
      overdue++;
    } else if (
      meta.status === 'due_soon' ||
      meta.status === 'due_today' ||
      meta.status === 'due_tomorrow'
    ) {
      dueSoon++;
    }
  }

  const pending = total - completed;
  const completionRate = Math.round((completed / total) * 100);

  return {
    total,
    completed,
    pending,
    overdue,
    dueSoon,
    completionRate,
  };
}
