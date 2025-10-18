# SimpleToDo

**SimpleToDo** is a lightweight, browser‑only to‑do list application. It lets you add, edit, delete, and filter tasks, with all data persisted in the browser’s `localStorage`. No build tools, servers, or external dependencies are required – just open `index.html` in a modern web browser.

---

## Tech Stack
- **JavaScript** – Core application logic (ES6, IIFE pattern)
- **HTML** – Markup for the UI
- **CSS** – Styling and responsive layout

---

## Features
- **Add tasks** – Type a description and press **Enter** or click **Add**.
- **Edit tasks** – Click **Edit** on a task, modify the text, and press **Enter** or click outside to save.
- **Delete tasks** – Remove a task with the **Delete** button.
- **Toggle completion** – Check/uncheck a task to mark it as completed.
- **Filter view** – Switch between **All**, **Active**, and **Completed** tasks.
- **Clear completed** – Remove all completed tasks at once.
- **Persistence** – All tasks are saved to `localStorage` and restored on page load.
- **Responsive design** – Works on desktop, tablet, and mobile screen sizes.

---

## Installation & Usage
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/simpletodo.git
   cd simpletodo
   ```
2. **Open the app**
   - Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
   - No additional build steps, package managers, or server configuration are required.

---

## File Structure
```
/simpletodo
├─ index.html          # Main HTML page – loads app.js and styles.css
├─ styles.css          # CSS styling and responsive layout
├─ app.js              # Core JavaScript: Task model, TaskManager, UI logic
└─ README.md           # Project documentation (this file)
```
- **index.html** – Contains the markup for the task input, filter buttons, and the task list container (`<ul id="task-list">`). It also includes references to `styles.css` and `app.js`.
- **styles.css** – Provides visual styling, including the look of completed tasks, button states, and media queries for responsive behavior.
- **app.js** – Implements the entire application:
  - `Task` class – Represents a single to‑do item with `id`, `text`, and `completed` state.
  - `TaskManager` singleton – Handles CRUD operations, filtering, and `localStorage` persistence.
  - UI rendering functions – Dynamically generate the task list, attach event listeners, and manage edit mode.
  - Initialization – Loads stored tasks, renders the UI, and wires up global event listeners on `DOMContentLoaded`.

---

## Architecture Overview
1. **Task Model** – The `Task` class encapsulates the data and behavior of a single task (toggle, edit).
2. **TaskManager** – A plain object that stores an array of `Task` instances. It provides methods to add, edit, delete, toggle, filter, and persist tasks.
3. **UI Rendering** – `renderTasks()` builds the DOM list based on the current filter (`all`, `active`, `completed`). Individual task elements include a checkbox, text span, **Edit**, and **Delete** buttons.
4. **Persistence** – `TaskManager.loadFromStorage()` and `TaskManager.saveToStorage()` handle JSON serialization to `localStorage` under the key `simpleTodoTasks`.
5. **Event Flow** – Global listeners handle adding tasks, filter changes, clearing completed tasks, and delegating per‑task actions (toggle, edit, delete).

---

## Screenshots
> *Replace the placeholders with actual screenshots of the application.*

- **Home view (All tasks)**
  ![All tasks screenshot](./screenshots/all-tasks.png)

- **Active filter**
  ![Active tasks screenshot](./screenshots/active-tasks.png)

- **Completed filter**
  ![Completed tasks screenshot](./screenshots/completed-tasks.png)

- **Responsive layout (mobile)**
  ![Mobile view screenshot](./screenshots/mobile.png)

---

## Responsive Behavior
- The layout uses flexible widths and media queries to adapt to various screen sizes.
- On narrow screens (≤ 600 px) the input field and buttons stack vertically for easier touch interaction.
- Font sizes and button touch targets are scaled for mobile usability.

---

## License
This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.
