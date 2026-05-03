import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  currentUrl: string = "";
  isAdmin: Boolean = false;
  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isLoggedIn = !!role;
    this.isAdmin = role === 'ADMIN';

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        const updatedRole = localStorage.getItem('role');
        this.isLoggedIn = !!updatedRole;
        this.isAdmin = updatedRole === "ADMIN";
      };
    })
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert("Logout failed");
      }
    });
  }
}
