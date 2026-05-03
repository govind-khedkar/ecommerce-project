import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  name: string = '';
  email: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res: any) => {
        this.name = res.data.name;
        this.email = res.data.email;
      },
      error: () => alert('Failed to load profile')
    });
  }

  updateProfile() {
    this.userService.updateProfile(this.name, this.email).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.isError = false;
        localStorage.setItem('name', this.name);
      },
      error: (err) => {
        this.message = err.error?.message || 'Update failed';
        this.isError = true;
      }
    });
  }
}