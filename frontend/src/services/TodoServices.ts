import { Todo, Category, CreateTodoDTO } from "../types/Todo";

const BASE_URL = "http://localhost:8080/todos";

// GET all todos
export const getAllTodos = async (): Promise<Todo[]> => {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch todos");
    }
    const data = await response.json();
    return data;
};

// CREATE a new todo
export const createTodo = async (todo: CreateTodoDTO): Promise<Todo> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error("Failed to create todo");
  }

  return await response.json();
};


// UPDATE a todo
export const updateTodo = async (id: number, todo: Todo): Promise<Todo> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            task: todo.task,
            dueDate: todo.dueDate,
            time: todo.time,
            allDay: todo.allDay,
            completed: todo.completed,
            archived: todo.archived,
            category: {
                id: todo.category.id,
            },
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to update todo");
    }

    const data = await response.json();
    return data;
};

// SOFT DELETE a todo
export const archiveTodo = async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}/archive`, {
        method: "PATCH",
    });

    if (!response.ok) {
        throw new Error("Failed to archive todo");
    }
};

// GET all categories
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await fetch("http://localhost:8080/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return await response.json();
};


// CREATE a new category
export async function createCategory(name: string): Promise<Category> {
  const res = await fetch("http://localhost:8080/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Failed to create category");

  return res.json();
}


// DUPLICATE tasks
export const duplicateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch("http://localhost:8080/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task: todo.task + " (copy)",
      dueDate: todo.dueDate,
      completed: false,
      archived: false,
      category: {
        id: todo.category.id,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to duplicate todo");
  }

  const data = await response.json();
  return data;
};







