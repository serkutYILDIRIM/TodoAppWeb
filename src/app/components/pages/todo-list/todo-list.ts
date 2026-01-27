import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../services/auth.service';
import { TodoService } from '../../../services/todo.service';
import { TodoItemDto } from '../../../models/todo-item.dto';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    DatePipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoList implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  username = signal<string>('');
  todos = signal<TodoItemDto[]>([]);
  loading = signal<boolean>(false);
  displayedColumns: string[] = ['isCompleted', 'title', 'createdDate', 'priority', 'activities', 'actions'];

  ngOnInit(): void {
    this.username.set(this.authService.getUsername() || 'User');
    this.loadTodos();
  }

  loadTodos(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading.set(true);
    this.todoService.getTodosByUser(userId).subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.loading.set(false);
      }
    });
  }

  toggleCompletion(todo: TodoItemDto): void {
    this.todoService.toggleTodoCompletion(todo.todoId).subscribe({
      next: () => {
        this.loadTodos();
      },
      error: (error) => {
        console.error('Error toggling todo:', error);
      }
    });
  }

  deleteTodo(todoId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Todo',
        message: 'Are you sure you want to delete this todo? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.deleteTodo(todoId).subscribe({
          next: () => {
            this.loadTodos();
          },
          error: (error) => {
            console.error('Error deleting todo:', error);
          }
        });
      }
    });
  }

  editTodo(todoId: number): void {
    this.router.navigate(['/todos', todoId]);
  }

  viewDetails(todoId: number): void {
    this.router.navigate(['/todos', todoId, 'activities']);
  }

  addTodo(): void {
    this.router.navigate(['/todos/create']);
  }

  getPriorityColor(priority: string | null): string {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'warn';
      case 'medium':
        return 'accent';
      case 'low':
        return 'primary';
      default:
        return '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
