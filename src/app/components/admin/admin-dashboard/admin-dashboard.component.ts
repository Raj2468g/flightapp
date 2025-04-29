import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  currentAdminName: string = 'Admin';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadAdmin();
  }

  private loadAdmin() {
    try {
      const user = this.authService.getCurrentUser();
      this.currentAdminName = user?.role || 'Admin'; // Fallback to 'Admin'
      console.log('Current admin:', user);
    } catch (err) {
      console.error('Error loading admin:', err);
      this.currentAdminName = 'Admin';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }
}