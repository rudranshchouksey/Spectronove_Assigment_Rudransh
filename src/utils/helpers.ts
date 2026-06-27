import type { TaskPriority } from '@/BLL/taskManager/types';

/**
 * Deterministic color from a name string — used for assignee avatar backgrounds.
 */
const AVATAR_COLORS = [
  '#6c5ce7', '#e17055', '#00b894', '#0984e3',
  '#fdcb6e', '#e84393', '#00cec9', '#6c5ce7',
  '#d63031', '#74b9ff', '#55efc4', '#fab1a0',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function isOverdue(dueDate: string, status: string): boolean {
  if (status === 'done') return false;
  return new Date(dueDate) < new Date();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateRange(iso: string): string {
  const d = new Date(iso);
  const end = new Date(d);
  end.setDate(end.getDate() + 28);
  const fmt = (dt: Date) =>
    dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${fmt(d)} - ${fmt(end)}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function getCurrentDateString(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `It's ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; class: string; bgClass: string }> = {
  high: {
    label: 'Urgent',
    class: 'text-priority-high',
    bgClass: 'bg-priority-high-bg text-priority-high',
  },
  medium: {
    label: 'Normal',
    class: 'text-priority-medium',
    bgClass: 'bg-priority-medium-bg text-priority-medium',
  },
  low: {
    label: 'Lowest',
    class: 'text-priority-low',
    bgClass: 'bg-priority-low-bg text-priority-low',
  },
};

export const TAG_COLORS: Record<string, string> = {
  frontend: 'bg-blue-100 text-blue-700',
  backend: 'bg-emerald-100 text-emerald-700',
  bug: 'bg-red-100 text-red-700',
  feature: 'bg-violet-100 text-violet-700',
  ux: 'bg-pink-100 text-pink-700',
  auth: 'bg-amber-100 text-amber-700',
  review: 'bg-cyan-100 text-cyan-700',
  testing: 'bg-teal-100 text-teal-700',
};

export function getTagClass(tag: string): string {
  return TAG_COLORS[tag.toLowerCase()] || 'bg-gray-100 text-gray-600';
}
