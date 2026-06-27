<script setup lang="ts">
import { ref } from 'vue';
import type { TaskManager, Task, TaskStatus } from '@/BLL/taskManager';
import { STATUS_LABELS } from '@/BLL/taskManager';
import TaskCard from './TaskCard.vue';

const props = defineProps<{
  manager: TaskManager;
}>();

const emit = defineEmits<{
  'open-detail': [task: Task];
}>();

const columns: { status: TaskStatus; title: string; dotColor: string }[] = [
  { status: 'todo', title: 'To do', dotColor: 'bg-amber-400' },
  { status: 'in-progress', title: 'In Progress', dotColor: 'bg-blue-400' },
  { status: 'done', title: 'Done', dotColor: 'bg-pink-400' },
];

const dragOverColumn = ref<TaskStatus | null>(null);

function onDragStart(e: DragEvent, taskId: string) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  }
  const target = e.target as HTMLElement;
  target.classList.add('opacity-50');
}

function onDragEnd(e: DragEvent) {
  const target = e.target as HTMLElement;
  target.classList.remove('opacity-50');
  dragOverColumn.value = null;
}

function onDragOver(e: DragEvent, status: TaskStatus) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
  dragOverColumn.value = status;
}

function onDragLeave(_e: DragEvent, status: TaskStatus) {
  if (dragOverColumn.value === status) {
    dragOverColumn.value = null;
  }
}

function onDrop(e: DragEvent, status: TaskStatus) {
  e.preventDefault();
  dragOverColumn.value = null;
  const taskId = e.dataTransfer?.getData('text/plain');
  if (taskId) {
    props.manager.moveTo(taskId, status);
  }
}
</script>

<template>
  <div class="grid grid-cols-3 gap-6">
    <div
      v-for="col in columns"
      :key="col.status"
      class="flex flex-col rounded-xl border border-gray-200 bg-[#f8f9fa] p-4 transition-colors duration-200"
      :class="{ 'ring-2 ring-brand-500 ring-opacity-50 bg-gray-50': dragOverColumn === col.status }"
      @dragover="onDragOver($event, col.status)"
      @dragleave="onDragLeave($event, col.status)"
      @drop="onDrop($event, col.status)"
    >
      <!-- Column Header -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="h-2 w-2 rounded-full" :class="col.dotColor"></span>
          <h3 class="text-[14px] font-semibold text-gray-900">
            {{ col.title }}
          </h3>
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white shadow-sm">
            {{ manager.tasksByStatus.value[col.status].length }}
          </span>
        </div>
        <div class="flex items-center gap-1.5 text-gray-400">
          <button class="rounded p-1 hover:bg-gray-200 hover:text-gray-600 transition-colors">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
          <button class="rounded p-1 hover:bg-gray-200 hover:text-gray-600 transition-colors">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01"/></svg>
          </button>
        </div>
      </div>

      <!-- Cards -->
      <div class="flex flex-1 flex-col gap-3 overflow-y-auto min-h-[200px]">
        <TaskCard
          v-for="task in manager.tasksByStatus.value[col.status]"
          :key="task.id"
          :task="task"
          :manager="manager"
          draggable="true"
          @dragstart="onDragStart($event, task.id)"
          @dragend="onDragEnd"
          @click="emit('open-detail', task)"
        />

        <!-- Empty State (Subtle) -->
        <div
          v-if="manager.tasksByStatus.value[col.status].length === 0"
          class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-6 text-center bg-gray-50/50"
        >
          <p class="text-[11px] text-gray-400 font-medium">Drop tasks here</p>
        </div>
      </div>
    </div>
  </div>
</template>
