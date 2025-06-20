import React, { useEffect, useState } from "react";
import { Todo } from "../../types/Todo";
import {
  archiveTodo,
  duplicateTodo,
  getAllTodos,
} from "../../services/TodoServices";
import styles from "./TodoList.module.scss";
import EditTodo from "../../pages/EditTodo";

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hideArchived, setHideArchived] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const fetchTodos = () => {
    getAllTodos()
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

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

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleSave = () => {
    setEditingTodo(null);
    fetchTodos();
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
            .filter((todo) => !hideArchived || !todo.archived)
            .map((todo) => (
              <div key={todo.id} className={styles.todoItem}>
                <div className={styles.todoTitle}>{todo.task}</div>
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
                  <button className={styles.edit} onClick={() => handleEdit(todo)}>
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

export default TodoList;
