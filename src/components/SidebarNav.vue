<script setup lang="ts">
import { ref } from 'vue';
import type { TaskManager } from '@/BLL/taskManager';

defineProps<{
  manager: TaskManager;
}>();

const activeNav = ref('Tasks');

const menuItems = [
  { name: 'Dashboard', icon: 'dashboard' },
  { name: 'Inbox', icon: 'inbox' },
  { name: 'Calendar', icon: 'calendar' },
];

const teamItems = [
  { name: 'Tasks', icon: 'tasks' },
  { name: 'Docs', icon: 'docs' },
  { name: 'Meeting', icon: 'meeting' },
];

const otherItems = [
  { name: 'Settings', icon: 'settings' },
  { name: 'Support', icon: 'support' },
];
</script>

<template>
  <aside class="flex w-[260px] flex-col border-r border-border-light bg-[#f8f9fa]">
    <!-- User Profile Card -->
    <div class="px-4 pt-6 pb-2">
      <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div class="flex items-center gap-3">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" class="h-9 w-9 rounded-lg object-cover" />
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-gray-900 leading-tight">Davis Donin</span>
            <span class="text-[11px] text-gray-500">daviddoni@gmail.com</span>
          </div>
        </div>
        <button class="text-gray-400 hover:text-gray-600">
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/></svg>
        </button>
      </div>
    </div>

    <!-- Navigation Sections -->
    <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-6">
      <!-- Menu Section -->
      <div>
        <div class="mb-2 px-1 text-[11px] font-semibold text-gray-400">Menu</div>
        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.name">
            <button
              class="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors"
              :class="[
                activeNav === item.name
                  ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
              ]"
              @click="activeNav = item.name"
            >
              <svg v-if="item.icon === 'dashboard'" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              <svg v-else-if="item.icon === 'inbox'" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <svg v-else-if="item.icon === 'calendar'" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ item.name }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Team spaces Section -->
      <div>
        <div class="mb-2 flex items-center justify-between px-1">
          <span class="text-[11px] font-semibold text-gray-400">Team spaces</span>
          <button class="text-gray-400 hover:text-gray-600">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
        <ul class="space-y-1">
          <li v-for="item in teamItems" :key="item.name">
            <button
              class="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors"
              :class="[
                activeNav === item.name
                  ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
              ]"
              @click="activeNav = item.name"
            >
              <svg v-if="item.icon === 'tasks'" class="h-4 w-4" :class="activeNav === item.name ? 'text-brand-500' : 'text-gray-400'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><polyline points="9 12 12 15 17 9"></polyline></svg>
              <svg v-else-if="item.icon === 'docs'" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <svg v-else-if="item.icon === 'meeting'" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              {{ item.name }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Other Section -->
      <div>
        <div class="mb-2 px-1 text-[11px] font-semibold text-gray-400">Other</div>
        <ul class="space-y-1">
          <li v-for="item in otherItems" :key="item.name">
            <button
              class="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors"
              :class="[
                activeNav === item.name
                  ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
              ]"
              @click="activeNav = item.name"
            >
              <svg v-if="item.icon === 'settings'" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <svg v-else-if="item.icon === 'support'" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              {{ item.name }}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

