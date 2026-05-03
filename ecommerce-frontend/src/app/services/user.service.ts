import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get('http://localhost:3000/users/all',
      { withCredentials: true }
    );
  }

  toggleUserLock(userId: number, isLocked: boolean) {
    return this.http.put(`http://localhost:3000/users/${userId}/lock`,
      { isLocked },
      { withCredentials: true }
    );
  }

  getProfile() {
    return this.http.get('http://localhost:3000/users/profile',
      { withCredentials: true }
    );
  }

  updateProfile(name: string, email: string) {
    return this.http.put('http://localhost:3000/users/profile',
      { name, email },
      { withCredentials: true }
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put('http://localhost:3000/users/change-password',
      { currentPassword, newPassword },
      { withCredentials: true }
    );
  }
}
