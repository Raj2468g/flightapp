import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminNavComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  username: string | null = null;

  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    this.username = user ? user.username : null;
  }
}