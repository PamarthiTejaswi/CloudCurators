import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HotelsListComponent } from './features/user/hotels-list/hotels-list.component';
import { AdminPortalComponent } from './features/admin/admin-portal/admin-portal.component';
import { AuthGuardService } from './guards/auth.guard';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: HotelsListComponent,
    canActivate: [
      () => {
        const authGuard = inject(AuthGuardService);
        return authGuard.canActivate();
      }
    ]
  },
  {
    path: 'admin',
    component: AdminPortalComponent,
    canActivate: [
      () => {
        const authGuard = inject(AuthGuardService);
        return authGuard.canActivateAdmin();
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
