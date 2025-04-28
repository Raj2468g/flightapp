import { Injectable } from '@angular/core';
     import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
     import { AuthService } from '../services/auth.service';

     @Injectable({
       providedIn: 'root'
     })
     export class AuthGuard implements CanActivate {
       constructor(private authService: AuthService, private router: Router) {}

       canActivate(route: ActivatedRouteSnapshot): boolean {
         if (!this.authService.isLoggedIn()) {
           this.router.navigate(['/user-login']);
           return false;
         }
         const expectedRole = route.data['role'];
         if (!this.authService.hasRole(expectedRole)) {
           this.router.navigate([this.authService.hasRole('admin') ? '/admin/dashboard' : '/user/dashboard']);
           return false;
         }
         return true;
       }
     }