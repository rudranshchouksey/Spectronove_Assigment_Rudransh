<script setup lang="ts">
import { ref } from 'vue';
import type { TaskManager } from '@/BLL/taskManager';

defineProps<{
  manager: TaskManager;
}>();

const activeNav = ref('Task');
const navItems = [
  { name: 'Dashboard', icon: 'dashboard' },
  { name: 'Notifications', icon: 'notifications' },
  { name: 'Task', icon: 'task' },
  { name: 'Calendar', icon: 'calendar' },
  { name: 'Member', icon: 'member' },
];

const teamItems = [
  { name: 'Gasvia Folder', color: '#f59e0b' },
  { name: 'Kilburn Project', color: '#6c5ce7' },
];
</script>

<template>
  <aside class="flex w-[240px] flex-col border-r border-border-light bg-sidebar-bg">
    <!-- Logo -->
    <div class="flex items-center justify-between px-5 py-5">
      <div class="flex items-center gap-2.5">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
          <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" stroke-linecap="round" />
          </svg>
        </div>
        <span class="text-base font-bold text-text-primary tracking-tight">Task.Co</span>
      </div>
      <button class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-sidebar-hover hover:text-text-secondary">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>

    <!-- Search -->
    <div class="px-4 mb-2">
      <div class="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-text-muted border border-border-light">
        <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <span>Search</span>
        <span class="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-text-muted">⌘K</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-2">
      <ul class="space-y-0.5">
        <li v-for="item in navItems" :key="item.name">
          <button
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150"
            :class="[
              activeNav === item.name
                ? 'bg-sidebar-active text-sidebar-text-active'
                : 'text-sidebar-text hover:bg-sidebar-hover hover:text-text-primary'
            ]"
            @click="activeNav = item.name"
          >
            <!-- Dashboard -->
            <svg v-if="item.icon === 'dashboard'" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"/></svg>
            <!-- Notifications -->
            <svg v-else-if="item.icon === 'notifications'" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <!-- Task -->
            <svg v-else-if="item.icon === 'task'" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            <!-- Calendar -->
            <svg v-else-if="item.icon === 'calendar'" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <!-- Member -->
            <svg v-else class="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>

            {{ item.name }}
          </button>
        </li>
      </ul>

      <!-- Teamspace Section -->
      <div class="mt-6">
        <div class="px-3 mb-2 flex items-center justify-between">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Teamspace</span>
        </div>
        <ul class="space-y-0.5">
          <li v-for="team in teamItems" :key="team.name">
            <button class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-text-primary">
              <span
                class="h-2 w-2 rounded-full shrink-0"
                :style="{ backgroundColor: team.color }"
              />
              {{ team.name }}
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Bottom Actions -->
    <div class="border-t border-border-light px-3 py-3 space-y-0.5">
      <button class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-text-primary">
        <svg class="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Settings
      </button>
      <button class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-red-500">
        <svg class="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        Logout
      </button>
    </div>
  </aside>
</template>
