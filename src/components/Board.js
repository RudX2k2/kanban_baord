import React, { useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Column from "./Column";
import { v4 as uuidv4 } from "uuid";

const initialColumns = {
  todo: { id: "todo", title: "To Do", tasks: [{ id: uuidv4(), content: "Task 1", description: "", dueDate: "" }] },
  inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
  done: { id: "done", title: "Done", tasks: [] }
};

export default function Board() {
  const [columns, setColumns] = useState(initialColumns);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [taskData, setTaskData] = useState({ title: "", description: "", dueDate: "" });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    
    const sourceColumn = Object.values(columns).find(col => col.tasks.some(task => task.id === active.id));
    const destinationColumn = columns[over.id];
    
    if (!sourceColumn || !destinationColumn || sourceColumn.id === destinationColumn.id) return;
    
    const task = sourceColumn.tasks.find(task => task.id === active.id);
    
    setColumns(prev => {
      const newSourceTasks = sourceColumn.tasks.filter(task => task.id !== active.id);
      const newDestinationTasks = destinationColumn.tasks.some(t => t.id === active.id)
        ? destinationColumn.tasks
        : [...destinationColumn.tasks, task];
      
      return {
        ...prev,
        [sourceColumn.id]: { ...sourceColumn, tasks: newSourceTasks },
        [destinationColumn.id]: { ...destinationColumn, tasks: newDestinationTasks }
      };
    });
  };

  const addTask = () => {
    if (!taskData.title.trim()) return;
    const task = { id: uuidv4(), content: taskData.title, description: taskData.description, dueDate: taskData.dueDate };
    
    setColumns(prev => ({
      ...prev,
      todo: { ...prev.todo, tasks: [...prev.todo.tasks, task] }
    }));
    
    setShowForm(false);
    setTaskData({ title: "", description: "", dueDate: "" });
  };

  const updateTask = () => {
    if (!editTask) return;
    
    setColumns(prev => {
      const updatedColumns = { ...prev };
      for (let col in updatedColumns) {
        updatedColumns[col].tasks = updatedColumns[col].tasks.map(task => 
          task.id === editTask.id ? { ...task, ...taskData } : task
        );
      }
      return updatedColumns;
    });
    
    setEditTask(null);
    setTaskData({ title: "", description: "", dueDate: "" });
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div>
          <button onClick={() => setShowForm(true)}>+ Add Task</button>
          {(showForm || editTask) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
              <input
                type="text"
                placeholder="Title"
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              />
              <input
                type="date"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
              />
              {editTask ? (
                <button onClick={updateTask}>Update Task</button>
              ) : (
                <button onClick={addTask}>Add</button>
              )}
              <button onClick={() => { setShowForm(false); setEditTask(null); }}>Cancel</button>
            </div>
          )}
        </div>
        {Object.values(columns).map(column => (
          <SortableContext key={column.id} items={column.tasks} strategy={verticalListSortingStrategy}>
            <Column column={column} onEditTask={(task) => { setEditTask(task); setTaskData(task); }} />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}
