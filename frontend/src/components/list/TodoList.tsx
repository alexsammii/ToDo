import React, { useEffect, useState } from "react";
import { Todo } from "../../types/Todo";
import {
  archiveTodo,
  duplicateTodo,
  getAllTodos,
  toggleCompleteTodo,
} from "../../services/TodoServices";
import styles from "./TodoList.module.scss";
import EditTodo from "../../pages/EditTodo";
import { toast } from "react-toastify";

type Props = {
  todos: Todo[];
  refreshTodos: () => void;
};

export default function TodoList({ todos, refreshTodos }: Props) {
  const [hideArchived, setHideArchived] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleDuplicate = async (todo: Todo) => {
    try {
      await duplicateTodo(todo);
      refreshTodos();
      toast.success("Task duplicated!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error duplicating todo:", error);
    }
  };
  const handleToggleComplete = async (todo: Todo) => {
    try {
      await toggleCompleteTodo(todo.id, !todo.completed);
      refreshTodos();
      toast.success("Task status updated!");
    } catch (error) {
      console.error("Error toggling complete:", error);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      console.log("Archiving todo with ID:", id);
      await archiveTodo(id);
      console.log("Archive API call finished for ID:", id);
      refreshTodos();
      toast.info("Task archived.");
    } catch (error) {
      console.error("❌ Error archiving todo:", error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleSave = () => {
    setEditingTodo(null);
    refreshTodos();
  };

  const handleCancel = () => {
    setEditingTodo(null);
  };

  return (
    <div className={styles.todoList}>
      <h2 className={styles.header}>All Tasks</h2>

      <button
        onClick={() => setHideArchived(!hideArchived)}
        className={styles.toggleArchived}
      >
        {hideArchived ? "Show Archived" : "Hide Archived"}
      </button>

      {todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <div className={styles.cardGrid}>
          {todos
            .slice()
            .reverse()
            .filter((todo) => !hideArchived || !todo.archived)
            .map((todo) => (
              <div key={todo.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  className={styles.topLeftCheckbox}
                />

                <div className={styles.todoTitle}>
                  <span>{todo.task}</span>
                </div>

                <div className={styles.todoMeta}>
                  Category: {todo.category?.name || "None"}
                </div>
                <div className={styles.todoMeta}>
                  Due: {todo.dueDate?.slice(0, 10)}
                </div>
                {todo.allDay ? (
                  <div className={styles.todoMeta}>Time: All Day</div>
                ) : (
                  todo.time && (
                    <div className={styles.todoMeta}>Time: {todo.time}</div>
                  )
                )}
                <div className={styles.todoStatus}>
                  Completed: {todo.completed ? "✅" : "❌"}
                </div>
                <div className={styles.todoStatus}>
                  Archived: {todo.archived ? "📦" : "🟢"}
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    className={styles.edit}
                    onClick={() => handleEdit(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.duplicate}
                    onClick={() => handleDuplicate(todo)}
                  >
                    Duplicate
                  </button>
                  <button
                    className={styles.archive}
                    onClick={() => handleArchive(todo.id)}
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {editingTodo && (
        <EditTodo
          todo={editingTodo}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
