import { Todo, Category, CreateTodoDTO } from "../types/Todo";

const BASE_URL = "http://localhost:8080/todos";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
console.log("API URL:", API_URL);



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

// COMPLETE tasks
export const toggleCompleteTodo = async (id: number, completed: boolean) => {
  const response = await fetch(`${API_URL}/${id}/complete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error("Failed to toggle complete");
  }

  return response.json();
};


export const getFilteredTodos = async (
  archived = false,
  completed = false,
  page = 0,
  size = 5
) => {
  const response = await fetch(
    `http://localhost:8080/todos/filter?archived=${archived}&completed=${completed}&page=${page}&size=${size}`
  );
  if (!response.ok) throw new Error("Failed to fetch filtered todos");
  return response.json(); // returns { content: Todo[], totalPages, totalElements, etc. }
};

export const getTodoCount = async (
  archived = false,
  completed = false
): Promise<number> => {
  const url = `http://localhost:8080/todos/filter?archived=${archived}&completed=${completed}&page=0&size=1`;
  console.log("Calling:", url); // debug line
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    console.error("Error fetching count:", data);
    throw new Error("Failed to get count");
  }

  return data.totalElements;
};

