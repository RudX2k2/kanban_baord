// Column.js
import React from 'react';
import Task from './Task';
import './Column.css';

const Column = ({
  column,
  tasks,
  onDragStart,
  onDragOver,
  onDrop,
  onAddTaskClick,
  onEditTaskClick,
  onDeleteTask,
  onPriorityChange,
  isAddingTask,
  addTaskText,
  onAddTaskChange,
  onAddTaskSubmit,
  editingTaskId,
  editTaskText,
  onEditTaskChange,
  onEditTaskSubmit
}) => {
  return (
    <div
      className="column"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className="column-header">
        <h2>{column.title}</h2>
        <div className="task-count">{tasks.length}</div>
      </div>
      
      <div className="task-list">
        {tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            onDragStart={(e) => onDragStart(e, task.id, column.id)}
            onEditClick={() => onEditTaskClick(task.id)}
            onDeleteClick={() => onDeleteTask(task.id)}
            onPriorityChange={(priority) => onPriorityChange(task.id, priority)}
            isEditing={editingTaskId === task.id}
            editText={editTaskText}
            onEditChange={onEditTaskChange}
            onEditSubmit={onEditTaskSubmit}
          />
        ))}
      </div>
      
      {isAddingTask ? (
        <div className="add-task-form">
          <textarea
            value={addTaskText}
            onChange={onAddTaskChange}
            placeholder="Введіть опис завдання..."
            autoFocus
          />
          <div className="form-actions">
            <button onClick={onAddTaskSubmit}>Додати</button>
            <button onClick={() => onAddTaskClick(null)}>Відмінити</button>
          </div>
        </div>
      ) : (
        <button 
          className="add-task-button" 
          onClick={() => onAddTaskClick(column.id)}
        >
          + Додати завдання
        </button>
      )}
    </div>
  );
};

export default Column;