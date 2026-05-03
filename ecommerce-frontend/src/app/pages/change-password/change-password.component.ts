import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  currentPassword: string = '';
  newPassword: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private userService: UserService) {}

  changePassword() {
    if (!this.currentPassword || !this.newPassword) {
      this.message = 'Please fill all fields';
      this.isError = true;
      return;
    }

    this.userService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.isError = false;
        this.currentPassword = '';
        this.newPassword = '';
      },
      error: (err) => {
        this.message = err.error?.message || 'Change password failed';
        this.isError = true;
      }
    });
  }
}