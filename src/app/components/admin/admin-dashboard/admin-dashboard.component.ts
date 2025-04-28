import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone:false
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }
}