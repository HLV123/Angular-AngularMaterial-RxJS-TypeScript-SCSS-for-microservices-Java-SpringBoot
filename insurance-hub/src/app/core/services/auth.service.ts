import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, UserRole, LoginResponse } from '../models';
import { MockDataService } from './mock-data.service';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(this.loadUser());
  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => !!this.currentUser());
  userRoles = computed(() => this.currentUser()?.roles || []);
  constructor(private router: Router, private mock: MockDataService) {}
  login(creds: any): Observable<LoginResponse> {
    const r = this.mock.login(creds.username, creds.password);
    if (r) return of(r).pipe(delay(600), tap(res => { localStorage.setItem('ih_token', res.accessToken); localStorage.setItem('ih_user', JSON.stringify(res.user)); this.currentUser.set(res.user); }));
    return throwError(() => new Error('Tài khoản hoặc mật khẩu không đúng'));
  }
  register(data: any): Observable<any> { return of({ success: true }).pipe(delay(800)); }
  logout() { localStorage.removeItem('ih_token'); localStorage.removeItem('ih_user'); this.currentUser.set(null); this.router.navigate(['/login']); }
  hasRole(r: UserRole) { return this.userRoles().includes(r); }
  hasAnyRole(rs: UserRole[]) { return rs.some(r => this.hasRole(r)); }
  getToken() { return localStorage.getItem('ih_token'); }
  private loadUser(): User | null { try { const j = localStorage.getItem('ih_user'); return j ? JSON.parse(j) : null; } catch { return null; } }
}
