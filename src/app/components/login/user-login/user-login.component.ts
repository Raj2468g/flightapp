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
    this.authService.userLogin(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/user']);
      },
      error: (err) => {
        this.error = 'Error connecting to server: ' + (err.message || 'Unknown error');
        console.error('User login failed:', err);
      }
    });
  }
}