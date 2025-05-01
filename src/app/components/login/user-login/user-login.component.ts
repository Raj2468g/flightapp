
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.error = '';
    this.authService.userLogin(this.username, this.password).subscribe({
      next: () => {
        console.log('User login successful, navigating to /user');
        this.router.navigate(['/user']);
      },
      error: (err) => {
        console.error('User login failed:', err);
        this.error = err.error?.error || 'Error connecting to server. Please check if the backend is running.';
      }
    });
  }
}