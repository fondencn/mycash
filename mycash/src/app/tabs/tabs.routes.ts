import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'spending-form',
        loadComponent: () =>
          import('../components/spending-form/spending-form.component').then((m) => m.SpendingFormComponent),
      },
      {
        path: 'spending-form/:id',
        loadComponent: () =>
          import('../components/spending-form/spending-form.component').then((m) => m.SpendingFormComponent),
      },
      {
        path: 'spending-detail/:id',
        loadComponent: () =>
          import('../components/spending-detail/spending-detail.component').then((m) => m.SpendingDetailComponent),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
