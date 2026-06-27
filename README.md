# Task Manager - Frontend Assessment

A modern, responsive Task Management application built with Vue 3, TypeScript, and Tailwind CSS.

## Setup Instructions

To run this project locally, follow these steps:

1. Clone the repository and navigate into the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the provided local URL (usually `http://localhost:5173`) in your browser.

## Architecture Overview

This application is built with **Vue 3 (Composition API)**, **TypeScript** for type safety, and **Tailwind CSS** combined with scoped Vue styles for a clean, maintainable design system.

### Component Hierarchy
The UI is modular and deeply decoupled to ensure reusability:
- `App.vue` (Root Layout)
  - `SidebarNav` (Main navigation)
  - `HeaderBar` (Top bar with search and profile)
  - **Main Content Area** (`pages/taskManager/index.vue`)
    - `Header Section` (Page title and actions)
    - `FilterBar` & `ViewToggle` (Controls)
    - `KanbanBoard` or `ListView` (Conditional rendering based on active view)
      - `TaskCard` or Table Rows
    - `TaskDetailModal` (Side drawer for viewing/editing tasks)

### State Management (`TaskManager`)
Instead of using a bulky external library like Pinia for this specific scale, the state and business logic are encapsulated within a dedicated `TaskManager` class (`src/BLL/taskManager/TaskManager.ts`). 
- **Why it's structured this way**: By wrapping Vue's `reactive()` inside a class, we successfully separate the Business Logic Layer (BLL) from the Presentation Layer. The components only consume computed properties (like `filteredTasks`, `tasksByStatus`) and call methods (like `setSort`, `moveTo`) without knowing *how* the data is processed.
- **Trade-offs**: This approach is extremely lightweight and keeps the codebase highly portable. The main trade-off is the lack of out-of-the-box Vue DevTools integration that Pinia provides for state time-travel debugging. However, for a 2-day take-home assessment, the simplicity and strict typing of the class-based approach outweighed the need for Pinia.

## Design Decisions

Here are three specific UI/UX choices made during development:

1. **Side-Drawer for Task Details (vs. Centered Modal)**
   - *What*: Instead of a disruptive popup blocking the center of the screen, task details open in a smooth sliding drawer on the right edge.
   - *Why*: It allows users to maintain context of the underlying board or list while reading task specifics. It feels significantly more premium and modern.
   - *Alternative*: If I had more time, I would add deep-linking (URL routing for specific tasks) so users can share links that automatically open the drawer.

2. **Underline Tab View Toggles (vs. Boxed Buttons)**
   - *What*: The toggle between "Board", "List", etc., uses a minimalist purple underline for the active state rather than heavy solid background buttons.
   - *Why*: This reduces visual noise and draws the eye downward toward the actual content rather than trapping attention on the navigation itself.
   - *Alternative*: Boxed toggles can sometimes be clearer for touch targets on mobile, but the spacing was increased here to compensate.

3. **Color-Coded Status and Priority Indicators**
   - *What*: Distinct color schemes were strictly adhered to (e.g., Pink for 'In Progress', High Priority in Red pills, etc.).
   - *Why*: Kanban boards can become visually overwhelming. Relying on color psychology allows users to scan the board and immediately identify bottlenecks and critical tasks without reading text.

## Known Limitations & Assumptions

- **Persistence**: The application currently uses static mock data initialized in `TaskManager`. Any edits, creations, or deletions are maintained purely in memory and will be lost on page reload.
- **Drag-and-Drop**: A full drag-and-drop library (like `vuedraggable` or `@hello-pangea/dnd`) was omitted to keep dependencies light. Moving tasks between columns is currently handled via the Task Details drawer (changing the status).
- **Assumptions**: The design specification was primarily desktop-first. While the app is responsive, I assumed the primary use case for complex task management would be on tablet/desktop viewports. 

## Time Log

Here is a rough breakdown of how the 48 hours were utilized (approx. 12-14 active working hours):

- **Setup & Planning (2 hours)**: Initializing Vite, configuring Tailwind, defining types, and planning the component tree.
- **State Management & BLL (3 hours)**: Building the `TaskManager` class, ensuring reactivity, sorting logic, and filtering mechanisms worked flawlessly before attaching them to the UI.
- **Core UI Implementation (4 hours)**: Building the Kanban Board, List View, Task Cards, and the core layout structure.
- **UI/UX Polish & Refinement (3 hours)**: Overhauling the aesthetic to match modern standards, building the Side-Drawer transition, styling tags, and ensuring pixel-perfect spacing.
- **Testing & Documentation (1.5 hours)**: Manual edge-case testing, writing this README, and final code cleanup.
