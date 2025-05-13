import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
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

    console.log('Attempting admin login with:', this.credentials);
    this.authService.adminLogin(this.credentials.username, this.credentials.password).subscribe({
      next: (response) => {
        console.log('Admin login successful:', response.user);
        this.router.navigate(['/admin/manage-users']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Admin login failed:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Admin login failed. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }
}