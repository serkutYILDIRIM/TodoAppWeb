import { Routes } from '@angular/router';
import { Login } from './components/pages/login/login';
import { TodoList } from './components/pages/todo-list/todo-list';
import { TodoCreate } from './components/pages/todo-create/todo-create';
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
    path: '**',
    redirectTo: '/login'
  }
];
