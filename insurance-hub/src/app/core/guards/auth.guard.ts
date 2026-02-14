import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';
export const authGuard: CanActivateFn = (route, state) => { const a = inject(AuthService); const r = inject(Router); if (a.isAuthenticated()) return true; r.navigate(['/login'], { queryParams: { returnUrl: state.url } }); return false; };
export const roleGuard: CanActivateFn = (route, state) => { const a = inject(AuthService); const r = inject(Router); if (!a.isAuthenticated()) { r.navigate(['/login']); return false; } const roles = route.data?.['roles'] as UserRole[]; if (roles && !a.hasAnyRole(roles)) { r.navigate(['/']); return false; } return true; };
