<script setup lang="ts">
import type { Task, TaskManager } from '@/BLL/taskManager';
import {
  getAvatarColor,
  getInitials,
  isOverdue,
  formatDate,
  PRIORITY_CONFIG,
  getTagClass,
} from '@/utils/helpers';

defineProps<{
  task: Task;
  manager: TaskManager;
}>();

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  'todo': { label: 'Not Started', class: 'bg-amber-100 text-amber-700' },
  'in-progress': { label: 'In Research', class: 'bg-blue-100 text-blue-700' },
  'done': { label: 'Complete', class: 'bg-emerald-100 text-emerald-700' },
};
</script>

<template>
  <div
    class="group cursor-pointer rounded-xl border border-border-light bg-white p-4 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
  >
    <!-- Status Badge -->
    <div class="mb-3">
      <span
        class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
        :class="STATUS_BADGE[task.status]?.class"
      >
        <span class="h-1.5 w-1.5 rounded-full" :class="task.status === 'todo' ? 'bg-amber-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-emerald-500'"></span>
        {{ STATUS_BADGE[task.status]?.label }}
      </span>
    </div>

    <!-- Title -->
    <h4 class="mb-1 text-sm font-semibold text-text-primary line-clamp-1">
      {{ task.title }}
    </h4>

    <!-- Description -->
    <p class="mb-3 text-xs text-text-secondary line-clamp-2 leading-relaxed">
      {{ task.description }}
    </p>

    <!-- Tags -->
    <div v-if="task.tags.length > 0" class="mb-3 flex flex-wrap gap-1">
      <span
        v-for="tag in task.tags.slice(0, 3)"
        :key="tag"
        class="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
        :class="getTagClass(tag)"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between">
      <!-- Assignee -->
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-text-muted">Assignees :</span>
        <div
          class="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white shadow-sm"
          :style="{ backgroundColor: getAvatarColor(task.assignee) }"
          :title="task.assignee"
        >
          {{ getInitials(task.assignee) }}
        </div>
      </div>

      <!-- Priority -->
      <span
        class="rounded-md px-2 py-0.5 text-[10px] font-semibold"
        :class="PRIORITY_CONFIG[task.priority].bgClass"
      >
        {{ PRIORITY_CONFIG[task.priority].label }}
      </span>
    </div>

    <!-- Due Date -->
    <div class="mt-2.5 flex items-center gap-1.5 text-[10px]">
      <svg class="h-3 w-3" :class="isOverdue(task.dueDate, task.status) ? 'text-danger' : 'text-text-muted'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      <span
        class="font-medium"
        :class="isOverdue(task.dueDate, task.status) ? 'text-danger font-semibold' : 'text-text-muted'"
      >
        {{ formatDate(task.dueDate) }}
      </span>
      <span
        v-if="isOverdue(task.dueDate, task.status)"
        class="ml-1 flex items-center gap-0.5 rounded-full bg-danger-bg px-1.5 py-0.5 text-[9px] font-bold text-danger"
      >
        <svg class="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        Overdue
      </span>
    </div>

    <!-- More button -->
    <div class="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
      <button class="rounded-md p-1 text-text-muted hover:bg-surface-hover hover:text-text-secondary">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/></svg>
      </button>
    </div>
  </div>
</template>
