// Column.js
import React from "react";
import { useSortable } from "@dnd-kit/sortable";

function Column({ column, onEditTask }) {
  return (
    <div style={{ width: "300px", border: "1px solid #ccc", padding: "1rem" }}>
      <h3>{column.title}</h3>
      {column.tasks.map((task) => {
        const { setNodeRef, isDragging } = useSortable({
          id: task.id,  // Використовуємо ID кожної таски для визначення, яка саме таска буде перетягуватись
        });

        // Повертаємо елемент безпосередньо
        return (
          <div
            key={task.id}
            ref={setNodeRef} // додаємо ref для перетягування
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #eee",
              cursor: "pointer",
              background: isDragging ? "#e0e0e0" : "#f4f4f4", // змінюємо фон, коли таска перетягується
            }}
            onClick={() => onEditTask(task)} // обробник кліку для редагування таски
          >
            <h4>{task.content}</h4>
            <p>{task.description}</p>
            <p>{task.dueDate}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Column;
