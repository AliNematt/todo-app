import { Task } from "../models/Task.js";
import { TaskList } from "../managers/TaskList.js";
import { TaskStorage } from "../services/TaskStorage.js";
import { UI } from "../ui/UI.js";

export function initApp() {
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
}
