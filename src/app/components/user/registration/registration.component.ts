import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{4,20}$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', Validators.required],
      phone: [''],
      gender: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    console.log('RegistrationComponent initialized');
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (controlName === 'username' && control?.hasError('pattern')) {
      return 'Username must be 4-20 alphanumeric characters';
    }
    if (controlName === 'email') {
      if (control?.hasError('email')) {
        return 'Please enter a valid email address';
      }
      if (control?.hasError('pattern')) {
        return 'Invalid email format';
      }
    }
    if (controlName === 'password' && control?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    if (controlName === 'confirmPassword' && this.registerForm.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        phone: this.registerForm.value.phone || '',
        email: this.registerForm.value.email,
        gender: this.registerForm.value.gender || '',
        role: 'user'
      };

      console.log('Sending registration data:', formData);
      this.http.post('http://localhost:5000/api/register', formData).subscribe({
        next: (response: any) => {
          console.log('Registration response:', response);
          if (response.success) {
            alert('Registration successful! Please log in.');
            this.registerForm.reset();
            this.router.navigate(['/login']);
          } else {
            this.registerForm.setErrors({ server: response.message });
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.registerForm.setErrors({ server: error.error?.message || 'Error connecting to server' });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}