import { Component } from '@angular/core';
    import { AuthService } from '../../../services/auth.service';
    import { Router } from '@angular/router';

    @Component({
      selector: 'app-user-login',
      templateUrl: './user-login.component.html',
      styleUrls: ['./user-login.component.css'],
      standalone:false
    })
    export class UserLoginComponent {
      uname: string = '';
      pwd: string = '';
      msg: string = '';

      constructor(private authService: AuthService, private router: Router) {}

      loginCheck() {
        this.authService.login(this.uname, this.pwd, 'user').subscribe({
          next: (success) => {
            console.log(success);
            if (success) {
              this.router.navigate(['/user/dashboard']);
            } else {
              this.msg = 'Invalid credentials';
            }
          },
          error: () => this.msg = 'Login failed'
        });
      }
    }