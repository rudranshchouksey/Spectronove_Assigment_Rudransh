<script setup lang="ts">
import type { TaskManager, ViewMode } from '@/BLL/taskManager';

const props = defineProps<{
  manager: TaskManager;
}>();

interface ViewOption {
  mode: ViewMode;
  label: string;
  icon: string;
}

const viewOptions: ViewOption[] = [
  { mode: 'board', label: 'Board', icon: 'board' },
  { mode: 'list', label: 'List', icon: 'list' },
];

const extraTabs = ['Grid', 'Calendar'];

function setView(mode: ViewMode) {
  props.manager.setViewMode(mode);
}
</script>

<template>
  <div class="mb-5 flex items-center justify-between">
    <div class="inline-flex items-center rounded-lg border border-border-light bg-white p-1">
      <!-- Extra tabs (non-functional, visual only) -->
      <button
        v-for="tab in extraTabs"
        :key="tab"
        class="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
      >
        <svg v-if="tab === 'Grid'" class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        <svg v-else class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        {{ tab }}
      </button>

      <!-- Functional view toggles -->
      <button
        v-for="option in viewOptions"
        :key="option.mode"
        class="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all duration-150"
        :class="[
          manager.viewMode === option.mode
            ? 'bg-brand-500 text-white shadow-sm'
            : 'text-text-muted hover:text-text-secondary'
        ]"
        @click="setView(option.mode)"
      >
        <!-- List icon -->
        <svg v-if="option.icon === 'list'" class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        <!-- Board icon -->
        <svg v-else class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
