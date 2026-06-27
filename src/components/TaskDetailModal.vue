<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Task, TaskManager, TaskStatus, TaskPriority } from '@/BLL/taskManager';
import { STATUS_LABELS } from '@/BLL/taskManager';
import {
  getAvatarColor,
  getInitials,
  isOverdue,
  formatDate,
  PRIORITY_CONFIG,
  getTagClass,
} from '@/utils/helpers';

const props = defineProps<{
  task: Task;
  manager: TaskManager;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isEditing = ref(false);
const editTitle = ref(props.task.title);
const editDescription = ref(props.task.description);
const editPriority = ref<TaskPriority>(props.task.priority);
const editStatus = ref<TaskStatus>(props.task.status);
const editAssignee = ref(props.task.assignee);
const editDueDate = ref(props.task.dueDate.split('T')[0]);
const editTags = ref(props.task.tags.join(', '));

const activeTab = ref('activity');

const createdDate = computed(() => {
  const d = new Date(props.task.createdAt);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
    '  ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
});

const dueDateRange = computed(() => {
  const d = new Date(props.task.dueDate);
  const end = new Date(d);
  end.setDate(end.getDate() + 9);
  const fmt = (dt: Date) =>
    dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return `${fmt(d)} - ${fmt(end)}`;
});

const STATUS_BADGE: Record<TaskStatus, { label: string; class: string; dotClass: string }> = {
  'todo': { label: 'Not Started', class: 'status-badge--todo', dotClass: 'status-dot--todo' },
  'in-progress': { label: 'In Research', class: 'status-badge--progress', dotClass: 'status-dot--progress' },
  'done': { label: 'Complete', class: 'status-badge--done', dotClass: 'status-dot--done' },
};

const PRIORITY_BADGE: Record<TaskPriority, { label: string; class: string }> = {
  low: { label: 'Low', class: 'priority-badge--low' },
  medium: { label: 'Medium', class: 'priority-badge--medium' },
  high: { label: 'High', class: 'priority-badge--high' },
};

/* Mock activity data based on task */
const mockActivities = computed(() => {
  const assignee = props.task.assignee;
  const title = props.task.title;
  const names = ['Talan Korsgaard', 'Hanna Philips', 'Davis Donin', 'Devrizal Pratama'];
  const otherNames = names.filter(n => n !== assignee);

  return {
    today: [
      {
        id: 1,
        user: otherNames[0] || assignee,
        action: 'changed the status of',
        target: `"${title}"`,
        extra: 'from To Do to In Progress',
        time: '10:45 AM',
        type: 'status',
      },
      {
        id: 2,
        user: otherNames[1] || assignee,
        action: 'added reaction 🚀 in',
        target: title,
        time: '10:20 AM',
        type: 'reaction',
      },
      {
        id: 3,
        user: otherNames[0] || assignee,
        action: 'added a comment in',
        target: title,
        time: '10:45 AM',
        type: 'comment',
      },
      {
        id: 4,
        user: otherNames[2] || assignee,
        action: 'Uploaded file',
        target: 'User flow',
        time: '10:45 AM',
        type: 'file',
        file: {
          name: 'User Flow',
          ext: 'PDF',
          size: '2.35 mb',
        },
      },
    ],
    yesterday: [
      {
        id: 5,
        user: otherNames[0] || assignee,
        action: 'added reaction 👍 in',
        target: title,
        time: '10:45 AM',
        type: 'reaction',
      },
      {
        id: 6,
        user: otherNames[0] || assignee,
        action: 'was created',
        target: title,
        time: '10:45 AM',
        type: 'created',
      },
    ],
  };
});

/* Mock assignee list for avatar stack */
const assigneeList = computed(() => {
  const names = ['Talan Korsgaard', 'Hanna Philips', 'Davis Donin'];
  if (!names.includes(props.task.assignee)) {
    names[0] = props.task.assignee;
  }
  return names;
});

const tabs = [
  { key: 'activity', label: 'Activity' },
  { key: 'mywork', label: 'My Work' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'comments', label: 'Comments' },
];

function startEditing() {
  isEditing.value = true;
}

function saveEdits() {
  props.manager.updateTask({
    ...props.task,
    title: editTitle.value,
    description: editDescription.value,
    priority: editPriority.value,
    status: editStatus.value,
    assignee: editAssignee.value,
    dueDate: new Date(editDueDate.value).toISOString(),
    tags: editTags.value.split(',').map((t) => t.trim()).filter(Boolean),
  });
  isEditing.value = false;
  emit('close');
}

function deleteTask() {
  props.manager.deleteTask(props.task.id);
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
    class="modal-overlay"
    @click="handleOverlayClick"
  >
    <div class="modal-container">
      <!-- Top Bar -->
      <div class="modal-topbar">
        <button
          class="topbar-btn"
          @click="emit('close')"
        >
          <svg class="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="topbar-actions">
          <button class="topbar-btn">
            <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </button>
          <button class="topbar-btn">
            <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </button>
          <button class="topbar-btn">
            <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/></svg>
          </button>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="modal-body">
        <!-- Title -->
        <div v-if="!isEditing" class="modal-title-section">
          <h2 class="modal-title">{{ task.title }}</h2>
        </div>
        <div v-else class="modal-title-section">
          <input
            v-model="editTitle"
            type="text"
            class="edit-title-input"
          />
        </div>

        <!-- Meta Fields -->
        <div class="meta-fields">
          <!-- Created time -->
          <div class="meta-row">
            <div class="meta-label">
              <svg class="icon-meta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Created time
            </div>
            <span class="meta-value">{{ createdDate }}</span>
          </div>

          <!-- Status -->
          <div class="meta-row">
            <div class="meta-label">
              <svg class="icon-meta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              Status
            </div>
            <div v-if="!isEditing">
              <span class="status-badge" :class="STATUS_BADGE[task.status].class">
                <span class="status-dot" :class="STATUS_BADGE[task.status].dotClass"></span>
                {{ STATUS_BADGE[task.status].label }}
              </span>
            </div>
            <select
              v-else
              v-model="editStatus"
              class="edit-select"
            >
              <option value="todo">{{ STATUS_LABELS['todo'] }}</option>
              <option value="in-progress">{{ STATUS_LABELS['in-progress'] }}</option>
              <option value="done">{{ STATUS_LABELS['done'] }}</option>
            </select>
          </div>

          <!-- Priority -->
          <div class="meta-row">
            <div class="meta-label">
              <svg class="icon-meta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Priority
            </div>
            <div v-if="!isEditing">
              <span class="priority-badge" :class="PRIORITY_BADGE[task.priority].class">
                {{ PRIORITY_BADGE[task.priority].label }}
              </span>
            </div>
            <select
              v-else
              v-model="editPriority"
              class="edit-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <!-- Due Date -->
          <div class="meta-row">
            <div class="meta-label">
              <svg class="icon-meta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Due Date
            </div>
            <div v-if="!isEditing" class="meta-value-group">
              <span class="meta-value" :class="{ 'meta-value--overdue': isOverdue(task.dueDate, task.status) }">
                {{ dueDateRange }}
              </span>
              <span
                v-if="isOverdue(task.dueDate, task.status)"
                class="overdue-badge"
              >⚠ Overdue</span>
            </div>
            <input
              v-else
              v-model="editDueDate"
              type="date"
              class="edit-input"
            />
          </div>

          <!-- Tags -->
          <div class="meta-row">
            <div class="meta-label">
              <svg class="icon-meta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
              Tags
            </div>
            <div v-if="!isEditing" class="tags-list">
              <span
                v-for="tag in task.tags"
                :key="tag"
                class="tag-chip"
                :class="getTagClass(tag)"
              >{{ tag }}</span>
            </div>
            <input
              v-else
              v-model="editTags"
              type="text"
              class="edit-input edit-input--wide"
            />
          </div>

          <!-- Assignees -->
          <div class="meta-row">
            <div class="meta-label">
              <svg class="icon-meta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Assignees
            </div>
            <div v-if="!isEditing" class="assignee-stack">
              <div
                v-for="(name, idx) in assigneeList"
                :key="name"
                class="avatar-circle"
                :class="{ 'avatar-overlap': idx > 0 }"
                :style="{ backgroundColor: getAvatarColor(name), zIndex: assigneeList.length - idx }"
                :title="name"
              >
                {{ getInitials(name) }}
              </div>
            </div>
            <input
              v-else
              v-model="editAssignee"
              type="text"
              class="edit-input edit-input--wide"
            />
          </div>
        </div>

        <!-- Description Box -->
        <div class="description-card">
          <h3 class="description-title">Project Description</h3>
          <div v-if="!isEditing">
            <p class="description-text">{{ task.description }}</p>
          </div>
          <textarea
            v-else
            v-model="editDescription"
            rows="3"
            class="edit-textarea"
          ></textarea>
        </div>

        <!-- Action Buttons (edit mode) -->
        <div v-if="isEditing" class="action-buttons action-buttons--editing">
          <button class="btn btn--primary" @click="saveEdits">Save Changes</button>
          <button class="btn btn--secondary" @click="isEditing = false">Cancel</button>
          <button class="btn btn--danger ml-auto" @click="deleteTask">
            <svg class="icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            Delete
          </button>
        </div>

        <!-- Divider -->
        <div class="section-divider"></div>

        <!-- Tabs -->
        <div class="tabs-bar">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
          <!-- Edit/Delete button in view mode -->
          <div v-if="!isEditing" class="tab-actions">
            <button class="btn btn--sm btn--primary" @click="startEditing">
              <svg class="icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Edit
            </button>
            <button class="btn btn--sm btn--danger-outline" @click="deleteTask">
              <svg class="icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Delete
            </button>
          </div>
        </div>

        <!-- Activity Feed -->
        <div v-if="activeTab === 'activity'" class="activity-feed">
          <!-- Today -->
          <div class="activity-group">
            <h4 class="activity-group-title">Today</h4>
            <div class="activity-list">
              <div
                v-for="item in mockActivities.today"
                :key="item.id"
                class="activity-item"
              >
                <div
                  class="activity-avatar"
                  :style="{ backgroundColor: getAvatarColor(item.user) }"
                >
                  {{ getInitials(item.user) }}
                </div>
                <div class="activity-content">
                  <p class="activity-text">
                    <span class="activity-user">{{ item.user }}</span>
                    {{ item.action }}
                    <span class="activity-target">{{ item.target }}</span>
                    <span v-if="item.extra"> {{ item.extra }}</span>
                  </p>
                  <span class="activity-time">{{ item.time }}</span>
                  <!-- File attachment -->
                  <div v-if="item.file" class="file-attachment">
                    <div class="file-icon">
                      <svg class="icon-file" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="2" width="18" height="20" rx="2" fill="#EF4444" opacity="0.15"/>
                        <path d="M7 2h8l6 6v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="#EF4444" stroke-width="1.5" fill="none"/>
                        <text x="12" y="16" text-anchor="middle" fill="#EF4444" font-size="5.5" font-weight="700">PDF</text>
                      </svg>
                    </div>
                    <div class="file-info">
                      <span class="file-name">{{ item.file.name }}</span>
                      <span class="file-meta">{{ item.file.ext }}  ·  {{ item.file.size }}</span>
                    </div>
                    <button class="file-download">
                      <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Yesterday -->
          <div class="activity-group">
            <h4 class="activity-group-title">Yesterday</h4>
            <div class="activity-list">
              <div
                v-for="item in mockActivities.yesterday"
                :key="item.id"
                class="activity-item"
              >
                <div
                  class="activity-avatar"
                  :style="{ backgroundColor: getAvatarColor(item.user) }"
                >
                  {{ getInitials(item.user) }}
                </div>
                <div class="activity-content">
                  <p class="activity-text">
                    <span class="activity-user">{{ item.user }}</span>
                    {{ item.action }}
                    <span class="activity-target">{{ item.target }}</span>
                  </p>
                  <span class="activity-time">{{ item.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other tabs placeholder -->
        <div v-else class="tab-placeholder">
          <div class="placeholder-icon">
            <svg class="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <p class="placeholder-text">No items to display yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Modal Overlay ──────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
}

/* ── Modal Container ────────────────────────────────────────── */
.modal-container {
  width: 100%;
  max-width: 580px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.18),
    0 8px 20px rgba(0, 0, 0, 0.06);
  animation: modalIn 0.25s cubic-bezier(0.22, 0.68, 0, 1.1);
  overflow: hidden;
}

/* ── Top Bar ────────────────────────────────────────────────── */
.modal-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f5;
  flex-shrink: 0;
}

.topbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s ease;
}

.topbar-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* ── Icons ──────────────────────────────────────────────────── */
.icon-xs { width: 14px; height: 14px; }
.icon-sm { width: 18px; height: 18px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 40px; height: 40px; }
.icon-meta { width: 16px; height: 16px; flex-shrink: 0; }
.icon-file { width: 28px; height: 28px; }

/* ── Modal Body ─────────────────────────────────────────────── */
.modal-body {
  padding: 24px 24px 20px;
  overflow-y: auto;
  flex: 1;
}

/* ── Title ──────────────────────────────────────────────────── */
.modal-title-section {
  margin-bottom: 20px;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.edit-title-input {
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  outline: none;
  transition: border-color 0.15s;
}

.edit-title-input:focus {
  border-color: #7c6dff;
  box-shadow: 0 0 0 3px rgba(124, 109, 255, 0.1);
}

/* ── Meta Fields ────────────────────────────────────────────── */
.meta-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 28px;
}

.meta-label {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 130px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.meta-value {
  font-size: 13.5px;
  color: #374151;
  font-weight: 450;
}

.meta-value--overdue {
  color: #ef4444;
  font-weight: 600;
}

.meta-value-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Status Badge ───────────────────────────────────────────── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-badge--todo {
  background: #fffbeb;
  color: #b45309;
  border-color: #fde68a;
}
.status-dot--todo { background: #f59e0b; }

.status-badge--progress {
  background: #fef3c7;
  color: #d97706;
  border-color: #fcd34d;
}
.status-dot--progress { background: #f59e0b; }

.status-badge--done {
  background: #ecfdf5;
  color: #059669;
  border-color: #a7f3d0;
}
.status-dot--done { background: #10b981; }

/* ── Priority Badge ─────────────────────────────────────────── */
.priority-badge {
  display: inline-flex;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
}

.priority-badge--low {
  background: #eef2ff;
  color: #4f46e5;
  border-color: #c7d2fe;
}

.priority-badge--medium {
  background: #fffbeb;
  color: #d97706;
  border-color: #fde68a;
}

.priority-badge--high {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

/* ── Overdue Badge ──────────────────────────────────────────── */
.overdue-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  color: #ef4444;
  background: #fef2f2;
}

/* ── Tags ───────────────────────────────────────────────────── */
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

/* ── Assignee Avatar Stack ──────────────────────────────────── */
.assignee-stack {
  display: flex;
  align-items: center;
}

.avatar-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: relative;
}

.avatar-overlap {
  margin-left: -8px;
}

/* ── Description Card ───────────────────────────────────────── */
.description-card {
  background: #f9fafb;
  border: 1px solid #f0f0f5;
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 6px;
}

.description-title {
  font-size: 14px;
  font-weight: 650;
  color: #111827;
  margin-bottom: 8px;
}

.description-text {
  font-size: 13px;
  line-height: 1.7;
  color: #6b7280;
}

.edit-textarea {
  width: 100%;
  resize: none;
  padding: 10px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 13px;
  color: #374151;
  background: #fff;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;
}

.edit-textarea:focus {
  border-color: #7c6dff;
  box-shadow: 0 0 0 3px rgba(124, 109, 255, 0.1);
}

/* ── Edit Inputs ────────────────────────────────────────────── */
.edit-select,
.edit-input {
  padding: 5px 10px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;
}

.edit-select:focus,
.edit-input:focus {
  border-color: #7c6dff;
  box-shadow: 0 0 0 3px rgba(124, 109, 255, 0.1);
}

.edit-input--wide {
  flex: 1;
}

/* ── Section Divider ────────────────────────────────────────── */
.section-divider {
  height: 1px;
  background: #f0f0f5;
  margin: 16px 0 0;
}

/* ── Tabs Bar ───────────────────────────────────────────────── */
.tabs-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 0 8px;
  border-bottom: 1px solid #f0f0f5;
  margin-bottom: 4px;
}

.tab-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.tab-btn:hover {
  color: #6b7280;
}

.tab-btn--active {
  color: #7c6dff;
  font-weight: 600;
}

.tab-btn--active::after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 14px;
  right: 14px;
  height: 2px;
  background: #7c6dff;
  border-radius: 2px;
}

.tab-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

/* ── Activity Feed ──────────────────────────────────────────── */
.activity-feed {
  padding-top: 8px;
}

.activity-group {
  margin-bottom: 20px;
}

.activity-group-title {
  font-size: 14px;
  font-weight: 650;
  color: #111827;
  margin-bottom: 14px;
  padding-top: 8px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.activity-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.activity-user {
  font-weight: 600;
  color: #374151;
}

.activity-target {
  font-weight: 600;
  color: #374151;
}

.activity-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
  display: block;
}

/* ── File Attachment ────────────────────────────────────────── */
.file-attachment {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: 10px;
  border: 1px solid #fecaca;
  max-width: 220px;
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.file-name {
  font-size: 12.5px;
  font-weight: 600;
  color: #374151;
}

.file-meta {
  font-size: 11px;
  color: #9ca3af;
}

.file-download {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #9ca3af;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  margin-left: auto;
  flex-shrink: 0;
}

.file-download:hover {
  background: rgba(0,0,0,0.05);
  color: #6b7280;
}

/* ── Tab Placeholder ────────────────────────────────────────── */
.tab-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
}

.placeholder-icon {
  color: #d1d5db;
}

.placeholder-text {
  font-size: 13px;
  color: #9ca3af;
}

/* ── Buttons ────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn--primary {
  background: #6c5ce7;
  color: #fff;
  padding: 7px 16px;
  box-shadow: 0 1px 3px rgba(108, 92, 231, 0.25);
}

.btn--primary:hover {
  background: #5a45d6;
  box-shadow: 0 3px 8px rgba(108, 92, 231, 0.3);
}

.btn--primary:active {
  transform: scale(0.98);
}

.btn--secondary {
  background: transparent;
  color: #6b7280;
  padding: 7px 16px;
  border: 1px solid #e5e7eb;
}

.btn--secondary:hover {
  background: #f3f4f6;
}

.btn--danger {
  background: transparent;
  color: #ef4444;
  padding: 7px 14px;
  border: 1px solid #fecaca;
}

.btn--danger:hover {
  background: #fef2f2;
}

.btn--danger-outline {
  background: transparent;
  color: #ef4444;
  padding: 5px 10px;
  border: 1px solid #fecaca;
}

.btn--danger-outline:hover {
  background: #fef2f2;
}

.btn--sm {
  padding: 5px 10px;
  font-size: 11.5px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons--editing {
  margin-bottom: 8px;
}

.ml-auto {
  margin-left: auto;
}

/* ── Animation ──────────────────────────────────────────────── */
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
