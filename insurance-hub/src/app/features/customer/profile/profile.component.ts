import{Component,inject}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatDividerModule}from'@angular/material/divider';import{AuthService}from'../../../core/services/auth.service';import{StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-profile',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,MatDividerModule,StatusViPipe],
template:`<div><section class="ph"><h1>Tài khoản của tôi</h1></section><div class="ctn" *ngIf="auth.user() as u">
<div class="pg"><mat-card class="pc"><div class="av"><mat-icon>account_circle</mat-icon></div><h2>{{u.firstName}} {{u.lastName}}</h2><p>{{u.email}}</p>
<div class="rl"><span *ngFor="let r of u.roles" class="rb">{{r|statusVi}}</span></div></mat-card>
<mat-card class="dc"><h3>Thông tin cá nhân</h3>
<div class="di"><span>Họ tên</span><b>{{u.firstName}} {{u.lastName}}</b></div><div class="di"><span>Email</span><b>{{u.email}}</b></div>
<div class="di"><span>SĐT</span><b>{{u.phone||'Chưa cập nhật'}}</b></div><div class="di"><span>Ngày tạo</span><b>{{u.createdAt|date:'dd/MM/yyyy'}}</b></div>
<div class="di"><span>Đăng nhập cuối</span><b>{{u.lastLogin|date:'dd/MM/yyyy HH:mm'}}</b></div><div class="di"><span>Xác thực email</span><b>{{u.emailVerified?'Đã xác thực':'Chưa'}}</b></div>
<mat-divider></mat-divider><h3 style="margin-top:16px">Truy cập nhanh</h3>
<div class="qa"><a mat-stroked-button color="primary" routerLink="/policies"><mat-icon>description</mat-icon>Hợp đồng (6)</a>
<a mat-stroked-button routerLink="/claims"><mat-icon>assignment</mat-icon>Bồi thường (4)</a>
<a mat-stroked-button routerLink="/payment"><mat-icon>payment</mat-icon>Thanh toán (6)</a>
<a mat-stroked-button routerLink="/notifications"><mat-icon>notifications</mat-icon>Thông báo</a></div>
</mat-card></div></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:900px;margin:0 auto;padding:28px 24px}.pg{display:grid;grid-template-columns:280px 1fr;gap:20px}
.pc{padding:28px!important;border-radius:14px!important;text-align:center;.av{mat-icon{font-size:80px;width:80px;height:80px;color:#1565c0}}h2{font-size:20px;font-weight:700;margin:8px 0 2px}p{font-size:13px;color:#888}
.rl{margin-top:10px;display:flex;flex-wrap:wrap;justify-content:center;gap:4px;.rb{padding:2px 10px;background:#e3f2fd;color:#1565c0;border-radius:12px;font-size:11px;font-weight:600}}}
.dc{padding:24px!important;border-radius:14px!important;h3{font-size:15px;font-weight:600;margin-bottom:12px;color:#1565c0}}
.di{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f5f5f5;span{color:#888;font-size:13px}b{font-size:13px}}
.qa{display:flex;flex-direction:column;gap:8px}
@media(max-width:768px){.pg{grid-template-columns:1fr}}`]})
export class ProfileComponent{auth=inject(AuthService);}