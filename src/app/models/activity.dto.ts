export interface ActivityDto {
  activityId: number;
  todoId: number;
  title: string;
  createdDate: string;
  isCompleted: boolean;
  detail: string | null;
  priority: string | null;
}
