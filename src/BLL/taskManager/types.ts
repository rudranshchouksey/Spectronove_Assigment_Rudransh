export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string; // ISO 8601 format
  assignee: string;
  status: TaskStatus;
  tags: string[];
  createdAt: string; // ISO 8601 format
}

export type TaskSortField = 'dueDate' | 'priority' | 'title' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface TaskFilters {
  priority: TaskPriority | 'all';
  assignee: string | 'all';
  search: string;
}

export type ViewMode = 'board' | 'list';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'Not Started',
  'in-progress': 'In Progress',
  'done': 'Done',
};

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  'high': 3,
  'medium': 2,
  'low': 1,
};
