import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.css'
})
export class AdminUserComponent implements OnInit {

  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data;
      },
      error: () => alert('Failed to load users')
    });
  }

  toggleLock(user: any) {
    this.userService.toggleUserLock(user.id, !user.isLocked).subscribe({
      next: (res: any) => {
        alert(res.message);
        user.isLocked = !user.isLocked;
      },
      error: () => alert('Failed to update user')
    });
  }
}