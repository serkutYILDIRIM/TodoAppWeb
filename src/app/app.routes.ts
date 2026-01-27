import { Routes } from '@angular/router';
import { Login } from './components/pages/login/login';
import { TodoList } from './components/pages/todo-list/todo-list';
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
    path: '**',
    redirectTo: '/login'
  }
];
