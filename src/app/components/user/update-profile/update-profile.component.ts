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
  user: User = { _id: '', id: '', username: '', password: '', name: '', email: '', role: 'user' };
  msg: string = '';

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser() as { _id: string; role: string; username?: string; password?: string; name?: string; email?: string };
    if (currentUser) {
      this.user = { 
        _id: currentUser._id, 
        id: currentUser._id, 
        username: currentUser.username || '', 
        password: currentUser.password || '', 
        name: currentUser.name || '', 
        email: currentUser.email || '', 
        role: currentUser.role || 'user' 
      };
    }
  }

  updateProfile() {
    const userId = this.user.id;
    this.http.put(`http://localhost:3000/api/users/${userId}`, this.user).subscribe({
      next: () => {
        const updatedUser = { ...this.authService.getCurrentUser(), name: this.user.name, email: this.user.email };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.msg = 'Profile updated successfully!';
      },
      error: () => this.msg = 'Update failed'
    });
  }
}