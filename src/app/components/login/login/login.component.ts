import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errors: string[] = [];
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.errors = [];
    this.isLoading = true;

    if (!this.credentials.username || !this.credentials.password) {
      this.errors = ['Username and password are required'];
      this.isLoading = false;
      return;
    }

    this.authService.userLogin(this.credentials.username, this.credentials.password).subscribe({
      next: (response) => {
        console.log('User login successful:', response.user);
        this.router.navigate(['/user/dashboard']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('User login failed:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || 'Login failed'];
        this.isLoading = false;
      }
    });
  }
}