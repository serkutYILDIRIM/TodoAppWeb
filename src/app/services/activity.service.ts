import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActivityDto } from '../models/activity.dto';
import { CreateActivityDto } from '../models/create-activity.dto';
import { UpdateActivityDto } from '../models/update-activity.dto';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/activities`;

  getActivitiesByTodo(todoId: number): Observable<ActivityDto[]> {
    return this.http.get<ActivityDto[]>(`${this.apiUrl}/todo/${todoId}`);
  }

  getActivity(activityId: number): Observable<ActivityDto> {
    return this.http.get<ActivityDto>(`${this.apiUrl}/${activityId}`);
  }

  createActivity(dto: CreateActivityDto): Observable<ActivityDto> {
    return this.http.post<ActivityDto>(this.apiUrl, dto);
  }

  updateActivity(activityId: number, dto: UpdateActivityDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${activityId}`, dto);
  }

  toggleActivityCompletion(activityId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${activityId}/toggle`, {});
  }

  deleteActivity(activityId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${activityId}`);
  }
}
