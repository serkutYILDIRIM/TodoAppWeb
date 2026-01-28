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
import { ActivityService } from '../../../services/activity.service';
import { UpdateActivityDto } from '../../../models/update-activity.dto';
import { ActivityDto } from '../../../models/activity.dto';

@Component({
  selector: 'app-activity-detail',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './activity-detail.html',
  styleUrl: './activity-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityDetail implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly activityService = inject(ActivityService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  activityForm: FormGroup;
  priorityOptions = ['Low', 'Medium', 'High'];
  activityId = signal<number>(0);
  todoId = signal<number>(0);
  createdDate = signal<string>('');
  loading = signal<boolean>(false);

  constructor() {
    this.activityForm = this.fb.group({
      title: ['', [Validators.required]],
      isCompleted: [false],
      detail: [''],
      priority: ['']
    });
  }

  ngOnInit(): void {
    const activityIdParam = this.route.snapshot.paramMap.get('id');
    if (activityIdParam) {
      this.activityId.set(+activityIdParam);
      this.loadActivity();
    } else {
      this.router.navigate(['/todos']);
    }
  }

  loadActivity(): void {
    this.loading.set(true);
    this.activityService.getActivity(this.activityId()).subscribe({
      next: (activity: ActivityDto) => {
        this.todoId.set(activity.todoId);
        this.createdDate.set(activity.createdDate);
        this.activityForm.patchValue({
          title: activity.title,
          isCompleted: activity.isCompleted,
          detail: activity.detail || '',
          priority: activity.priority || ''
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading activity:', error);
        this.snackBar.open('Error loading activity. Please try again.', 'Close', {
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
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    const dto: UpdateActivityDto = {
      title: this.activityForm.value.title,
      isCompleted: this.activityForm.value.isCompleted,
      detail: this.activityForm.value.detail || null,
      priority: this.activityForm.value.priority || null
    };

    this.activityService.updateActivity(this.activityId(), dto).subscribe({
      next: () => {
        this.snackBar.open('Activity updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.goBack();
      },
      error: (error) => {
        console.error('Error updating activity:', error);
        this.snackBar.open('Error updating activity. Please try again.', 'Close', {
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

  goBack(): void {
    this.router.navigate(['/todos', this.todoId(), 'activities']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.activityForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    return '';
  }
}
