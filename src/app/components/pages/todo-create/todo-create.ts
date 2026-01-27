import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { TodoService } from '../../../services/todo.service';
import { AuthService } from '../../../services/auth.service';
import { CreateTodoItemDto } from '../../../models/create-todo-item.dto';

@Component({
  selector: 'app-todo-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './todo-create.html',
  styleUrl: './todo-create.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoCreate {
  private readonly fb = inject(FormBuilder);
  private readonly todoService = inject(TodoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  todoForm: FormGroup;
  priorityOptions = ['Low', 'Medium', 'High'];

  constructor() {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required]],
      detail: [''],
      priority: ['']
    });
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const dto: CreateTodoItemDto = {
      title: this.todoForm.value.title,
      detail: this.todoForm.value.detail || null,
      priority: this.todoForm.value.priority || null
    };

    this.todoService.createTodo(userId, dto).subscribe({
      next: () => {
        this.snackBar.open('Todo created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/todos']);
      },
      error: (error) => {
        console.error('Error creating todo:', error);
        this.snackBar.open('Error creating todo. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  onCancel(): void {
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
