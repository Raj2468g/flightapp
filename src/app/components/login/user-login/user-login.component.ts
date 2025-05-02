import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  credentials = { username: '', password: '' };
  errors: string[] = [];
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}
  navigateToRegister() {
    console.log(this.route.url);
    this.router.navigate(['/user/registration']);
  }
  login(): void {
    this.errors = [];
    this.isLoading = true;

    if (!this.credentials.username || !this.credentials.password) {
      this.errors = ['Username and password are required'];
      this.isLoading = false;
      return;
    }

    console.log('Attempting login with:', this.credentials);
    this.authService.userLogin(this.credentials.username, this.credentials.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/user']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || 'Login failed. Please check your credentials and try again.'];
        this.isLoading = false;
      }
    });
  }
}