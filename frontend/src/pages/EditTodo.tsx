import React, { useEffect, useState } from "react";
import { Todo, Category } from "../types/Todo";
import {
  createCategory,
  getAllCategories,
  updateTodo,
} from "../services/TodoServices";
import Modal from "../components/modal/Modal";
import styles from "../components/modal/Modal.module.scss";
import { toast } from "react-toastify";

interface Props {
  todo: Todo;
  onSave: () => void;
  onCancel: () => void;
}

const EditTodo: React.FC<Props> = ({ todo, onSave, onCancel }) => {
  const [task, setTask] = useState(todo.task);
  const [dueDate, setDueDate] = useState(todo.dueDate?.slice(0, 10));
  const [completed, setCompleted] = useState(todo.completed);
  const [categoryId, setCategoryId] = useState(todo.category?.id || 0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [time, setTime] = useState(todo.time || "");
  const [allDay, setAllDay] = useState(todo.allDay || false);
  const [form, setForm] = useState({
    task: todo.task || "",
    categoryId: todo.category?.id || 0,
    dueDate: todo.dueDate || "",
    time: todo.time || "",
    allDay: todo.allDay ?? false,
    completed: todo.completed ?? false,
    archived: todo.archived ?? false,
  });

  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTodo: Todo = {
      ...todo,
      task,
      dueDate,
      time: allDay ? null : time,
      allDay,
      completed,
      category: {
        id: categoryId,
        name: "",
      },
    };

    try {
      await updateTodo(todo.id, {
        ...todo,
        ...form,
      });

      toast.success("Task updated!", {
        position: "top-right",
        autoClose: 2000,
      });
      onSave();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const newCat = await createCategory(newCategoryName);
      setCategories([...categories, newCat]);
      setCategoryId(newCat.id);
      setNewCategoryName("");
      setShowNewCategoryInput(false);
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  return (
    <Modal title="Edit" onClose={onCancel}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label htmlFor="taskName">Task Name:</label>
          <input
            type="text"
            id="taskName"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task name"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category:</label>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              style={{ flex: 1, padding: "1rem", fontSize: "1.3rem" }}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
              style={{
                padding: "0.6rem 1rem",
                fontSize: "1.2rem",
                borderRadius: "6px",
                backgroundColor: "#e5e7eb",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>

          {showNewCategoryInput && (
            <div style={{ marginTop: "0.75rem", width: "100%" }}>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                style={{
                  padding: "0.75rem",
                  width: "calc(100% - 5rem)",
                  fontSize: "1.2rem",
                  marginRight: "0.5rem",
                }}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                style={{
                  padding: "0.7rem 1.2rem",
                  fontSize: "1rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={allDay}
            required={!allDay}
          />
        </div>

        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            />
            All Day
          </label>
        </div>

        <div className={styles.checkboxGroup}>
          <input
            id="completed"
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <label htmlFor="completed">Completed</label>
        </div>

        <div className={styles.formActions}>
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTodo;
