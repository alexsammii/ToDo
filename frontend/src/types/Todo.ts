export interface Category {
  id: number;
  name?: string;
}

export interface Todo {
  time: any;
  allDay: any;
  name: string;
  id: number;
  task: string;
  dueDate: string;
  completed: boolean;
  archived: boolean;
  category: Category;
}

export type CreateTodoDTO = {
  task: string;
  dueDate: string;
  time?: string | null; 
  allDay?: boolean; 
  completed: boolean;
  archived: boolean;
  category: {
    id: number;
  };
};
