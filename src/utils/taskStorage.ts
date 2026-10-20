import { INITIAL_DASHBOARD_TASKS } from '../data/mockData.ts';
import type { DashboardTask } from '../types/index.ts';

export const TASK_STORAGE_KEY = 'onground_completed_task_ids';

export const KNOWN_TASK_IDS: readonly string[] = INITIAL_DASHBOARD_TASKS.map(t => t.id);

/**
 * Safely parses and validates completed task IDs from a raw JSON string.
 * Ensures only valid, known task IDs ('w1', 'w2', 'w3') are returned, deduplicated.
 */
export function parseCompletedTaskIds(raw: string | null | undefined): string[] {
  if (!raw || typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(
      (id): id is string => typeof id === 'string' && KNOWN_TASK_IDS.includes(id)
    );
    return Array.from(new Set(valid));
  } catch {
    return [];
  }
}

/**
 * Loads completed task IDs from browser localStorage safely.
 */
export function loadCompletedTaskIds(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    return parseCompletedTaskIds(window.localStorage.getItem(TASK_STORAGE_KEY));
  } catch (e) {
    console.warn('Unable to read completed tasks from localStorage:', e);
    return [];
  }
}

/**
 * Saves completed task IDs to browser localStorage safely.
 */
export function saveCompletedTaskIds(ids: string[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    const valid = parseCompletedTaskIds(JSON.stringify(ids));
    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(valid));
  } catch (e) {
    console.warn('Unable to save completed tasks to localStorage:', e);
  }
}

/**
 * Clears completed task IDs from browser localStorage safely.
 */
export function clearCompletedTaskIds(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(TASK_STORAGE_KEY);
  } catch (e) {
    console.warn('Unable to clear completed tasks from localStorage:', e);
  }
}

/**
 * Derives active dashboard tasks by excluding completed task IDs.
 */
export function deriveActiveTasks(
  allTasks: DashboardTask[],
  completedIds: string[]
): DashboardTask[] {
  return allTasks.filter(task => !completedIds.includes(task.id));
}

/**
 * Counts the active tasks belonging to a specific Pulse channel.
 */
export function getChannelTaskCount(
  activeTasks: DashboardTask[],
  channelName: string
): number {
  return activeTasks.filter(task => task.thread === channelName).length;
}
