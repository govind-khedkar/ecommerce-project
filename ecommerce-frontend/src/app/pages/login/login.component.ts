import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) { }
  email: string = "";
  password: string = "";
  code: string = "";
  newPassword: string = "";
  showForgotForm: boolean = false;
  forgotEmail: string = "";
  errorMsg: string = "";

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  login() {
    this.errorMsg = "";
    if (!this.email || !this.password) {
      this.errorMsg = "Please fill all fields";
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
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("name", res.user.name);
        if (res.user.role == "ADMIN") {
          this.router.navigate(['/admin/products']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.message || "Login failed";
      }
    });
  }

  forgotPassword() {
    this.errorMsg = "";
    if (!this.forgotEmail) {
      this.errorMsg = "Please enter your email";
      return;
    }
    if (!this.isValidEmail(this.forgotEmail)) {
      this.errorMsg = "Please enter a valid email";
      return;
    }
    this.authService.forgotPassword(this.forgotEmail).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.code = res.data.code;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || "Forgot password failed";
      }
    });
  }

  verifyPassword() {
    this.errorMsg = "";
    if (!this.code) {
      this.errorMsg = "Please enter the verification code";
      return;
    }
    this.authService.verifyPassword(this.forgotEmail, this.code).subscribe({
      next: (res: any) => {
        alert(res.message);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || "Verify failed";
      }
    });
  }

  resetPassword() {
    this.errorMsg = "";
    if (!this.newPassword) {
      this.errorMsg = "Please enter new password";
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMsg = "Password must be at least 6 characters";
      return;
    }
    this.authService.resetPassword(this.forgotEmail, this.code, this.newPassword).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.code = "";
        this.newPassword = "";
        this.showForgotForm = false;
        this.forgotEmail = "";
      },
      error: (err) => {
        this.errorMsg = err.error?.message || "Reset failed";
      }
    });
  }
}