import { Component, OnInit } from '@angular/core';
     import { AuthService } from '../../../services/auth.service';
     import { HttpClient } from '@angular/common/http';
     import { User } from '../../../models/user';

     @Component({
       selector: 'app-update-profile',
       templateUrl: './update-profile.component.html',
       styleUrls: ['./update-profile.component.css'],
       standalone:false
     })
     export class UpdateProfileComponent implements OnInit {
       user: User = { username: '', password: '', name: '', email: '', role: 'user' };
       msg: string = '';

       constructor(private authService: AuthService, private http: HttpClient) {}

       ngOnInit() {
         this.user = { ...this.authService.getCurrentUser() };
       }

       updateProfile() {
         this.http.put(`http://localhost:3000/api/users/${this.user._id}`, this.user).subscribe({
           next: () => {
             this.authService.getCurrentUser().name = this.user.name;
             this.authService.getCurrentUser().email = this.user.email;
             localStorage.setItem('currentUser', JSON.stringify(this.authService.getCurrentUser()));
             this.msg = 'Profile updated successfully!';
           },
           error: () => this.msg = 'Update failed'
         });
       }
     }