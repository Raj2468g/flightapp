import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  newUser: User = { username: '', email: '', password: '', phone: '', gender: '', role: 'user', createdAt: '' };
  editingUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        console.log('Users loaded:', users);
      },
      error: (err: any) => console.error('Error loading users:', err)
    });
  }

  addUser(): void {
    if (!this.newUser.password) {
      alert('Password is required for new users');
      return;
    }
    const userToAdd: User = {
      ...this.newUser,
      createdAt: new Date().toISOString().split('T')[0]
    };
    console.log('Adding user:', userToAdd);
    this.userService.addUser(userToAdd).subscribe({
      next: (user: User) => {
        this.users.push(user);
        this.newUser = { username: '', email: '', password: '', phone: '', gender: '', role: 'user', createdAt: '' };
        console.log('User added:', user);
        alert('User added successfully');
      },
      error: (err: any) => {
        console.error('Error adding user:', err);
        alert('Failed to add user: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  editUser(user: User): void {
    this.editingUser = { ...user, password: '' };
  }

  saveUser(): void {
    if (this.editingUser) {
      console.log('Saving user:', this.editingUser);
      this.userService.updateUser(this.editingUser).subscribe({
        next: (updatedUser: User) => {
          const index = this.users.findIndex(u => u._id === updatedUser._id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.editingUser = null;
          console.log('User updated:', updatedUser);
          alert('User updated successfully');
        },
        error: (err: any) => {
          console.error('Error updating user:', err);
          alert('Failed to update user: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  deleteUser(id: string): void {
    console.log('Deleting user ID:', id);
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== id);
        console.log('User deleted:', id);
        alert('User deleted successfully');
      },
      error: (err: any) => {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    });
  }
}