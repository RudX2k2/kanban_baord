import React from "react";
import { useDraggable } from "@dnd-kit/core";

export default function Task({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: "1rem",
        margin: "0.5rem 0",
        border: "1px solid gray",
        backgroundColor: "white",
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
      }}
    >
      {task.content}
    </div>
  );
}
