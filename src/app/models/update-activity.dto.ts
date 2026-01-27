export interface UpdateActivityDto {
  title: string;
  isCompleted: boolean;
  detail?: string | null;
  priority?: string | null;
}
