import { useState } from "react"

export function TodoItem({ id, text, isCompleted, onDelete, onToggle, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text)

  function handleSave() {
    onEdit(id, editText)
    setIsEditing(false)
  }

  return (
    <li className={`todo-item ${isCompleted ? "completed" : ""}`} data-id={id}>
      <div className="todo-content">
        <div className="custom-checkbox" onClick={() => onToggle(id)} aria-label="task status"></div>

        {isEditing ? (
          <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)}/>
        ) : (
          <span>{text}</span>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        )}

        <button className="delete-btn" onClick={() => onDelete(id)}>×</button>
      </div>
    </li>
  )
}
