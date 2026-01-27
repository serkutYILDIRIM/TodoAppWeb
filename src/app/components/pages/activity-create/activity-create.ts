import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivityService } from '../../../services/activity.service';
import { CreateActivityDto } from '../../../models/create-activity.dto';

@Component({
  selector: 'app-activity-create',
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
  templateUrl: './activity-create.html',
  styleUrl: './activity-create.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCreate implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly activityService = inject(ActivityService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  activityForm: FormGroup;
  priorityOptions = ['Low', 'Medium', 'High'];
  todoId: number = 0;

  constructor() {
    this.activityForm = this.fb.group({
      title: ['', [Validators.required]],
      detail: [''],
      priority: ['']
    });
  }

  ngOnInit(): void {
    const todoIdParam = this.route.snapshot.paramMap.get('todoId');
    if (todoIdParam) {
      this.todoId = +todoIdParam;
    } else {
      this.router.navigate(['/todos']);
    }
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    const dto: CreateActivityDto = {
      todoId: this.todoId,
      title: this.activityForm.value.title,
      detail: this.activityForm.value.detail || null,
      priority: this.activityForm.value.priority || null
    };

    this.activityService.createActivity(dto).subscribe({
      next: () => {
        this.snackBar.open('Activity created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/todos', this.todoId, 'activities']);
      },
      error: (error) => {
        console.error('Error creating activity:', error);
        this.snackBar.open('Error creating activity. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/todos', this.todoId, 'activities']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.activityForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    return '';
  }
}
