import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // Skip auth header for public endpoints
  const publicPaths = ['/auth/login', '/auth/register', '/products'];
  const isPublic = publicPaths.some(p => req.url.includes(p));

  // Attach JWT token
  let authReq = req;
  const token = localStorage.getItem('ih_token');
  if (token && !isPublic) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Request-Id': crypto.randomUUID?.() || Date.now().toString()
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Token expired or invalid
          localStorage.removeItem('ih_token');
          localStorage.removeItem('ih_user');
          snackBar.open('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'Đăng nhập', { duration: 5000 })
            .onAction().subscribe(() => router.navigate(['/login']));
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
          break;
        case 403:
          snackBar.open('Bạn không có quyền truy cập tài nguyên này.', 'OK', { duration: 4000 });
          break;
        case 404:
          snackBar.open('Tài nguyên không tồn tại.', 'OK', { duration: 3000 });
          break;
        case 500:
          snackBar.open('Lỗi hệ thống. Vui lòng thử lại sau.', 'OK', { duration: 4000 });
          break;
        case 0:
          snackBar.open('Không thể kết nối server. Kiểm tra kết nối mạng.', 'OK', { duration: 4000 });
          break;
      }
      return throwError(() => error);
    })
  );
};
