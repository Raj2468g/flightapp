import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // Added RouterModule
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Added RouterModule
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  credentials = { username: '', password: '' };
  errors: string[] = [];
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Add this to confirm navigation events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navigation completed to:', event.url);
      }
    });
  }

  navigateToRegister(): void {
    console.log('Navigating to /registration');
    this.router.navigate(['/registration']).then(success => {
      console.log('Navigation to registration successful:', success);
      if (!success) {
        console.error('Navigation failed. Check route configuration.');
      }
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }

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
        this.router.navigate(['/user']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || 'Login failed. Please check your credentials and try again.'];
        this.isLoading = false;
      }
    });
  }
}