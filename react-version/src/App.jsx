import { useState, useEffect } from "react";
import { Filters } from "./components/Filters";
import { TodoInput } from "./components/ToDoInput";
import { TodoHeader } from "./components/TodoHeader";
import { MsgBox } from "./components/MsgBox";
import { TodoList } from "./components/ToDoList";
import { ClearAll } from "./components/ClearAll";

function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks")
    return stored ? JSON.parse(stored) : []
  })
  const [filterType, setFilters] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const date = new Date();
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function addTask(text) {
    setTasks(prevTasks => {
      return [...prevTasks, {
        id: Date.now(),
        text,
        completed: false
      }]
    })
  }

  function removeTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function toggleTaskState(id) {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed }
          : t
      )
    )
  }

  function editTask(id, text) {
    setTasks(prev => prev.map(
      t => t.id === id 
      ? { ...t, text:  text}
      : t
    ))
  }

  const filteredTasks = tasks.filter(task => {
    if (filterType === "pending") return !task.completed
    if (filterType === "done") return task.completed
    return true
  })
  const tasksLeft = tasks.filter(t => !t.completed).length

  function clearAll() {
    setTasks(prev => prev.filter(t => !t.completed))
  }
    return (
      <div className="container">
        <TodoHeader time={formatted}/>
        <ClearAll clear={clearAll}/>
        <TodoInput onAddTask={addTask}/>
        <TodoList list={filteredTasks} onDelete={removeTask} onToggle={toggleTaskState} onEdit={editTask}/>
        <MsgBox isEmpty={tasks.length === 0} noCompleted={tasks.every(t => !t.completed)} />

        <div className="footer">
            <span id="task-left">{tasksLeft} Tasks left!</span>
            <Filters filter={filterType} setFilter={setFilters}/>
        </div>
    </div>
  );

}

export default App
