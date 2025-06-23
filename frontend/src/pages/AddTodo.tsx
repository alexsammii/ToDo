import { useState, useEffect } from "react";
import { getAllCategories, createTodo, createCategory } from "../services/TodoServices";
import { Category } from "../types/Todo";
import Modal from "../components/modal/Modal";
import styles from "../components/modal/Modal.module.scss";
import { toast } from "react-toastify";


type Props = {
  onTodoAdded: (newTodo: any) => void; 
  onCancel: () => void;
};


export default function AddTodo({ onTodoAdded, onCancel }: Props) {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [time, setTime] = useState("");
  const [allDay, setAllDay] = useState(false);

  useEffect(() => {
    getAllCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories.", err));
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!task || !dueDate || categoryId === null) return;

  try {
    const created = await createTodo({
      task,
      dueDate,
      time: allDay ? null : time,
      allDay,
      completed: false,
      archived: false,
      category: { id: categoryId },
    });

    setTask("");
    setDueDate("");
    setTime("");
    setAllDay(false);
    setCategoryId(null);

    toast.success("Task added!", {
    position: "top-right",
    autoClose: 2000,
  });

    onTodoAdded(created); 
  } catch (err) {
    console.error("Failed to create todo", err);
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
    <Modal title="Add Task" onClose={onCancel}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label>Task:</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task"
            required
          />
        </div>

        <div className={styles.formGroup}>
  <label htmlFor="category">Category:</label>

  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", width: "100%", maxWidth: "320px" }}>
    <select
      id="category"
      value={categoryId ?? ""}
      onChange={(e) => setCategoryId(Number(e.target.value))}
      required
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
            required
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


        

        <div className={styles.formActions}>
          <button type="submit">Add Todo</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
