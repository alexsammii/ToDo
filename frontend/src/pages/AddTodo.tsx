import { useState, useEffect } from "react";
import { getAllCategories, createTodo } from "../services/TodoServices";
import { Category } from "../types/Todo";
import styles from "./styling/AddTodo.module.scss";

type Props = {
  onTodoAdded: () => void;
};

export default function AddTodo({ onTodoAdded }: Props) {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getAllCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories.", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !dueDate || categoryId === null) return;

    try {
      await createTodo({
        task,
        dueDate,
        completed: false,
        archived: false,
        category: { id: categoryId },
      });
      setTask("");
      setDueDate("");
      setCategoryId(null);
      onTodoAdded();
    } catch (err) {
      console.error("Failed to create todo", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formWrapper}>
      <input
        type="text"
        placeholder="Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className={styles.input}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className={styles.input}
      />
      <select
        value={categoryId ?? ""}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        className={styles.input}
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button type="submit" className={styles.button}>
        Add Todo
      </button>
    </form>
  );
}
