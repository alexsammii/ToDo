export interface Category {
  id: number;
  name?: string;
}

export interface Todo {
  id: number;
  task: string;
  dueDate: string;
  completed: boolean;
  archived: boolean;
  category: Category;
}

export interface CreateTodoDTO {
  task: string;
  dueDate: string;
  completed: boolean;
  archived: boolean;
  category: {
    id: number;
  };
}
