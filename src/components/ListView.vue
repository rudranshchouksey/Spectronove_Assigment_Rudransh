<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TaskManager, Task, TaskStatus, TaskSortField } from '@/BLL/taskManager';
import { STATUS_LABELS } from '@/BLL/taskManager';
import {
  getAvatarColor,
  getInitials,
  isOverdue,
  PRIORITY_CONFIG,
} from '@/utils/helpers';

const props = defineProps<{
  manager: TaskManager;
}>();

const emit = defineEmits<{
  'open-detail': [task: Task];
}>();

const collapsedSections = ref<Set<TaskStatus>>(new Set());

const statusOrder: { status: TaskStatus; label: string; dotColor: string; badgeBg: string; badgeText: string; badgeBorder: string }[] = [
  {
    status: 'todo',
    label: 'Not Started',
    dotColor: '#ef4444',
    badgeBg: '#fef2f2',
    badgeText: '#ef4444',
    badgeBorder: '#fecaca',
  },
  {
    status: 'in-progress',
    label: 'In Progress',
    dotColor: '#eab308',
    badgeBg: '#fef9c3',
    badgeText: '#ca8a04',
    badgeBorder: '#fef08a',
  },
  {
    status: 'done',
    label: 'Done',
    dotColor: '#10b981',
    badgeBg: '#ecfdf5',
    badgeText: '#059669',
    badgeBorder: '#a7f3d0',
  },
];

/* Mock assignee names for avatar stacks */
const allPeople = ['Talan Korsgaard', 'Hanna Philips', 'Davis Donin', 'Devrizal Pratama'];

function getAssigneeStack(task: Task): string[] {
  const others = allPeople.filter(n => n !== task.assignee);
  return [task.assignee, ...others.slice(0, 3)];
}

function formatTimelineDate(iso: string): string {
  const d = new Date(iso);
  const end = new Date(d);
  end.setDate(end.getDate() + 28);
  const fmt = (dt: Date) =>
    dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${fmt(d)} - ${fmt(end)}`;
}

function capitalizeTag(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

function toggleSection(status: TaskStatus) {
  if (collapsedSections.value.has(status)) {
    collapsedSections.value.delete(status);
  } else {
    collapsedSections.value.add(status);
  }
}

function isSectionCollapsed(status: TaskStatus): boolean {
  return collapsedSections.value.has(status);
}

function sortBy(field: TaskSortField) {
  props.manager.setSort(field);
}
</script>

<template>
  <div class="list-view">
    <div v-for="section in statusOrder" :key="section.status" class="list-section">
      <div class="section-container">
        <!-- Section Header -->
        <div class="section-header" :class="{ 'section-header--collapsed': isSectionCollapsed(section.status) }">
          <div class="section-header-left">
            <span
              class="status-pill"
              :style="{
                backgroundColor: section.badgeBg,
                color: section.badgeText,
                borderColor: section.badgeBorder,
              }"
            >
              <svg
                class="status-pill-icon"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="2 4"
              >
                <circle cx="12" cy="12" r="9" />
              </svg>
              {{ section.label }}
            </span>
            <span class="task-count">
              {{ manager.tasksByStatus.value[section.status].length }}
            </span>
          </div>
          <button
            class="collapse-btn"
            @click="toggleSection(section.status)"
          >
            <svg
              class="collapse-icon"
              :class="{ 'collapse-icon--collapsed': isSectionCollapsed(section.status) }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
        </div>

        <!-- Table -->
        <Transition name="slide">
          <div v-if="!isSectionCollapsed(section.status)" class="table-wrapper">
            <!-- Table Header -->
            <div class="table-header">
              <button class="th-cell th-name" @click="sortBy('title')">
                <svg class="th-icon" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="6" height="16" rx="2" /><rect x="14" y="10" width="6" height="10" rx="2" /></svg>
                Task Name
              </button>
              <div class="th-cell th-desc">
                <svg class="th-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Descriptions
              </div>
              <div class="th-cell th-people">
                <svg class="th-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                People
              </div>
              <div class="th-cell th-type">
                <svg class="th-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M7 12h10M9 18h6" /></svg>
                Type
              </div>
              <button class="th-cell th-timeline" @click="sortBy('dueDate')">
                <svg class="th-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Timeline Date
              </button>
              <button class="th-cell th-priority" @click="sortBy('priority')">
                <svg class="th-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"/></svg>
                Priority
              </button>
              <div class="th-cell th-actions"></div>
            </div>

            <!-- Table Rows -->
            <div
              v-for="task in manager.tasksByStatus.value[section.status]"
              :key="task.id"
              class="table-row"
              @click="emit('open-detail', task)"
            >
              <!-- Task Name Column (includes drag + checkbox) -->
              <div class="td-name">
                <svg class="drag-dots" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
                <input
                  type="checkbox"
                  :checked="manager.isSelected(task.id)"
                  class="row-checkbox"
                  @click.stop="manager.toggleSelection(task.id)"
                />
                <span class="task-title">{{ task.title }}</span>
              </div>

              <!-- Description -->
              <div class="td-desc">
                <span class="task-description">{{ task.description }}</span>
              </div>

              <!-- People (Avatar Stack) -->
              <div class="td-people">
                <div class="avatar-stack">
                  <div
                    v-for="(person, idx) in getAssigneeStack(task)"
                    :key="person"
                    class="avatar-sm"
                    :class="{ 'avatar-sm--overlap': idx > 0 }"
                    :style="{ backgroundColor: getAvatarColor(person), zIndex: 10 - idx }"
                    :title="person"
                  >
                    {{ getInitials(person) }}
                  </div>
                </div>
              </div>

              <!-- Type / Tags -->
              <div class="td-type">
                <span
                  v-if="task.tags.length > 0"
                  class="type-badge"
                >
                  <!-- Feature icon -->
                  <svg v-if="task.tags[0].toLowerCase() === 'feature'" class="type-icon h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z" /></svg>
                  <!-- Bug icon -->
                  <svg v-else-if="task.tags[0].toLowerCase() === 'bug'" class="type-icon h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <!-- Review icon -->
                  <svg v-else-if="task.tags[0].toLowerCase() === 'review'" class="type-icon h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <!-- Testing icon -->
                  <svg v-else-if="task.tags[0].toLowerCase() === 'testing'" class="type-icon h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <!-- Default -->
                  <svg v-else class="type-icon h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                  {{ capitalizeTag(task.tags[0]) }}
                </span>
              </div>

              <!-- Timeline Date -->
              <div class="td-timeline">
                <span class="timeline-text" :class="{ 'timeline-text--overdue': isOverdue(task.dueDate, task.status) }">
                  {{ formatTimelineDate(task.dueDate) }}
                </span>
              </div>

              <!-- Priority -->
              <div class="td-priority">
                <span class="priority-badge" :class="'priority-badge--' + task.priority">
                  <svg class="priority-flag" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"/></svg>
                  {{ PRIORITY_CONFIG[task.priority].label }}
                </span>
              </div>

              <!-- Three-dot Menu -->
              <div class="td-actions">
                <button class="action-menu-btn" @click.stop>
                  <svg class="action-dots" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01"/></svg>
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="manager.tasksByStatus.value[section.status].length === 0"
              class="empty-state"
            >
              No tasks in this section
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── List View Container ────────────────────────────────────── */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 40px;
}

/* ── Section Container ──────────────────────────────────────── */
.section-container {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

/* ── Section Header ─────────────────────────────────────────── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.section-header--collapsed {
  border-bottom: none;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid;
}

.status-pill-icon {
  margin-right: -2px;
}

.task-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s;
}

.collapse-btn:hover {
  background: #f9fafb;
  color: #6b7280;
}

.collapse-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.collapse-icon--collapsed {
  transform: rotate(-90deg);
}

/* ── Table Wrapper ──────────────────────────────────────────── */
.table-wrapper {
  background: #ffffff;
  overflow: hidden;
}

/* ── Table Grids ────────────────────────────────────────────── */
.table-header {
  display: grid;
  grid-template-columns: 2fr 2.5fr 130px 120px 240px 130px 60px;
  align-items: center;
  height: 52px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 2.5fr 130px 120px 240px 130px 60px;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  transition: background-color 0.15s;
  cursor: pointer;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #fafafa;
}

/* ── Cells ──────────────────────────────────────────────────── */
.th-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  border-right: 1px solid #e5e7eb;
  height: 100%;
  padding: 0 20px;
  border-top: none;
  border-bottom: none;
  background: none;
  font-family: inherit;
  white-space: nowrap;
}

button.th-cell {
  cursor: pointer;
  transition: color 0.15s;
}

button.th-cell:hover {
  color: #374151;
}

.th-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #9ca3af;
}

.td-name, .td-desc, .td-people, .td-type, .td-timeline, .td-priority, .td-actions {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  border-right: 1px solid #e5e7eb;
}

.th-cell:last-child,
.td-actions {
  border-right: none;
}

/* ── Task Name Column (includes drag & checkbox) ────────────── */
.td-name {
  gap: 12px;
  min-width: 0;
}

.drag-dots {
  width: 14px;
  height: 14px;
  color: #d1d5db;
  cursor: grab;
  flex-shrink: 0;
}

.row-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  appearance: none;
  background-color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.row-checkbox:checked {
  background-color: #6c5ce7;
  border-color: #6c5ce7;
}

.row-checkbox:checked::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.task-title {
  font-size: 13.5px;
  font-weight: 500;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* ── Description ────────────────────────────────────────────── */
.td-desc {
  min-width: 0;
}

.task-description {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* ── People (Avatar Stack) ──────────────────────────────────── */
.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10.5px;
  font-weight: 600;
  color: #ffffff;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
}

.avatar-sm--overlap {
  margin-left: -10px;
}

/* ── Type / Tag Badge ───────────────────────────────────────── */
.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #4b5563;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  white-space: nowrap;
}

.type-icon {
  color: #6b7280;
}

/* ── Timeline Date ──────────────────────────────────────────── */
.timeline-text {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timeline-text--overdue {
  color: #ef4444;
  font-weight: 500;
}

/* ── Priority Badge ─────────────────────────────────────────── */
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
}

.priority-flag {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.priority-badge--high {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
}

.priority-badge--medium {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.priority-badge--low {
  background: #ecfdf5;
  color: #10b981;
  border: 1px solid #a7f3d0;
}

/* ── Actions (Three-dot) ────────────────────────────────────── */
.td-actions {
  justify-content: center;
}

.action-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
  background: #ffffff;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s;
}

.action-menu-btn:hover {
  background: #f9fafb;
  color: #4b5563;
}

.action-dots {
  width: 18px;
  height: 18px;
}

/* ── Empty State ────────────────────────────────────────────── */
.empty-state {
  padding: 40px;
  text-align: center;
  font-size: 13.5px;
  color: #9ca3af;
}
</style>
