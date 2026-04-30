export class TaskList {
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
