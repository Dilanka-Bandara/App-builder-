// app.js - Simple To-Do application
// This script is written as an IIFE so it can be included directly in an HTML page.
// It defines a Task class, a TaskManager singleton, and UI rendering / interaction logic.

(() => {
  // ----- Task Model -------------------------------------------------------
  class Task {
    /**
     * @param {number|string} id - Unique identifier for the task.
     * @param {string} text - Description of the task.
     * @param {boolean} [completed=false] - Completion state.
     */
    constructor(id, text, completed = false) {
      this.id = id;
      this.text = text;
      this.completed = completed;
    }

    toggle() {
      this.completed = !this.completed;
    }

    setText(newText) {
      this.text = newText;
    }
  }

  // ----- Task Manager ------------------------------------------------------
  const STORAGE_KEY = "simpleTodoTasks";

  const TaskManager = {
    tasks: [], // array of Task instances

    // Load tasks from localStorage (if any) and hydrate them as Task objects.
    loadFromStorage() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          // Ensure we create proper Task instances (so methods are available).
          this.tasks = parsed.map(t => new Task(t.id, t.text, t.completed));
        } catch (e) {
          console.error("Failed to parse tasks from storage", e);
          this.tasks = [];
        }
      } else {
        this.tasks = [];
      }
    },

    // Persist current tasks array to localStorage.
    saveToStorage() {
      const data = JSON.stringify(this.tasks);
      localStorage.setItem(STORAGE_KEY, data);
    },

    // Add a new task with the given text.
    addTask(text) {
      const id = Date.now() + Math.random(); // simple unique id
      const task = new Task(id, text.trim());
      this.tasks.push(task);
      this.saveToStorage();
      return task;
    },

    // Edit the text of a task identified by id.
    editTask(id, newText) {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        task.setText(newText.trim());
        this.saveToStorage();
      }
    },

    // Delete a task by id.
    deleteTask(id) {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tasks.splice(index, 1);
        this.saveToStorage();
      }
    },

    // Toggle completion state of a task.
    toggleTask(id) {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        task.toggle();
        this.saveToStorage();
      }
    },

    // Return tasks filtered by the supplied filter string.
    // filter: 'all' | 'active' | 'completed'
    getFilteredTasks(filter = "all") {
      switch (filter) {
        case "active":
          return this.tasks.filter(t => !t.completed);
        case "completed":
          return this.tasks.filter(t => t.completed);
        case "all":
        default:
          return this.tasks.slice(); // shallow copy
      }
    },

    // Helper to delete all completed tasks – used by the "clear completed" UI.
    clearCompleted() {
      this.tasks = this.tasks.filter(t => !t.completed);
      this.saveToStorage();
    }
  };

  // ----- UI Rendering ------------------------------------------------------
  let currentFilter = "all"; // default filter

  /**
   * Render the task list according to the current filter.
   * @param {string} [filter] - Optional filter overriding the global currentFilter.
   */
  function renderTasks(filter = currentFilter) {
    const listEl = document.getElementById("task-list");
    if (!listEl) return;
    // Clear existing content
    listEl.innerHTML = "";

    const tasksToRender = TaskManager.getFilteredTasks(filter);

    tasksToRender.forEach(task => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.id = task.id;

      // Checkbox for completion toggle
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "toggle";
      checkbox.checked = task.completed;
      checkbox.dataset.id = task.id;
      checkbox.addEventListener("change", () => {
        TaskManager.toggleTask(task.id);
        renderTasks();
      });

      // Span for task text
      const span = document.createElement("span");
      span.className = "task-text";
      if (task.completed) span.classList.add("completed");
      span.textContent = task.text;
      span.dataset.id = task.id;

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.dataset.id = task.id;
      editBtn.addEventListener("click", () => startEditingTask(task.id, span, li));

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.dataset.id = task.id;
      deleteBtn.addEventListener("click", () => {
        TaskManager.deleteTask(task.id);
        renderTasks();
      });

      // Assemble li
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      listEl.appendChild(li);
    });
  }

  // ----- Editing Helper ----------------------------------------------------
  function startEditingTask(id, spanEl, liEl) {
    // Replace span with input element
    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = spanEl.textContent;
    input.dataset.id = id;
    // When editing finishes (blur or Enter), save changes.
    const finishEdit = () => {
      const newText = input.value.trim();
      if (newText.length > 0) {
        TaskManager.editTask(id, newText);
      }
      renderTasks();
    };
    input.addEventListener("blur", finishEdit);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        input.blur(); // triggers finishEdit via blur
      }
    });
    // Replace in DOM
    liEl.replaceChild(input, spanEl);
    input.focus();
    // Optionally select all text for convenience
    input.select();
  }

  // ----- Global Event Listeners -------------------------------------------
  function init() {
    const addBtn = document.getElementById("add-task-btn");
    const input = document.getElementById("new-task-input");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const clearCompletedBtn = document.getElementById("clear-completed-btn");

    const addTaskHandler = () => {
      const text = input.value.trim();
      if (text) {
        TaskManager.addTask(text);
        input.value = "";
        renderTasks();
      }
    };

    if (addBtn) {
      addBtn.addEventListener("click", addTaskHandler);
    }
    if (input) {
      input.addEventListener("keypress", e => {
        if (e.key === "Enter") {
          addTaskHandler();
        }
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        if (filter) {
          currentFilter = filter;
          // Update active class and aria-pressed
          filterButtons.forEach(b => {
            b.classList.toggle("active", b === btn);
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });
          renderTasks();
        }
      });
    });

    if (clearCompletedBtn) {
      clearCompletedBtn.addEventListener("click", () => {
        TaskManager.clearCompleted();
        renderTasks();
      });
    }
  }

  // ----- Initialization ----------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    TaskManager.loadFromStorage();
    renderTasks();
    init();
  });

  // Export for potential testing (attached to window)
  window.TaskManager = TaskManager;
  window.renderTasks = renderTasks;
})();
