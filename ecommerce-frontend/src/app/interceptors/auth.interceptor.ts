import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if(err.status === 401 || err.status === 403) {
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  )
};


