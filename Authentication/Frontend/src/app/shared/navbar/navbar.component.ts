import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  getCurrentUser() {
    return this.authService.currentUser();
  }

  isAdmin() {
    return this.authService.isUserAdmin();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
    this.showUserMenu = false;
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }
}

