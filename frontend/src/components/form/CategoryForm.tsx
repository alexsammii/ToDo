import { useState } from "react";
import { createCategory } from "../../services/TodoServices";

const CategoryForm = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(name);
      setName(""); // clear the input
      alert("Category added!");
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Category</button>
    </form>
  );
};

export default CategoryForm;
