import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { LoginPageComponent } from './core/auth/login-page.component';
import { AppShellComponent } from './pages/app-shell.component';
import { DashboardPageComponent } from './pages/dashboard-page.component';
import { ExpensesPageComponent } from './pages/expenses-page.component';
import { IncomesPageComponent } from './pages/incomes-page.component';
import { InvestmentsPageComponent } from './pages/investments-page.component';
import { RecurrencesPageComponent } from './pages/recurrences-page.component';
import { SettingsPageComponent } from './pages/settings-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: '',
    canActivate: [authGuard],
    component: AppShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'rendas',
        component: IncomesPageComponent,
      },
      {
        path: 'gastos',
        component: ExpensesPageComponent,
      },
      {
        path: 'recorrentes',
        component: RecurrencesPageComponent,
      },
      {
        path: 'investimentos',
        component: InvestmentsPageComponent,
      },
      {
        path: 'configuracoes',
        component: SettingsPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
