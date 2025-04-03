// Task.js
import React from 'react';
import './Task.css';

const Task = ({
  task,
  onDragStart,
  onEditClick,
  onDeleteClick,
  onPriorityChange,
  isEditing,
  editText,
  onEditChange,
  onEditSubmit
}) => {
  return (
    <div
      className={`task task-${task.priority}`}
      draggable
      onDragStart={onDragStart}
    >
      {isEditing ? (
        <div className="task-edit-form">
          <textarea
            value={editText}
            onChange={onEditChange}
            autoFocus
          />
          <div className="form-actions">
            <button onClick={onEditSubmit}>Зберегти</button>
            <button onClick={() => onEditClick(null)}>Відмінити</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">{task.content}</div>
          <div className="task-actions">
            <div className="priority-selector">
              <span>Пріорітет:</span>
              <select 
                value={task.priority}
                onChange={(e) => onPriorityChange(e.target.value)}
              >
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
              </select>
            </div>
            <div className="task-buttons">
              <button onClick={onEditClick}>Змінити</button>
              <button onClick={onDeleteClick}>Видалити</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Task;