import { Task } from "../models/Task.js";

export class TaskStorage {
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
