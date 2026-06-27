<script setup lang="ts">
import type { TaskManager } from '@/BLL/taskManager';

defineProps<{
  manager: TaskManager;
}>();
</script>

<template>
  <header class="flex h-[60px] items-center justify-between border-b border-gray-200 bg-white px-8">
    <!-- Left: Breadcrumbs -->
    <div class="flex items-center gap-2 text-[13px] text-gray-500">
      <button class="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
      </button>
      <span class="cursor-pointer hover:text-gray-700">Team spaces</span>
      <svg class="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      <span class="font-medium text-gray-900">Tasks</span>
    </div>

    <!-- Right: Search & Actions -->
    <div class="flex items-center gap-4">
      <!-- Search -->
      <div class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-400 w-[240px]">
        <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <span class="flex-1">Search</span>
        <span class="flex items-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">⌘F</span>
      </div>

      <!-- Action Icons -->
      <div class="flex items-center gap-2">
        <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </button>
        <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </button>
      </div>
    </div>
  </header>
</template>
