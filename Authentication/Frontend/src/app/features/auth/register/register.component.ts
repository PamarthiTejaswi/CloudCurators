import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, NotificationService } from '../../../services';
import { RegisterRequest } from '../../../models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  passwordStrength = signal(0);
  selectedRole = signal<'User' | 'Admin'>('User');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get passwordValue(): string {
    return this.registerForm.get('password')?.value || '';
  }

  hasMinLength(): boolean {
    return this.passwordValue.length >= 6;
  }

  hasUpperAndLower(): boolean {
    const value = this.passwordValue;
    return /[a-z]/.test(value) && /[A-Z]/.test(value);
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.passwordValue);
  }

  hasSpecial(): boolean {
    return /[^a-zA-Z0-9]/.test(this.passwordValue);
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }

  calculatePasswordStrength(): void {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    this.passwordStrength.set(strength);
  }

  getStrengthLabel(): string {
    const strength = this.passwordStrength();
    if (strength < 1) return 'Very Weak';
    if (strength < 2) return 'Weak';
    if (strength < 3) return 'Fair';
    if (strength < 4) return 'Good';
    return 'Very Strong';
  }

  getStrengthColor(): string {
    const strength = this.passwordStrength();
    if (strength < 1) return '#ef4444';
    if (strength < 2) return '#f97316';
    if (strength < 3) return '#eab308';
    if (strength < 4) return '#84cc16';
    return '#22c55e';
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.notificationService.error('Please fill in all fields correctly');
      return;
    }

    this.isLoading.set(true);
    const request: RegisterRequest = {
      name: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.notificationService.success('Account created successfully!');
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message || 'Registration failed. Please try again.';
        this.notificationService.error(message);
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}

