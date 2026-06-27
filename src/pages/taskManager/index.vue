<script setup lang="ts">
import { ref } from 'vue';
import { TaskManager } from '@/BLL/taskManager';
import SidebarNav from '@/components/SidebarNav.vue';
import HeaderBar from '@/components/HeaderBar.vue';
import ViewToggle from '@/components/ViewToggle.vue';
import KanbanBoard from '@/components/KanbanBoard.vue';
import ListView from '@/components/ListView.vue';
import FilterBar from '@/components/FilterBar.vue';
import AddTaskModal from '@/components/AddTaskModal.vue';
import TaskDetailModal from '@/components/TaskDetailModal.vue';
import type { Task } from '@/BLL/taskManager';

const manager = new TaskManager();
const showAddModal = ref(false);
const detailTask = ref<Task | null>(null);

function openAddModal() {
  showAddModal.value = true;
}

function openDetail(task: Task) {
  detailTask.value = task;
}

function closeDetail() {
  detailTask.value = null;
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#f5f5fa]">
    <!-- Sidebar -->
    <SidebarNav :manager="manager" />

    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <HeaderBar :manager="manager" @add-task="openAddModal" />

      <!-- Content Body -->
      <main class="flex-1 overflow-y-auto px-8 pb-8">
        <!-- Project Header -->
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h1 class="text-lg font-semibold text-text-primary">Daily Back-End Task</h1>
            <div class="mt-1 flex items-center gap-4 text-xs text-text-secondary">
              <span class="flex items-center gap-1">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Developer Team
              </span>
              <span class="flex items-center gap-1">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Important
              </span>
              <span class="flex items-center gap-1">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                {{ manager.totalTasks.value }} Task{{ manager.totalTasks.value !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>
          <FilterBar :manager="manager" />
        </div>

        <!-- View Toggle -->
        <ViewToggle :manager="manager" />

        <!-- Views -->
        <KanbanBoard
          v-if="manager.viewMode === 'board'"
          :manager="manager"
          @open-detail="openDetail"
        />
        <ListView
          v-else
          :manager="manager"
          @open-detail="openDetail"
        />
      </main>
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <AddTaskModal
        v-if="showAddModal"
        :manager="manager"
        @close="showAddModal = false"
      />
      <TaskDetailModal
        v-if="detailTask"
        :task="detailTask"
        :manager="manager"
        @close="closeDetail"
      />
    </Teleport>
  </div>
</template>
