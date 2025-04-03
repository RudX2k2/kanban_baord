import React, { useState, useEffect } from 'react';
import Column from './Column';
import './Board.css';
import { db, doc, getDoc, setDoc, updateDoc } from '../firebase';

const columnOrder = ["todo", "inProgress", "done"];

const Board = () => {
  const [columns, setColumns] = useState({});
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState('');
  const [addingToColumn, setAddingToColumn] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [boardId] = useState('main-board');

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get board data
        const boardRef = doc(db, "boards", boardId);
        const boardDoc = await getDoc(boardRef);

        if (boardDoc.exists()) {
          const data = boardDoc.data();
          // Make sure we have both tasks and columns
          if (data.columns && data.tasks) {
            setColumns(data.columns);
            setTasks(data.tasks);
          } else {
            // Create default structure if missing
            await createDefaultBoard(boardRef);
          }
        } else {
          // Create default board on first use
          await createDefaultBoard(boardRef);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Helper to create default board
    const createDefaultBoard = async (boardRef) => {
      const defaultColumns = {
        todo: {
          id: 'todo',
          title: 'To Do',
          taskIds: []
        },
        inProgress: {
          id: 'inProgress',
          title: 'In Progress',
          taskIds: []
        },
        done: {
          id: 'done',
          title: 'Done',
          taskIds: []
        }
      };

      await setDoc(boardRef, {
        columns: defaultColumns,
        tasks: {}
      });

      setColumns(defaultColumns);
      setTasks({});
    };

    fetchData();
  }, [boardId]);

  // Save board data whenever there's a change
  const saveBoard = async (newColumns, newTasks) => {
    if (loading) return; // Don't save during initial load

    try {
      const boardRef = doc(db, "boards", boardId);
      await updateDoc(boardRef, {
        columns: newColumns,
        tasks: newTasks
      });
    } catch (error) {
      console.error("Error saving board:", error);
    }
  };

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

    // Update state and save to Firebase in one operation
    setColumns(newColumns);
    saveBoard(newColumns, tasks);
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

    // Create updated copies of state
    const newTasks = {
      ...tasks,
      [newTaskId]: newTask
    };

    const newColumns = { ...columns };
    newColumns[addingToColumn].taskIds = [...newColumns[addingToColumn].taskIds, newTaskId];

    // Update state and save to Firebase
    setTasks(newTasks);
    setColumns(newColumns);
    saveBoard(newColumns, newTasks);

    // Reset form
    setAddingToColumn(null);
    setNewTaskText('');
  };

  // Editing tasks
  const handleEditTaskClick = (taskId) => {
    setEditingTaskId(taskId);
    setEditTaskText(tasks[taskId].content);
  };

  const handleEditTaskChange = (e) => {
    setEditTaskText(e.target.value);
  };

  const handleEditTaskSubmit = () => {
    if (editTaskText.trim() === '') return;

    // Create updated tasks
    const newTasks = {
      ...tasks,
      [editingTaskId]: {
        ...tasks[editingTaskId],
        content: editTaskText
      }
    };

    // Update state and save to Firebase
    setTasks(newTasks);
    saveBoard(columns, newTasks);

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

    // Create updated copies
    const newColumns = { ...columns };
    newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(id => id !== taskId);

    const newTasks = { ...tasks };
    delete newTasks[taskId];

    // Update state and save to Firebase
    setColumns(newColumns);
    setTasks(newTasks);
    saveBoard(newColumns, newTasks);
  };

  // Update task priority
  const handlePriorityChange = (taskId, priority) => {
    const newTasks = {
      ...tasks,
      [taskId]: {
        ...tasks[taskId],
        priority
      }
    };

    // Update state and save to Firebase
    setTasks(newTasks);
    saveBoard(columns, newTasks);
  };

  if (loading) {
    return <div className="loading">Завантажуємо Kanban дошку...</div>;
  }

  return (
    <div className="board">
      <h1>Kanban Дошка</h1>
      <div className="board-columns">
        {columnOrder.map(columnId => {
          const column = columns[columnId];
          return column ? (
            <Column
              key={column.id}
              column={column}
              tasks={column.taskIds.map(taskId => tasks[taskId] || null).filter(Boolean)}
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
          ) : null;
        })}
      </div>

    </div>
  );
};

export default Board;