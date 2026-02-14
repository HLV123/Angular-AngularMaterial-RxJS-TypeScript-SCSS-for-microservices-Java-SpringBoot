#!/bin/bash
cd /home/claude/insurance-hub

# ===== SHARED COMPONENTS =====
mkdir -p src/app/shared/components/header src/app/shared/components/footer

cat > src/app/shared/components/header/header.component.ts << 'CEOF'
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models';
@Component({
  selector: 'app-header', standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule, MatDividerModule],
  template: `
    <mat-toolbar class="h"><div class="hi">
      <a routerLink="/" class="logo"><img src="assets/images/logo.png" alt="Logo" class="logo-img"/><span class="bn">Insurance <b>Hub</b></span></a>
      <nav class="nav" *ngIf="!mob()">
        <a routerLink="/" routerLinkActive="act" [routerLinkActiveOptions]="{exact:true}">Trang chủ</a>
        <a routerLink="/products" routerLinkActive="act">Sản phẩm</a>
        <a routerLink="/about" routerLinkActive="act">Giới thiệu</a>
        <a routerLink="/contact" routerLinkActive="act">Liên hệ</a>
        <a *ngIf="auth.hasAnyRole([AR])" routerLink="/agent" routerLinkActive="act">Đại lý</a>
        <a *ngIf="auth.hasAnyRole([AD,SA])" routerLink="/admin" routerLinkActive="act">Quản trị</a>
        <a *ngIf="auth.hasAnyRole([PT])" routerLink="/partner" routerLinkActive="act">Đối tác</a>
      </nav>
      <div class="acts">
        <button mat-icon-button *ngIf="auth.isAuthenticated()" [matMenuTriggerFor]="nm" matBadge="3" matBadgeColor="warn" matBadgeSize="small"><mat-icon>notifications</mat-icon></button>
        <mat-menu #nm="matMenu"><button mat-menu-item routerLink="/notifications"><mat-icon>notifications</mat-icon>Xem tất cả thông báo</button></mat-menu>
        <ng-container *ngIf="auth.isAuthenticated(); else noAuth">
          <button mat-icon-button [matMenuTriggerFor]="um"><mat-icon>account_circle</mat-icon></button>
          <mat-menu #um="matMenu">
            <div class="um-head"><mat-icon class="um-av">account_circle</mat-icon><div><b>{{auth.user()?.firstName}} {{auth.user()?.lastName}}</b><br/><small>{{auth.user()?.email}}</small></div></div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/customer/profile"><mat-icon>person</mat-icon>Tài khoản</button>
            <button mat-menu-item routerLink="/policies"><mat-icon>description</mat-icon>Hợp đồng</button>
            <button mat-menu-item routerLink="/claims"><mat-icon>assignment</mat-icon>Bồi thường</button>
            <button mat-menu-item routerLink="/payment"><mat-icon>payment</mat-icon>Thanh toán</button>
            <button mat-menu-item routerLink="/notifications"><mat-icon>notifications</mat-icon>Thông báo</button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="auth.logout()"><mat-icon>logout</mat-icon>Đăng xuất</button>
          </mat-menu>
        </ng-container>
        <ng-template #noAuth>
          <a mat-stroked-button routerLink="/login" class="lb">Đăng nhập</a>
          <a mat-flat-button color="primary" routerLink="/register" class="rb">Đăng ký</a>
        </ng-template>
        <button mat-icon-button class="mob-btn" (click)="mob.set(!mob())"><mat-icon>{{mob()?'close':'menu'}}</mat-icon></button>
      </div>
    </div></mat-toolbar>
    <div class="mob-menu" *ngIf="mob()" (click)="mob.set(false)"><nav>
      <a routerLink="/">Trang chủ</a><a routerLink="/products">Sản phẩm</a><a routerLink="/about">Giới thiệu</a><a routerLink="/contact">Liên hệ</a>
      <ng-container *ngIf="auth.isAuthenticated()"><a routerLink="/policies">Hợp đồng</a><a routerLink="/claims">Bồi thường</a><a routerLink="/payment">Thanh toán</a><a routerLink="/customer/profile">Tài khoản</a></ng-container>
      <ng-container *ngIf="!auth.isAuthenticated()"><a routerLink="/login">Đăng nhập</a><a routerLink="/register">Đăng ký</a></ng-container>
    </nav></div>`,
  styles: [`
    .h{background:#fff;border-bottom:1px solid #e0e0e0;position:sticky;top:0;z-index:1000;padding:0;box-shadow:0 2px 8px rgba(0,0,0,.08)}
    .hi{display:flex;align-items:center;justify-content:space-between;width:100%;max-width:1400px;margin:0 auto;padding:0 24px;height:64px}
    .logo{display:flex;align-items:center;gap:8px;text-decoration:none;color:#333} .logo-img{height:40px}
    .bn{font-size:20px;font-weight:400;color:#1565c0} .bn b{color:#2e7d32;font-weight:700}
    .nav{display:flex;gap:4px} .nav a{text-decoration:none;color:#555;padding:8px 14px;border-radius:8px;font-size:14px;font-weight:500;transition:.2s}
    .nav a:hover{background:#e3f2fd;color:#1565c0} .nav a.act{background:#e3f2fd;color:#1565c0;font-weight:600}
    .acts{display:flex;align-items:center;gap:6px} .lb{border-color:#1565c0!important;color:#1565c0!important;font-size:13px!important}
    .rb{font-size:13px!important;border-radius:8px!important}
    .um-head{display:flex;align-items:center;gap:12px;padding:12px 16px} .um-av{font-size:36px;width:36px;height:36px;color:#1565c0}
    .mob-btn{display:none}
    .mob-menu{display:none;position:fixed;top:64px;left:0;right:0;bottom:0;background:#fff;z-index:999;padding:16px}
    .mob-menu nav{display:flex;flex-direction:column} .mob-menu a{padding:14px 16px;text-decoration:none;color:#333;font-size:16px;border-radius:8px}
    .mob-menu a:hover{background:#e3f2fd}
    @media(max-width:960px){.nav{display:none}.mob-btn{display:block}.mob-menu{display:block}.lb,.rb{display:none!important}}
  `]
})
export class HeaderComponent {
  auth=inject(AuthService); mob=signal(false);
  AR=UserRole.AGENT; AD=UserRole.ADMIN; SA=UserRole.SUPER_ADMIN; PT=UserRole.PARTNER;
}
CEOF

cat > src/app/shared/components/footer/footer.component.ts << 'CEOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-footer', standalone: true, imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <footer class="ft"><div class="fti"><div class="ftc brand">
      <div class="fl"><img src="assets/images/logo.png" class="flogo"/><span class="fn">Insurance <b>Hub</b></span></div>
      <p>Nền tảng bảo hiểm số hàng đầu Việt Nam.</p>
    </div><div class="ftc"><h4>Sản phẩm</h4>
      <a routerLink="/products" [queryParams]="{category:'HEALTH'}">BH Sức khỏe</a>
      <a routerLink="/products" [queryParams]="{category:'LIFE'}">BH Nhân thọ</a>
      <a routerLink="/products" [queryParams]="{category:'MOTOR'}">BH Xe cơ giới</a>
      <a routerLink="/products" [queryParams]="{category:'PROPERTY'}">BH Tài sản</a>
      <a routerLink="/products" [queryParams]="{category:'TRAVEL'}">BH Du lịch</a>
    </div><div class="ftc"><h4>Hỗ trợ</h4>
      <a routerLink="/about">Giới thiệu</a><a routerLink="/contact">Liên hệ</a><a href="#">FAQ</a><a href="#">Điều khoản</a>
    </div><div class="ftc"><h4>Liên hệ</h4>
      <p><mat-icon>phone</mat-icon> 1900 1234 (24/7)</p><p><mat-icon>email</mat-icon> support&#64;insurancehub.vn</p><p><mat-icon>location_on</mat-icon> 123 Nguyễn Huệ, Q.1, HCM</p>
    </div></div>
    <div class="ftb"><p>&copy; 2024 Insurance Hub. All rights reserved.</p></div></footer>`,
  styles: [`
    .ft{background:#1a2332;color:#b0bec5} .fti{max-width:1400px;margin:0 auto;padding:48px 24px 32px;display:flex;gap:40px;flex-wrap:wrap}
    .ftc{flex:1;min-width:180px} .brand{flex:1.5} .fl{display:flex;align-items:center;gap:8px;margin-bottom:12px}
    .flogo{height:32px} .fn{font-size:18px;color:#fff} .fn b{color:#66bb6a}
    .ftc h4{color:#fff;font-size:15px;margin-bottom:12px} .ftc a{display:block;color:#b0bec5;text-decoration:none;padding:3px 0;font-size:13px}
    .ftc a:hover{color:#42a5f5} .ftc p{font-size:13px;display:flex;align-items:center;gap:6px;margin:4px 0}
    .ftc p mat-icon{font-size:16px;width:16px;height:16px;color:#42a5f5}
    .ftb{border-top:1px solid #2c3e50;text-align:center;padding:16px;font-size:12px}
    @media(max-width:768px){.fti{flex-direction:column;gap:24px}}
  `]
})
export class FooterComponent {}
CEOF

echo "Shared components OK"
