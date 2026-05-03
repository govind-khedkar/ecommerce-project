import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = "";
  email: string = "";
  password: string = "";
  errorMsg: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  register() {
    this.errorMsg = "";

    if (!this.name || !this.email || !this.password) {
      this.errorMsg = "Please fill all fields";
      return;
    }

    if (this.name.trim().length < 2) {
      this.errorMsg = "Name must be at least 2 characters";
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMsg = "Please enter a valid email";
      return;
    }

    if (this.password.length < 6) {
      this.errorMsg = "Password must be at least 6 characters";
      return;
    }

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || "Register failed";
      }
    });
  }
}