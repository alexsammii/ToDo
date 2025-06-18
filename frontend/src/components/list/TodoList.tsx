import React, { useEffect, useState } from "react";
import { Todo } from "../../types/Todo";
import {
  archiveTodo,
  duplicateTodo,
  getAllTodos,
} from "../../services/TodoServices";
import EditTodo from "../../pages/EditTodo";
import styles from "./TodoList.module.scss";

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [hideArchived, setHideArchived] = useState(false);

  const fetchTodos = () => {
    getAllTodos()
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSave = () => {
    setEditingTodo(null);
    fetchTodos();
  };

  const handleCancel = () => {
    setEditingTodo(null);
  };

  const handleDuplicate = async (todo: Todo) => {
    try {
      await duplicateTodo(todo);
      fetchTodos();
    } catch (error) {
      console.error("Error duplicating todo:", error);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await archiveTodo(id);
      fetchTodos();
    } catch (error) {
      console.error("Error archiving todo:", error);
    }
  };

  return (
    <div className={styles.todoList}>
      <h2 className={styles.header}>All Tasks</h2>

      {editingTodo && (
        <EditTodo
          todo={editingTodo}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <button
        onClick={() => setHideArchived(!hideArchived)}
        className={styles.toggleArchived}
      >
        {hideArchived ? "Show Archived" : "Hide Archived"}
      </button>

      {todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <div className={styles.todoFlexWrap}>
          {todos
            .filter((todo) => !hideArchived || !todo.archived)
            .map((todo) => (
              <li key={todo.id} className={styles.todoItem}>
                <div className={styles.todoTitle}>{todo.task}</div>
                <div className={styles.todoMeta}>
                  Category: {todo.category?.name || "None"}
                </div>
                <div className={styles.todoMeta}>
                  Due: {todo.dueDate?.slice(0, 10)}
                </div>
                <div className={styles.todoStatus}>
                  Completed: {todo.completed ? "✅" : "❌"}
                </div>
                <div className={styles.todoStatus}>
                  Archived: {todo.archived ? "📦" : "🟢"}
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    className={styles.edit}
                    onClick={() => setEditingTodo(todo)}
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
              </li>
            ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
