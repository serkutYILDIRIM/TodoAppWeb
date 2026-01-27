import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivityService } from '../../../services/activity.service';
import { TodoService } from '../../../services/todo.service';
import { ActivityDto } from '../../../models/activity.dto';
import { TodoItemDto } from '../../../models/todo-item.dto';

@Component({
  selector: 'app-activity-list',
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
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityList implements OnInit {
  private readonly activityService = inject(ActivityService);
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  todoId = signal<number>(0);
  todoTitle = signal<string>('');
  activities = signal<ActivityDto[]>([]);
  loading = signal<boolean>(false);
  displayedColumns: string[] = ['isCompleted', 'title', 'createdDate', 'priority', 'actions'];

  ngOnInit(): void {
    const todoIdParam = this.route.snapshot.paramMap.get('todoId');
    if (todoIdParam) {
      this.todoId.set(+todoIdParam);
      this.loadActivities();
    } else {
      this.router.navigate(['/todos']);
    }
  }

  loadActivities(): void {
    this.loading.set(true);
    this.activityService.getActivitiesByTodo(this.todoId()).subscribe({
      next: (activities) => {
        this.activities.set(activities);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.loading.set(false);
      }
    });
  }

  toggleCompletion(activity: ActivityDto): void {
    this.activityService.toggleActivityCompletion(activity.activityId).subscribe({
      next: () => {
        this.loadActivities();
      },
      error: (error) => {
        console.error('Error toggling activity:', error);
      }
    });
  }

  deleteActivity(activityId: number): void {
    const confirmed = confirm('Are you sure you want to delete this activity?');
    if (confirmed) {
      this.activityService.deleteActivity(activityId).subscribe({
        next: () => {
          this.loadActivities();
        },
        error: (error) => {
          console.error('Error deleting activity:', error);
        }
      });
    }
  }

  addActivity(): void {
    this.router.navigate(['/todos', this.todoId(), 'activities', 'create']);
  }

  goBack(): void {
    this.router.navigate(['/todos']);
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
}
