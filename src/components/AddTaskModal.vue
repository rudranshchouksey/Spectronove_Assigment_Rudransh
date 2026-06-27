<script setup lang="ts">
import { ref } from 'vue';
import type { TaskManager, TaskStatus, TaskPriority } from '@/BLL/taskManager';

const props = defineProps<{
  manager: TaskManager;
}>();

const emit = defineEmits<{
  close: [];
}>();

const title = ref('');
const description = ref('');
const priority = ref<TaskPriority>('medium');
const status = ref<TaskStatus>('todo');
const assignee = ref('');
const dueDate = ref('');
const tagsInput = ref('');

function handleSubmit() {
  if (!title.value.trim() || !assignee.value.trim() || !dueDate.value) return;

  const tags = tagsInput.value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  props.manager.addTask({
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
    status: status.value,
    assignee: assignee.value.trim(),
    dueDate: new Date(dueDate.value).toISOString(),
    tags,
  });

  emit('close');
}

function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
    emit('close');
  }
}
</script>

<template>
  <div
    class="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    @click="handleOverlayClick"
  >
    <div class="w-full max-w-lg rounded-2xl bg-white shadow-modal animate-in">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border-light px-6 py-4">
        <h2 class="text-base font-semibold text-text-primary">Create New Task</h2>
        <button
          class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-secondary"
          @click="emit('close')"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Form -->
      <form class="space-y-4 px-6 py-5" @submit.prevent="handleSubmit">
        <!-- Title -->
        <div>
          <label class="mb-1 block text-xs font-medium text-text-secondary">Task Title *</label>
          <input
            v-model="title"
            type="text"
            placeholder="Enter task title..."
            class="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <label class="mb-1 block text-xs font-medium text-text-secondary">Description</label>
          <textarea
            v-model="description"
            placeholder="Describe the task..."
            rows="3"
            class="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          ></textarea>
        </div>

        <!-- Row: Priority + Status -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-text-secondary">Priority</label>
            <select
              v-model="priority"
              class="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-text-secondary">Status</label>
            <select
              v-model="status"
              class="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <!-- Row: Assignee + Due Date -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-text-secondary">Assignee *</label>
            <input
              v-model="assignee"
              type="text"
              placeholder="Full name..."
              class="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              required
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-text-secondary">Due Date *</label>
            <input
              v-model="dueDate"
              type="date"
              class="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              required
            />
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label class="mb-1 block text-xs font-medium text-text-secondary">Tags (comma separated)</label>
          <input
            v-model="tagsInput"
            type="text"
            placeholder="e.g. frontend, bug, auth"
            class="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            class="rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-lg bg-brand-500 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md active:scale-[0.98]"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.animate-in {
  animation: modalIn 0.2s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
