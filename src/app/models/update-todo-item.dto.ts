export interface UpdateTodoItemDto {
  title: string;
  isCompleted: boolean;
  detail?: string | null;
  priority?: string | null;
}
