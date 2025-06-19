import React, { useEffect, useState } from "react";
import { Todo, Category } from "../types/Todo";
import { getAllCategories, updateTodo } from "../services/TodoServices";
import Modal from "../components/modal/Modal";
import styles from "../components/modal/Modal.module.scss";

interface Props {
  todo: Todo;
  onSave: () => void;
  onCancel: () => void;
}

const EditTodo: React.FC<Props> = ({ todo, onSave, onCancel }) => {
  const [task, setTask] = useState(todo.task);
  const [dueDate, setDueDate] = useState(todo.dueDate.slice(0, 10));
  const [completed, setCompleted] = useState(todo.completed);
  const [categoryId, setCategoryId] = useState(todo.category?.id || 0);
  const [categories, setCategories] = useState<Category[]>([]);
const [time, setTime] = useState(todo.time || "");
const [allDay, setAllDay] = useState(todo.allDay || false);


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
      await updateTodo(todo.id, updatedTodo);
      onSave();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <Modal title="Edit" onClose={onCancel}>
      <div className={styles.editHeader}>
        <h2>{todo.task}</h2>
      </div>



      <form onSubmit={handleSubmit} className={styles.modalForm}>
      <div className={styles.formGroup}>
          <label>Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
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
