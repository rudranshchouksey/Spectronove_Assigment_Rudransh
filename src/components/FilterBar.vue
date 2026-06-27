<script setup lang="ts">
import { ref } from 'vue';
import type { TaskManager, TaskPriority } from '@/BLL/taskManager';

const props = defineProps<{
  manager: TaskManager;
}>();

const showPriorityFilter = ref(false);
const showAssigneeFilter = ref(false);

function togglePriorityFilter() {
  showPriorityFilter.value = !showPriorityFilter.value;
  showAssigneeFilter.value = false;
}

function toggleAssigneeFilter() {
  showAssigneeFilter.value = !showAssigneeFilter.value;
  showPriorityFilter.value = false;
}

function setPriority(p: TaskPriority | 'all') {
  props.manager.setFilterPriority(p);
  showPriorityFilter.value = false;
}

function setAssignee(a: string | 'all') {
  props.manager.setFilterAssignee(a);
  showAssigneeFilter.value = false;
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Priority Filter -->
    <div class="relative">
      <button
        class="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors"
        :class="[
          manager.filters.priority !== 'all'
            ? 'border-brand-300 bg-brand-50 text-brand-600'
            : 'text-text-secondary hover:bg-surface-hover'
        ]"
        @click="togglePriorityFilter"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
        {{ manager.filters.priority === 'all' ? 'Filter' : manager.filters.priority }}
      </button>

      <Transition name="fade">
        <div
          v-if="showPriorityFilter"
          class="absolute right-0 top-full z-30 mt-1 w-36 rounded-lg border border-border-light bg-white py-1 shadow-dropdown"
        >
          <button
            class="flex w-full items-center px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover"
            @click="setPriority('all')"
          >All Priorities</button>
          <button
            class="flex w-full items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-surface-hover"
            @click="setPriority('high')"
          >🔴 High</button>
          <button
            class="flex w-full items-center px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-surface-hover"
            @click="setPriority('medium')"
          >🟡 Medium</button>
          <button
            class="flex w-full items-center px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-surface-hover"
            @click="setPriority('low')"
          >🔵 Low</button>
        </div>
      </Transition>
    </div>

    <!-- Assignee Filter -->
    <div class="relative">
      <button
        class="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors"
        :class="[
          manager.filters.assignee !== 'all'
            ? 'border-brand-300 bg-brand-50 text-brand-600'
            : 'text-text-secondary hover:bg-surface-hover'
        ]"
        @click="toggleAssigneeFilter"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
        {{ manager.filters.assignee === 'all' ? 'Filter' : manager.filters.assignee.split(' ')[0] }}
      </button>

      <Transition name="fade">
        <div
          v-if="showAssigneeFilter"
          class="absolute right-0 top-full z-30 mt-1 w-48 rounded-lg border border-border-light bg-white py-1 shadow-dropdown"
        >
          <button
            class="flex w-full items-center px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover"
            @click="setAssignee('all')"
          >All Assignees</button>
          <button
            v-for="name in manager.uniqueAssignees.value"
            :key="name"
            class="flex w-full items-center px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover"
            @click="setAssignee(name)"
          >{{ name }}</button>
        </div>
      </Transition>
    </div>
  </div>
</template>
