import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavComponent],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  newUser: User = {
    username: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    role: 'user',
    createdAt: new Date().toISOString()
  };
  editingUser: User | null = null;
  errors: string[] = [];
  isLoading: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errors = [];
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.filter(user => user.role.toLowerCase() === 'user');
        console.log('Users loaded:', this.users);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to load users. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }

  validateUser(user: User): string[] {
    const errors: string[] = [];
    if (!user.username || user.username.length < 4 || user.username.length > 20) {
      errors.push('Username must be 4-20 characters long');
    }
    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.push('Valid email is required');
    }
    if (!this.editingUser && (!user.password || user.password.length < 6)) {
      errors.push('Password must be at least 6 characters long');
    }
    if (user.phone && !/\+?[1-9]\d{1,14}/.test(user.phone)) {
      errors.push('Valid phone number is required');
    }
    if (user.gender && !['male', 'female', 'other'].includes(user.gender)) {
      errors.push('Gender must be male, female, or other');
    }
    if (!user.role || !['user', 'admin'].includes(user.role)) {
      errors.push('Role must be user or admin');
    }
    return errors;
  }

  addUser(): void {
    this.errors = this.validateUser(this.newUser);
    if (this.errors.length > 0) return;

    this.isLoading = true;
    console.log('Adding user:', this.newUser);
    this.userService.addUser(this.newUser).subscribe({
      next: (user) => {
        if (user.role.toLowerCase() === 'user') {
          this.users.push(user);
        }
        this.newUser = {
          username: '',
          email: '',
          password: '',
          phone: '',
          gender: '',
          role: 'user',
          createdAt: new Date().toISOString()
        };
        console.log('User added:', user);
        alert('User added successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error adding user:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to add user. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }

  editUser(user: User): void {
    this.editingUser = { ...user, password: '' };
    this.errors = [];
  }

  saveUser(): void {
    if (!this.editingUser) return;

    this.errors = this.validateUser(this.editingUser);
    if (this.errors.length > 0) return;

    this.isLoading = true;
    console.log('Saving user:', this.editingUser);
    this.userService.updateUser(this.editingUser).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1 && updatedUser.role.toLowerCase() === 'user') {
          this.users[index] = updatedUser;
        } else if (index !== -1 && updatedUser.role.toLowerCase() !== 'user') {
          this.users.splice(index, 1); // Remove if role changed to admin
        }
        this.editingUser = null;
        console.log('User updated:', updatedUser);
        alert('User updated successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to update user. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.errors = [];
  }

  deleteUser(id: string): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.isLoading = true;
    console.log('Deleting user ID:', id);
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== id);
        console.log('User deleted:', id);
        alert('User deleted successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to delete user. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }
}