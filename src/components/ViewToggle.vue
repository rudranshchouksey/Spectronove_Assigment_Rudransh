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

const extraTabs = [
  { name: 'Overview', icon: '' },
  { name: 'Table', icon: 'table' },
  { name: 'Timeline', icon: 'timeline' },
];

function setView(mode: ViewMode) {
  props.manager.setViewMode(mode);
}
</script>

<template>
  <div class="mb-6 flex items-center justify-between border-b border-gray-200">
    <!-- Left: Tabs -->
    <div class="flex items-center gap-6">
      <button class="flex items-center gap-1.5 pb-3 pt-1 text-[13.5px] font-medium text-gray-500 hover:text-gray-700 transition-colors">
        Overview
      </button>

      <button
        v-for="option in viewOptions"
        :key="option.mode"
        class="relative flex items-center gap-1.5 pb-3 pt-1 text-[13.5px] font-medium transition-colors"
        :class="[
          manager.viewMode === option.mode
            ? 'text-brand-500'
            : 'text-gray-500 hover:text-gray-700'
        ]"
        @click="setView(option.mode)"
      >
        <!-- Board icon -->
        <svg v-if="option.icon === 'board'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>
        <!-- List icon -->
        <svg v-else-if="option.icon === 'list'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        
        {{ option.label }}
        
        <!-- Active Underline -->
        <div
          v-if="manager.viewMode === option.mode"
          class="absolute bottom-0 left-0 h-0.5 w-full bg-brand-500 rounded-t-full"
        ></div>
      </button>

      <button class="flex items-center gap-1.5 pb-3 pt-1 text-[13.5px] font-medium text-gray-500 hover:text-gray-700 transition-colors">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
        Table
      </button>

      <button class="flex items-center gap-1.5 pb-3 pt-1 text-[13.5px] font-medium text-gray-500 hover:text-gray-700 transition-colors">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Timeline
      </button>
    </div>

    <!-- Right: Filters & Tools -->
    <div class="flex items-center gap-4 pb-2">
      <!-- Filter -->
      <button class="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
        Filter
      </button>
      
      <!-- Group by -->
      <button class="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        Group by
      </button>
      
      <!-- Sort -->
      <button class="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>
        Sort
      </button>
      
      <!-- More Options -->
      <button class="text-gray-400 hover:text-gray-600 ml-1">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01"/></svg>
      </button>
    </div>
  </div>
</template>
