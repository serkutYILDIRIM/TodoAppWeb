import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TodoItemDto } from '../models/todo-item.dto';
import { CreateTodoItemDto } from '../models/create-todo-item.dto';
import { UpdateTodoItemDto } from '../models/update-todo-item.dto';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/todoitems`;

  getTodosByUser(userId: number): Observable<TodoItemDto[]> {
    return this.http.get<TodoItemDto[]>(`${this.apiUrl}/user/${userId}`);
  }

  getTodo(todoId: number): Observable<TodoItemDto> {
    return this.http.get<TodoItemDto>(`${this.apiUrl}/${todoId}`);
  }

  createTodo(userId: number, dto: CreateTodoItemDto): Observable<TodoItemDto> {
    return this.http.post<TodoItemDto>(`${this.apiUrl}?userId=${userId}`, dto);
  }

  updateTodo(todoId: number, dto: UpdateTodoItemDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${todoId}`, dto);
  }

  toggleTodoCompletion(todoId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${todoId}/toggle`, {});
  }

  deleteTodo(todoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${todoId}`);
  }
}
