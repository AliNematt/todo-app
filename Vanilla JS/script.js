class Task {
  constructor(id, text, completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }

  toggle() {
    this.completed = !this.completed;
  }

  edit(newText) {
    const trimmed = newText.trim();
    if (!trimmed) return false;
    this.text = trimmed;
    return true;
  }
}

class TaskList {
  constructor(tasks = []) {
    this.tasks = tasks;
  }

  add(task) {
    this.tasks.push(task);
  }

  deleteById(id) {
    this.tasks = this.tasks.filter((item) => item.id !== id);
  }

  findById(id) {
    return this.tasks.find((task) => task.id === id);
  }

  toggleById(id) {
    const task = this.findById(id);
    if (!task) return false;

    task.toggle();
    return true;
  }

  getActiveCount() {
    return this.tasks.filter((task) => !task.completed).length;
  }
}

class TaskStorage {
  static load() {
    const raw = JSON.parse(localStorage.getItem("tasks")) || [];
    return raw.map((item) => new Task(item.id, item.text, item.completed));
  }

  static save(tasks) {
    const plain = tasks.map((task) => ({
      id: task.id,
      text: task.text,
      completed: task.completed,
    }));
    localStorage.setItem("tasks", JSON.stringify(plain));
  }
}

class UI {
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

const initialTasks = TaskStorage.load();
const taskManager = new TaskList(initialTasks);
const taskView = new UI();

const loadTasks = () => {
  taskManager.tasks.forEach((item) => taskView.createTodoElement(item));
};

loadTasks();

const updateTasksLeft = () => {
  const taskLeftCount = taskManager.getActiveCount();
  taskView.updateTasksLeft(taskLeftCount);
  taskView.toggleNoTaskMessage(taskLeftCount);
  TaskStorage.save(taskManager.tasks);
};

updateTasksLeft();

function addNewTask() {
  const value = taskView.todoInput.value.trim();
  if (!value) return;

  const task = new Task(Date.now(), value);
  taskManager.add(task);
  taskView.createTodoElement(task);
  updateTasksLeft();
  taskView.resetFormMode();
}

const doneTask = (id) => {
  taskManager.toggleById(id);
  taskView.toggleTaskCompletedInDOM(id);
  updateTasksLeft();
};

const deleteTask = (id) => {
  taskView.removeTask(id);
  taskManager.deleteById(id);
  updateTasksLeft();
};

const startEditTask = (id, li) => {
  const taskText = li.querySelector(".todo-text").innerText;
  taskView.todoInput.value = taskText;
  taskView.setFormMode("edit", id);
};

const applyUpdateTask = (id) => {
  const task = taskManager.findById(id);
  if (!task) return;

  const ok = task.edit(taskView.todoInput.value);
  if (!ok) return;

  taskView.updateTask(task);
  updateTasksLeft();
  taskView.resetFormMode();
};

taskView.bindTaskActions((action, id, li) => {
  if (action === "delete") {
    deleteTask(id);
  } else if (action === "done") {
    doneTask(id);
  } else if (action === "edit") {
    startEditTask(id, li);
  }
});

taskView.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const mode = taskView.form.dataset.mode;

  if (mode === "edit") {
    const id = Number(taskView.form.dataset.id);
    applyUpdateTask(id);
  } else {
    addNewTask();
  }
});

const dateTime = new Date();
const formatted = dateTime.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
document.querySelector("header .date").innerText = formatted;

taskView.bindFilterClick((filterEl, filterType) => {
  taskView.setActiveFilter(filterEl);
  taskView.filterTodos(filterType);
});
