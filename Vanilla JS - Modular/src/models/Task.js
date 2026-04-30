export class Task {
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
