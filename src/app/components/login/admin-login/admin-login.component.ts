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
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.adminLogin(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin/manage-bookings']);
      },
      error: (err) => {
        this.error = 'Error connecting to server: ' + (err.message || 'Unknown error');
        console.error('Admin login failed:', err);
      }
    });
  }
}