// Board.js
import React, { useState } from 'react';
import Column from './Column';
import './Board.css';

const Board = () => {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'Виконати',
      taskIds: ['task-1', 'task-2']
    },
    inProgress: {
      id: 'inProgress',
      title: 'Виконується',
      taskIds: ['task-3']
    },
    inReview: {
      id: 'review',
      title: 'Перевіряється',
      taskIds: ['task-5']
    },
    done: {
      id: 'done',
      title: 'Виконано',
      taskIds: ['task-4']
    }
  });

  const [tasks, setTasks] = useState({
    'task-1': { id: 'task-1', content: 'Перевірити backlog', priority: 'high' },
    'task-2': { id: 'task-2', content: 'Дослідження нової технології', priority: 'medium' },
    'task-3': { id: 'task-3', content: 'Unit тести', priority: 'medium' },
    'task-4': { id: 'task-4', content: 'Впровадження нової feature', priority: 'low' }, 
    'task-5': { id: 'task-5', content: 'Впровадження нової feature 2', priority: 'high' }

  });

  const [newTaskText, setNewTaskText] = useState('');
  const [addingToColumn, setAddingToColumn] = useState(null);

  // Handle dragging tasks between columns
  const handleDragStart = (e, taskId, sourceColumnId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', sourceColumnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnId) => {
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');

    // Don't do anything if dropped in same column
    if (sourceColumnId === targetColumnId) return;

    // Create updated columns
    const newColumns = { ...columns };
    
    // Remove from source column
    newColumns[sourceColumnId].taskIds = newColumns[sourceColumnId].taskIds.filter(id => id !== taskId);
    
    // Add to target column
    newColumns[targetColumnId].taskIds = [...newColumns[targetColumnId].taskIds, taskId];
    
    setColumns(newColumns);
  };

  // Adding new tasks
  const handleAddTaskClick = (columnId) => {
    setAddingToColumn(columnId);
    setNewTaskText('');
  };

  const handleNewTaskChange = (e) => {
    setNewTaskText(e.target.value);
  };

  const handleNewTaskSubmit = () => {
    if (newTaskText.trim() === '') return;

    // Create new task
    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      content: newTaskText,
      priority: 'medium'
    };

    // Add to tasks
    setTasks({
      ...tasks,
      [newTaskId]: newTask
    });

    // Add to column
    const newColumns = { ...columns };
    newColumns[addingToColumn].taskIds = [...newColumns[addingToColumn].taskIds, newTaskId];
    setColumns(newColumns);

    // Reset form
    setAddingToColumn(null);
    setNewTaskText('');
  };

  // Editing tasks
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  const handleEditTaskClick = (taskId) => {
    setEditingTaskId(taskId);
    setEditTaskText(tasks[taskId].content);
  };

  const handleEditTaskChange = (e) => {
    setEditTaskText(e.target.value);
  };

  const handleEditTaskSubmit = () => {
    if (editTaskText.trim() === '') return;

    // Update task
    setTasks({
      ...tasks,
      [editingTaskId]: {
        ...tasks[editingTaskId],
        content: editTaskText
      }
    });

    // Reset form
    setEditingTaskId(null);
    setEditTaskText('');
  };

  // Delete tasks
  const handleDeleteTask = (taskId) => {
    // Find which column contains this task
    let columnId = null;
    Object.keys(columns).forEach(colId => {
      if (columns[colId].taskIds.includes(taskId)) {
        columnId = colId;
      }
    });

    if (!columnId) return;

    // Remove task from column
    const newColumns = { ...columns };
    newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(id => id !== taskId);
    
    // Remove task from tasks
    const newTasks = { ...tasks };
    delete newTasks[taskId];
    
    setColumns(newColumns);
    setTasks(newTasks);
  };

  // Update task priority
  const handlePriorityChange = (taskId, priority) => {
    setTasks({
      ...tasks,
      [taskId]: {
        ...tasks[taskId],
        priority
      }
    });
  };

  return (
    <div className="board">
      <h1>Kanban дошка</h1>
      <div className="board-columns">
        {Object.values(columns).map(column => (
          <Column
            key={column.id}
            column={column}
            tasks={column.taskIds.map(taskId => tasks[taskId])}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onAddTaskClick={handleAddTaskClick}
            onEditTaskClick={handleEditTaskClick}
            onDeleteTask={handleDeleteTask}
            onPriorityChange={handlePriorityChange}
            isAddingTask={addingToColumn === column.id}
            addTaskText={newTaskText}
            onAddTaskChange={handleNewTaskChange}
            onAddTaskSubmit={handleNewTaskSubmit}
            editingTaskId={editingTaskId}
            editTaskText={editTaskText}
            onEditTaskChange={handleEditTaskChange}
            onEditTaskSubmit={handleEditTaskSubmit}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;