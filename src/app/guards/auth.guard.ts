import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.getCurrentUser();
    const targetPath = state.url; // Get the target route's URL

    console.log('AuthGuard check:', { user, targetPath });

    if (user) {
      if (targetPath.includes('admin') && user.role.toLowerCase() === 'admin') {
        console.log('AuthGuard: Allowing admin access');
        return true;
      } else if (targetPath.includes('user') && user.role.toLowerCase() === 'user') {
        console.log('AuthGuard: Allowing user access');
        return true;
      } else {
        console.log('AuthGuard: Role mismatch for path', targetPath);
        this.router.navigate(['/login']);
        return false;
      }
    }

    console.log('AuthGuard: No user');
    this.router.navigate(['/login']);
    return false;
  }
}