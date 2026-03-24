import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, NotificationService } from '../../../services';
import { LoginRequest } from '../../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  rememberMe = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Load remembered email if exists
    const savedEmail = typeof localStorage !== 'undefined' ? localStorage.getItem('rememberedEmail') : null;
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail });
      this.rememberMe.set(true);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.notificationService.error('Please fill in all fields correctly');
      return;
    }

    this.isLoading.set(true);
    const request: LoginRequest = this.loginForm.value;

    this.authService.login(request).subscribe({
      next: () => {
        if (this.rememberMe()) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('rememberedEmail', request.email);
          }
        } else {
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('rememberedEmail');
          }
        }
        this.notificationService.success('Login successful!');
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message || 'Login failed. Please try again.';
        this.notificationService.error(message);
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}

