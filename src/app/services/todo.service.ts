import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TodoItemDto } from '../models/todo-item.dto';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/todoitems`;

  getTodosByUser(userId: number): Observable<TodoItemDto[]> {
    return this.http.get<TodoItemDto[]>(`${this.apiUrl}/user/${userId}`);
  }

  toggleTodoCompletion(todoId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${todoId}/toggle`, {});
  }

  deleteTodo(todoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${todoId}`);
  }
}
