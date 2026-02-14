import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface AppError { code: string; message: string; details?: string; timestamp: string; }

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private snackBar = inject(MatSnackBar);

  handleError(error: any, context?: string): void {
    const msg = this.extractMessage(error);
    console.error(`[${context || 'App'}]`, error);
    this.snackBar.open(msg, 'Đóng', { duration: 5000, panelClass: 'error-snackbar' });
    // TODO: Send to Sentry/LogRocket when configured
  }

  handleValidationError(errors: Record<string, string>): void {
    const first = Object.values(errors)[0];
    this.snackBar.open(first, 'Đóng', { duration: 4000 });
  }

  private extractMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.error?.message) return error.error.message;
    if (error?.message) return error.message;
    if (error?.status === 0) return 'Không thể kết nối server';
    if (error?.status === 401) return 'Phiên đăng nhập hết hạn';
    if (error?.status === 403) return 'Không có quyền truy cập';
    if (error?.status === 404) return 'Không tìm thấy tài nguyên';
    if (error?.status >= 500) return 'Lỗi hệ thống, vui lòng thử lại';
    return 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }
}
