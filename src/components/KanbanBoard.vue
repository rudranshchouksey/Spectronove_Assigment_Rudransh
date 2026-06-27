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

const columns: { status: TaskStatus; color: string; dotColor: string }[] = [
  { status: 'todo', color: 'text-status-todo', dotColor: 'bg-status-todo' },
  { status: 'in-progress', color: 'text-status-progress', dotColor: 'bg-status-progress' },
  { status: 'done', color: 'text-status-done', dotColor: 'bg-status-done' },
];

const dragOverColumn = ref<TaskStatus | null>(null);

function onDragStart(e: DragEvent, taskId: string) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  }
  const target = e.target as HTMLElement;
  target.classList.add('dragging');
}

function onDragEnd(e: DragEvent) {
  const target = e.target as HTMLElement;
  target.classList.remove('dragging');
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
  <div class="grid grid-cols-3 gap-5">
    <div
      v-for="col in columns"
      :key="col.status"
      class="flex flex-col rounded-xl border-2 border-transparent bg-surface-muted p-3 transition-colors duration-200"
      :class="{ 'drag-over': dragOverColumn === col.status }"
      @dragover="onDragOver($event, col.status)"
      @dragleave="onDragLeave($event, col.status)"
      @drop="onDrop($event, col.status)"
    >
      <!-- Column Header -->
      <div class="mb-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full" :class="col.dotColor"></span>
          <h3 class="text-sm font-semibold" :class="col.color">
            {{ STATUS_LABELS[col.status] }}
          </h3>
          <span class="flex h-5 min-w-5 items-center justify-center rounded-md bg-white px-1.5 text-[10px] font-bold text-text-secondary shadow-sm">
            {{ manager.tasksByStatus.value[col.status].length }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <button class="rounded-md p-1 text-text-muted transition-colors hover:bg-white hover:text-text-secondary">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
          <button class="rounded-md p-1 text-text-muted transition-colors hover:bg-white hover:text-text-secondary">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01"/></svg>
          </button>
        </div>
      </div>

      <!-- Cards -->
      <div class="flex flex-1 flex-col gap-2.5 overflow-y-auto">
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

        <!-- Empty State -->
        <div
          v-if="manager.tasksByStatus.value[col.status].length === 0"
          class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-light py-8 text-center"
        >
          <svg class="mb-2 h-8 w-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          <p class="text-xs text-text-muted">No tasks yet</p>
          <p class="text-[10px] text-text-muted">Drag tasks here</p>
        </div>
      </div>
    </div>
  </div>
</template>
