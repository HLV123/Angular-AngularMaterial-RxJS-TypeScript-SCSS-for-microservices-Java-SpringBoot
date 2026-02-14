import{Component}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatCardModule}from'@angular/material/card';
@Component({selector:'app-about',standalone:true,imports:[CommonModule,RouterModule,MatButtonModule,MatIconModule,MatCardModule],
template:`<section class="ah" [style.backgroundImage]="'url(assets/images/about-office.jpg)'"><div class="ao"><h1>Về <span>Insurance Hub</span></h1><p>Nền tảng bảo hiểm số hàng đầu Việt Nam</p></div></section>
<div class="ctn"><section class="ms"><div class="mg"><div class="mc"><mat-icon>visibility</mat-icon><h3>Tầm nhìn</h3><p>Nền tảng bảo hiểm số #1 Việt Nam</p></div>
<div class="mc"><mat-icon>flag</mat-icon><h3>Sứ mệnh</h3><p>Số hóa toàn diện ngành bảo hiểm</p></div>
<div class="mc"><mat-icon>diamond</mat-icon><h3>Giá trị</h3><p>Minh bạch - Đổi mới - Tận tâm</p></div></div></section>
<section class="ns"><h2>Con số ấn tượng</h2><div class="ng">
<div class="ni"><b>45,000+</b><span>Khách hàng</span></div><div class="ni"><b>5,000+</b><span>Đại lý</span></div>
<div class="ni"><b>200+</b><span>Đối tác</span></div><div class="ni"><b>125 tỷ+</b><span>Phí BH</span></div>
<div class="ni"><b>99.9%</b><span>Uptime</span></div><div class="ni"><b>4.8★</b><span>Đánh giá</span></div></div></section>
<section class="tm"><h2>Đội ngũ</h2><div class="ti" [style.backgroundImage]="'url(assets/images/agent-team.jpg)'"></div>
<p class="td">Đội ngũ giàu kinh nghiệm trong ngành bảo hiểm và công nghệ.</p></section>
<section class="tc"><h2>Công nghệ</h2><div class="tg">
<mat-card><mat-icon>security</mat-icon><h4>Keycloak SSO</h4><p>Xác thực đa lớp</p></mat-card>
<mat-card><mat-icon>cloud</mat-icon><h4>Spring Boot</h4><p>Microservices</p></mat-card>
<mat-card><mat-icon>flash_on</mat-icon><h4>Kafka</h4><p>Event-driven</p></mat-card>
<mat-card><mat-icon>storage</mat-icon><h4>PostgreSQL+Redis</h4><p>Dữ liệu tin cậy</p></mat-card>
<mat-card><mat-icon>monitor_heart</mat-icon><h4>Prometheus</h4><p>Monitoring 24/7</p></mat-card>
<mat-card><mat-icon>manage_search</mat-icon><h4>ELK Stack</h4><p>Logging thông minh</p></mat-card></div></section></div>`,
styles:[`.ah{min-height:360px;background-size:cover;background-position:center}.ao{min-height:360px;background:linear-gradient(135deg,rgba(21,101,192,.9),rgba(46,125,50,.85));display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:40px;
h1{font-size:38px;font-weight:800;span{color:#ffd54f}}p{font-size:17px;opacity:.9;margin-top:8px}}
.ctn{max-width:1200px;margin:0 auto;padding:0 24px}section{padding:56px 0}h2{font-size:28px;font-weight:700;text-align:center;margin-bottom:32px}
.mg{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.mc{text-align:center;padding:28px;background:#f8fafc;border-radius:14px;mat-icon{font-size:36px;width:36px;height:36px;color:#1565c0;margin-bottom:8px}h3{font-size:18px;margin-bottom:6px}p{font-size:14px;color:#666}}
.ng{display:grid;grid-template-columns:repeat(6,1fr);gap:20px;text-align:center}.ni{b{font-size:28px;color:#1565c0;display:block;font-weight:800}span{font-size:12px;color:#666}}
.ti{height:360px;background-size:cover;background-position:center;border-radius:16px;margin-bottom:16px}.td{text-align:center;font-size:15px;color:#666;max-width:600px;margin:0 auto}
.tg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;mat-card{text-align:center;padding:20px!important;border-radius:10px!important;mat-icon{font-size:28px;width:28px;height:28px;color:#1565c0;margin-bottom:6px}h4{font-size:15px;margin-bottom:3px}p{font-size:12px;color:#888}}}
@media(max-width:768px){.mg,.tg{grid-template-columns:1fr}.ng{grid-template-columns:repeat(3,1fr)}}`]})
export class AboutComponent{}