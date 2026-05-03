import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem("role");

  if(role !== "ADMIN") {
    alert("Admin access only");
    router.navigate(['/']);
    return false;
  }

  return true;
};
