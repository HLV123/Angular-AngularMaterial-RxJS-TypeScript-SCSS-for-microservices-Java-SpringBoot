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
