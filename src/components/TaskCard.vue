<script setup lang="ts">
import type { Task, TaskManager } from '@/BLL/taskManager';
import {
  getAvatarColor,
  getInitials,
  formatDate,
} from '@/utils/helpers';

defineProps<{
  task: Task;
  manager: TaskManager;
}>();

const TAG_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  'todo': { label: 'Not Started', dot: 'bg-gray-400', bg: 'bg-white', text: 'text-gray-700' },
  'in-progress': { label: 'In Research', dot: 'bg-blue-500', bg: 'bg-white', text: 'text-gray-700' },
  'done': { label: 'Complete', dot: 'bg-pink-500', bg: 'bg-white', text: 'text-gray-700' },
};
</script>

<template>
  <div
    class="group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-md hover:border-gray-300 flex flex-col gap-3"
  >
    <!-- Top Row: Tag & More Button -->
    <div class="flex items-center justify-between">
      <span
        class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium"
        :class="[TAG_CONFIG[task.status]?.bg, TAG_CONFIG[task.status]?.text]"
      >
        <span class="h-1.5 w-1.5 rounded-full" :class="TAG_CONFIG[task.status]?.dot"></span>
        {{ TAG_CONFIG[task.status]?.label }}
      </span>
      
      <button class="text-gray-400 hover:text-gray-600 opacity-0 transition-opacity group-hover:opacity-100">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01"/></svg>
      </button>
    </div>

    <!-- Title & Description -->
    <div>
      <h4 class="text-[14px] font-bold text-gray-900 leading-snug mb-1.5">
        {{ task.title }}
      </h4>
      <p class="text-[12px] text-gray-500 line-clamp-2 leading-relaxed">
        {{ task.description || 'No description provided.' }}
      </p>
    </div>

    <!-- Assignees -->
    <div class="flex items-center gap-2 mt-1">
      <span class="text-[12px] text-gray-400 font-medium">Assignees :</span>
      <div
        class="flex h-6 w-6 items-center justify-center rounded-full border border-white text-[9px] font-bold text-white shadow-sm"
        :style="{ backgroundColor: getAvatarColor(task.assignee) }"
        :title="task.assignee"
      >
        {{ getInitials(task.assignee) }}
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px w-full bg-gray-100 my-1"></div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-[11px] text-gray-400 font-medium">
      <div class="flex items-center gap-3.5">
        <!-- Comments -->
        <div class="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          12 Comments
        </div>
        <!-- Links -->
        <div class="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
          1 Links
        </div>
      </div>
      <!-- Date / Priority / Tasks -->
      <div class="flex items-center gap-1.5 text-brand-500 font-semibold bg-brand-50 px-2 py-0.5 rounded text-[10px]">
        0/3
      </div>
    </div>
  </div>
</template>
