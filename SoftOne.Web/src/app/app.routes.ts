import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './features/auth/login-page/login-page.component';
import { TasksPageComponent } from './features/tasks/tasks-page/tasks-page.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Login | SoftOne',
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
      {
        path: 'tasks',
        component: TasksPageComponent,
        title: 'Tasks | SoftOne',
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found | SoftOne',
  },
];
