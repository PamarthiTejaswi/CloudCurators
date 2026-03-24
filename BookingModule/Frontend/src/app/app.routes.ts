import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/bookings/pages/bookings-page/bookings-page.component').then(
        (m) => m.BookingsPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
