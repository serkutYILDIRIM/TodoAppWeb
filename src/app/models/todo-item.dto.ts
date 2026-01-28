export interface TodoItemDto {
  todoId: number;
  userId: number;
  title: string;
  createdDate: string;
  isCompleted: boolean;
  detail: string | null;
  priority: string | null;
  activityCount: number;
  completedActivityCount: number;
}
