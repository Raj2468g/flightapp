import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const user = this.authService.getCurrentUser();
    const token = localStorage.getItem('token');

    console.log('AuthGuard check:', { user, token, expectedRole });
    if (!token || !user) {
      console.log('No token or user, redirecting to login');
      this.router.navigate([expectedRole === 'admin' ? '/admin/login' : '/login']);
      return false;
    }

    if (user.role !== expectedRole) {
      console.log(`Role mismatch: expected ${expectedRole}, got ${user.role}`);
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}