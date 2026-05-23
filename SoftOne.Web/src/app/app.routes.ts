import { Routes } from '@angular/router';

import { LoginPageComponent } from './features/auth/login-page/login-page.component';
import { TasksPageComponent } from './features/tasks/tasks-page/tasks-page.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

/**
 * Application routes.
 * Auth guards can be added to `mainLayoutRoutes` children in a future phase.
 */
export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Login | SoftOne',
  },
  {
    path: '',
    component: MainLayoutComponent,
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
        // canActivate: [authGuard] — future phase
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found | SoftOne',
  },
];
