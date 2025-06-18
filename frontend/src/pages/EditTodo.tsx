import React, { useEffect, useState } from "react";
import { Todo, Category } from "../types/Todo";
import { getAllCategories } from "../services/TodoServices";
import { updateTodo } from "../services/TodoServices";

interface EditTodo {
  todo: Todo;
  onSave: () => void;
  onCancel: () => void;
}

const EditTodo: React.FC<EditTodo> = ({ todo, onSave, onCancel }) => {
  const [task, setTask] = useState(todo.task);
  const [dueDate, setDueDate] = useState(todo.dueDate.slice(0, 10)); // format for input
  const [completed, setCompleted] = useState(todo.completed);
  const [categoryId, setCategoryId] = useState(todo.category?.id || 0);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTodo: Todo = {
      ...todo,
      task,
      dueDate,
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
    <form onSubmit={handleSubmit} className="border p-4 mb-4 rounded bg-gray-100">
      <h3 className="text-lg font-semibold mb-2">Edit Task</h3>

      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="border p-2 mb-2 w-full"
        placeholder="Task name"
        required
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <div className="mb-2">
        <label className="mr-2">Completed:</label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
      </div>

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        className="border p-2 mb-2 w-full"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditTodo;
