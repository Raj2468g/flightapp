import { Component } from '@angular/core';
     import { AuthService } from '../../../services/auth.service';
     import { Router } from '@angular/router';

     @Component({
       selector: 'app-admin-dashboard',
       templateUrl: './admin-dashboard.component.html',
       styleUrls: ['./admin-dashboard.component.css'],
       standalone:false
     })
     export class AdminDashboardComponent {
       constructor(private authService: AuthService, private router: Router) {}

       logout() {
         this.authService.logout();
       }
     }