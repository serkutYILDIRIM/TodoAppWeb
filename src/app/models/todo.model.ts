export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TodoStatus;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2
}

export enum TodoStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2
}

export interface CreateTodoDto {
  title: string;
  description: string;
  priority: Priority;
  status: TodoStatus;
  dueDate?: Date;
}

export interface UpdateTodoDto {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TodoStatus;
  dueDate?: Date;
}
