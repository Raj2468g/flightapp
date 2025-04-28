import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

     @Component({
       selector: 'app-admin-login',
       templateUrl: './admin-login.component.html',
       styleUrls: ['./admin-login.component.css'],
       standalone:false
     })
     export class AdminLoginComponent {
       uname: string = '';
       pwd: string = '';
       msg: string = '';

       constructor(private authService: AuthService, private router: Router) {}

       loginCheck() {
         this.authService.login(this.uname, this.pwd, 'admin').subscribe({
           next: (success) => {
             if (success) {
               this.router.navigate(['/admin/dashboard']);
             } else {
               this.msg = 'Invalid credentials';
             }
           },
           error: () => this.msg = 'Login failed'
         });
       }
     }