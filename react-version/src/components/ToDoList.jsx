import { TodoItem } from "./ToDoItem"

export function TodoList({ list, onDelete, onToggle, onEdit }) {

  return (
    <ul className="todo-list">
      {list.map(item => (
        <TodoItem
          key={item.id}
          id={item.id}
          text={item.text}
          isCompleted={item.completed}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}
