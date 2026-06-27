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
        <div class="mb-6 mt-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Tasks</h1>
            <p class="mt-1 text-[13px] text-gray-500">Short description will be placed here</p>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Avatars -->
            <div class="flex items-center">
              <div class="flex -space-x-2">
                <img class="h-8 w-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=33" alt=""/>
                <img class="h-8 w-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=47" alt=""/>
                <img class="h-8 w-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=12" alt=""/>
                <img class="h-8 w-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=5" alt=""/>
              </div>
              <span class="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[11px] font-medium text-gray-600">+2</span>
            </div>
            
            <!-- Invite Button -->
            <button class="flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-[13px] font-medium text-white hover:bg-brand-600 transition-colors shadow-sm">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
              Invite Member
            </button>
            
            <!-- Share Button -->
            <button class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              Share
            </button>
          </div>
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
