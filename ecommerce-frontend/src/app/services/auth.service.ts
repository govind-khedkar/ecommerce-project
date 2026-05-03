import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post('http://localhost:3000/auth/login',
      { email, password },
      { withCredentials: true }
    );
  }

  register(name: string, email: string, password: string) {
    return this.http.post('http://localhost:3000/auth/register',
      { name, email, password },
      { withCredentials: true }
    );
  }

  logout() {
    return this.http.post('http://localhost:3000/auth/logout',
      {},
      { withCredentials: true }
    );
  }

  forgotPassword(email:string) {
    return this.http.post('http://localhost:3000/auth/forgot-password',
      {email},
      { withCredentials: true }
    );
  }

  verifyPassword(email:string, code:string){
    return this.http.post('http://localhost:3000/auth/verify-password',
      {email, code},
      { withCredentials: true }
    );
  }

  resetPassword(email:string, code:string, newPassword:string){
    return this.http.post('http://localhost:3000/auth/reset-password',
      {email, code, newPassword},
      { withCredentials: true }
    );
  }


}
