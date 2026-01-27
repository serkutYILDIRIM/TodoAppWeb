export interface CreateActivityDto {
  todoId: number;
  title: string;
  detail?: string | null;
  priority?: string | null;
}
