import { Routes } from '@angular/router';
import { Login } from './components/pages/login/login';
import { TodoList } from './components/pages/todo-list/todo-list';
import { TodoCreate } from './components/pages/todo-create/todo-create';
import { TodoDetail } from './components/pages/todo-detail/todo-detail';
import { ActivityList } from './components/pages/activity-list/activity-list';
import { ActivityCreate } from './components/pages/activity-create/activity-create';
import { ActivityDetail } from './components/pages/activity-detail/activity-detail';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'todos',
    component: TodoList,
    canActivate: [authGuard]
  },
  {
    path: 'todos/create',
    component: TodoCreate,
    canActivate: [authGuard]
  },
  {
    path: 'todos/:id',
    component: TodoDetail,
    canActivate: [authGuard]
  },
  {
    path: 'todos/:todoId/activities',
    component: ActivityList,
    canActivate: [authGuard]
  },
  {
    path: 'todos/:todoId/activities/create',
    component: ActivityCreate,
    canActivate: [authGuard]
  },
  {
    path: 'activities/:id',
    component: ActivityDetail,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
