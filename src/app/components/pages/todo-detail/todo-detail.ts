import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TodoService } from '../../../services/todo.service';
import { UpdateTodoItemDto } from '../../../models/update-todo-item.dto';
import { TodoItemDto } from '../../../models/todo-item.dto';

@Component({
  selector: 'app-todo-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './todo-detail.html',
  styleUrl: './todo-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoDetail implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  todoForm: FormGroup;
  priorityOptions = ['Low', 'Medium', 'High'];
  todoId = signal<number>(0);
  createdDate = signal<string>('');
  activityCount = signal<number>(0);
  completedActivityCount = signal<number>(0);
  loading = signal<boolean>(false);

  constructor() {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required]],
      isCompleted: [false],
      detail: [''],
      priority: ['']
    });
  }

  ngOnInit(): void {
    const todoIdParam = this.route.snapshot.paramMap.get('id');
    if (todoIdParam) {
      this.todoId.set(+todoIdParam);
      this.loadTodo();
    } else {
      this.router.navigate(['/todos']);
    }
  }

  loadTodo(): void {
    this.loading.set(true);
    this.todoService.getTodo(this.todoId()).subscribe({
      next: (todo: TodoItemDto) => {
        this.createdDate.set(todo.createdDate);
        this.activityCount.set(todo.activityCount);
        this.completedActivityCount.set(todo.completedActivityCount);
        this.todoForm.patchValue({
          title: todo.title,
          isCompleted: todo.isCompleted,
          detail: todo.detail || '',
          priority: todo.priority || ''
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading todo:', error);
        this.snackBar.open('Error loading todo. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const dto: UpdateTodoItemDto = {
      title: this.todoForm.value.title,
      isCompleted: this.todoForm.value.isCompleted,
      detail: this.todoForm.value.detail || null,
      priority: this.todoForm.value.priority || null
    };

    this.todoService.updateTodo(this.todoId(), dto).subscribe({
      next: () => {
        this.snackBar.open('Todo updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.goBack();
      },
      error: (error) => {
        console.error('Error updating todo:', error);
        this.snackBar.open('Error updating todo. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  onCancel(): void {
    this.goBack();
  }

  viewActivities(): void {
    this.router.navigate(['/todos', this.todoId(), 'activities']);
  }

  goBack(): void {
    this.router.navigate(['/todos']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.todoForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    return '';
  }
}
