import { reactive, computed, type ComputedRef } from 'vue';
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskFilters,
  TaskSortField,
  SortDirection,
  ViewMode,
} from './types';
import { PRIORITY_ORDER } from './types';
import { mockTasks } from './mockData';

function generateId(): string {
  return `t${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export class TaskManager {
  // ── Reactive State ────────────────────────────────────────────
  private state = reactive<{
    tasks: Task[];
    filters: TaskFilters;
    sortField: TaskSortField;
    sortDirection: SortDirection;
    viewMode: ViewMode;
    selectedTaskIds: Set<string>;
  }>({
    tasks: [...mockTasks],
    filters: {
      priority: 'all',
      assignee: 'all',
      search: '',
    },
    sortField: 'dueDate',
    sortDirection: 'asc',
    viewMode: (localStorage.getItem('taskViewMode') as ViewMode) || 'board',
    selectedTaskIds: new Set<string>(),
  });

  // ── Computed ──────────────────────────────────────────────────
  readonly tasks: ComputedRef<Task[]> = computed(() => this.state.tasks);

  readonly filteredTasks: ComputedRef<Task[]> = computed(() => {
    let result = [...this.state.tasks];

    const { priority, assignee, search } = this.state.filters;

    if (priority !== 'all') {
      result = result.filter((t) => t.priority === priority);
    }

    if (assignee !== 'all') {
      result = result.filter((t) => t.assignee === assignee);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    // Sort
    result.sort((a, b) => {
      const dir = this.state.sortDirection === 'asc' ? 1 : -1;
      if (this.state.sortField === 'priority') {
        return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;
      }
      if (this.state.sortField === 'dueDate') {
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir;
      }
      if (this.state.sortField === 'title') {
        return a.title.localeCompare(b.title) * dir;
      }
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    });

    return result;
  });

  readonly tasksByStatus: ComputedRef<Record<TaskStatus, Task[]>> = computed(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      'todo': [],
      'in-progress': [],
      'done': [],
    };
    for (const task of this.filteredTasks.value) {
      grouped[task.status].push(task);
    }
    return grouped;
  });

  readonly uniqueAssignees: ComputedRef<string[]> = computed(() => {
    const names = new Set(this.state.tasks.map((t) => t.assignee));
    return Array.from(names).sort();
  });

  readonly statusCounts: ComputedRef<Record<TaskStatus, number>> = computed(() => ({
    'todo': this.tasksByStatus.value['todo'].length,
    'in-progress': this.tasksByStatus.value['in-progress'].length,
    'done': this.tasksByStatus.value['done'].length,
  }));

  readonly totalTasks: ComputedRef<number> = computed(() => this.state.tasks.length);

  // ── View Mode ─────────────────────────────────────────────────
  get viewMode(): ViewMode {
    return this.state.viewMode;
  }

  setViewMode(mode: ViewMode): void {
    this.state.viewMode = mode;
    localStorage.setItem('taskViewMode', mode);
  }

  // ── Filters ───────────────────────────────────────────────────
  get filters(): TaskFilters {
    return this.state.filters;
  }

  setFilterPriority(priority: TaskPriority | 'all'): void {
    this.state.filters.priority = priority;
  }

  setFilterAssignee(assignee: string | 'all'): void {
    this.state.filters.assignee = assignee;
  }

  setSearch(query: string): void {
    this.state.filters.search = query;
  }

  resetFilters(): void {
    this.state.filters = { priority: 'all', assignee: 'all', search: '' };
  }

  // ── Sorting ───────────────────────────────────────────────────
  get sortField(): TaskSortField {
    return this.state.sortField;
  }

  get sortDirection(): SortDirection {
    return this.state.sortDirection;
  }

  setSort(field: TaskSortField): void {
    if (this.state.sortField === field) {
      this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortField = field;
      this.state.sortDirection = 'asc';
    }
  }

  // ── Selection ─────────────────────────────────────────────────
  get selectedTaskIds(): Set<string> {
    return this.state.selectedTaskIds;
  }

  toggleSelection(taskId: string): void {
    if (this.state.selectedTaskIds.has(taskId)) {
      this.state.selectedTaskIds.delete(taskId);
    } else {
      this.state.selectedTaskIds.add(taskId);
    }
  }

  isSelected(taskId: string): boolean {
    return this.state.selectedTaskIds.has(taskId);
  }

  clearSelection(): void {
    this.state.selectedTaskIds.clear();
  }

  // ── CRUD ──────────────────────────────────────────────────────
  moveTo(taskId: string, status: TaskStatus): void {
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
    }
  }

  addTask(data: Omit<Task, 'id' | 'createdAt'>): void {
    const newTask: Task = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    this.state.tasks.unshift(newTask);
  }

  updateTask(updated: Task): void {
    const idx = this.state.tasks.findIndex((t) => t.id === updated.id);
    if (idx !== -1) {
      this.state.tasks[idx] = { ...updated };
    }
  }

  deleteTask(taskId: string): void {
    const idx = this.state.tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      this.state.tasks.splice(idx, 1);
      this.state.selectedTaskIds.delete(taskId);
    }
  }

  getTaskById(taskId: string): Task | undefined {
    return this.state.tasks.find((t) => t.id === taskId);
  }
}
