export class UI {
  constructor() {
    this.todoList = document.querySelector("ul.todo-list");
    this.emptyMsg = document.getElementById("empty-message");
    this.noTaskMsg = document.getElementById("notask-message");
    this.todoInput = document.getElementById("task");
    this.form = document.getElementById("form");
    this.filterList = document.querySelector(".filters");
    this.taskLeftDOM = document.getElementById("task-left");
  }

  createTodoElement(task) {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    li.dataset.id = task.id;
    if (task.completed) li.classList.add("completed");

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("todo-content");

    const checkboxDiv = document.createElement("div");
    checkboxDiv.classList.add("custom-checkbox");
    checkboxDiv.dataset.action = "done";
    checkboxDiv.setAttribute("aria-label", "task status");

    const textSpan = document.createElement("span");
    textSpan.classList.add("todo-text");

    const safeText = document.createTextNode(task.text);
    textSpan.appendChild(safeText);

    contentDiv.appendChild(checkboxDiv);
    contentDiv.appendChild(textSpan);

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("todo-actions");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.dataset.action = "edit";
    editBtn.setAttribute("aria-label", "Edit task");
    editBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18-11.5a1 1 0 0 0 0-1.41l-1.34-1.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75L21 5.75z"/>
      </svg>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.dataset.action = "delete";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.textContent = "×";

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);
    this.todoList.appendChild(li);
  }

  removeTask(id) {
    const li = this.todoList.querySelector(`li[data-id="${id}"]`);
    if (!li) return;
    li.remove();
  }

  updateTask(task) {
    const li = this.todoList.querySelector(`li[data-id="${task.id}"]`);
    if (!li) return;
    li.querySelector(".todo-text").innerText = task.text;
    this.todoInput.value = "";
  }

  toggleTaskCompletedInDOM(id) {
    const li = this.todoList.querySelector(`li[data-id="${id}"]`);
    if (!li) return;
    li.classList.toggle("completed");
  }

  updateTasksLeft(count) {
    this.taskLeftDOM.innerText = `${count} tasks left!`;
  }

  toggleNoTaskMessage(taskLeftCount) {
    if (!taskLeftCount) {
      this.noTaskMsg.classList.remove("msghidden");
    } else {
      this.noTaskMsg.classList.add("msghidden");
    }
  }

  toggleEmptyMessage(show) {
    if (!show) {
      this.emptyMsg.classList.remove("msghidden");
    } else {
      this.emptyMsg.classList.add("msghidden");
    }
  }

  setFormMode(mode, taskId) {
    this.form.dataset.mode = mode;
    if (mode === "edit" && taskId !== undefined) {
      this.form.dataset.id = taskId;
    } else {
      delete this.form.dataset.id;
    }
  }

  resetFormMode() {
    delete this.form.dataset.mode;
    delete this.form.dataset.id;
    this.todoInput.value = "";
  }

  setActiveFilter(filterElement) {
    this.filterList.querySelector(".active")?.classList.remove("active");
    filterElement.classList.add("active");
  }

  filterTodos(filterType) {
    const todos = this.todoList.querySelectorAll(".todo-item");

    todos.forEach((todo) => {
      const isCompleted = todo.classList.contains("completed");

      const shouldShow =
        filterType === "all" ||
        (filterType === "pending" && !isCompleted) ||
        (filterType === "done" && isCompleted);

      if (shouldShow) {
        todo.classList.remove("hidden");
      } else {
        todo.classList.add("hidden");
      }
    });

    const anyVisible = [...todos].some(
      (todo) => !todo.classList.contains("hidden"),
    );

    this.toggleEmptyMessage(anyVisible);
  }

  bindTaskActions(handler) {
    this.todoList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      const li = btn.closest(".todo-item");
      const id = Number(li.dataset.id);
      handler(action, id, li);
    });
  }

  bindFilterClick(handler) {
    this.filterList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;

      const filter = btn.dataset.filter;

      handler(btn, filter);
    });
  }
}
