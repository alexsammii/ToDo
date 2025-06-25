import React, { useState } from "react";

function CreateCategoryForm({
  onCategoryAdded,
}: {
  onCategoryAdded: () => void;
}) {
  // value typed in the input field
  const [name, setName] = useState("");

  // error messages
  const [error, setError] = useState("");

  // runs when the form is submitted
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // stops page from refreshing

    // If name is empty, show an error
    if (name.trim() === "") {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      // Make a POST request to create the category
      const response = await fetch("http://localhost:8080/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      setName("");
      setError("");

      onCategoryAdded();
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Category Name:
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <button type="submit">Add Category</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default CreateCategoryForm;
