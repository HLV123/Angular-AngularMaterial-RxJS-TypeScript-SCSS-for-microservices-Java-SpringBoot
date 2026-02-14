import{Component,inject}from'@angular/core';import{CommonModule}from'@angular/common';import{FormBuilder,ReactiveFormsModule,Validators}from'@angular/forms';import{MatCardModule}from'@angular/material/card';import{MatFormFieldModule}from'@angular/material/form-field';import{MatInputModule}from'@angular/material/input';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatSelectModule}from'@angular/material/select';import{MatSnackBar,MatSnackBarModule}from'@angular/material/snack-bar';
@Component({selector:'app-contact',standalone:true,imports:[CommonModule,ReactiveFormsModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule,MatSelectModule,MatSnackBarModule],
template:`<section class="ch"><h1>Liên hệ</h1><p>Đội ngũ Insurance Hub sẵn sàng hỗ trợ</p></section>
<div class="ctn"><div class="cg"><div class="ci"><div class="ic"><mat-icon>phone</mat-icon><h3>Hotline</h3><p><b>1900 1234</b></p><p>24/7 miễn phí</p></div>
<div class="ic"><mat-icon>email</mat-icon><h3>Email</h3><p>support&#64;insurancehub.vn</p></div>
<div class="ic"><mat-icon>location_on</mat-icon><h3>Trụ sở</h3><p>123 Nguyễn Huệ, Q.1, HCM</p></div>
<div class="ic"><mat-icon>schedule</mat-icon><h3>Giờ làm</h3><p>T2-T7: 8:00-17:30</p></div></div>
<mat-card class="cf"><h2>Gửi yêu cầu</h2><form [formGroup]="f" (ngSubmit)="go()">
<div class="fr"><mat-form-field appearance="outline"><mat-label>Họ tên</mat-label><input matInput formControlName="name"/></mat-form-field>
<mat-form-field appearance="outline"><mat-label>SĐT</mat-label><input matInput formControlName="phone"/></mat-form-field></div>
<mat-form-field appearance="outline" class="fw"><mat-label>Email</mat-label><input matInput formControlName="email" type="email"/></mat-form-field>
<mat-form-field appearance="outline" class="fw"><mat-label>Chủ đề</mat-label><mat-select formControlName="subject"><mat-option value="product">Tư vấn SP</mat-option><mat-option value="claim">Bồi thường</mat-option><mat-option value="other">Khác</mat-option></mat-select></mat-form-field>
<mat-form-field appearance="outline" class="fw"><mat-label>Nội dung</mat-label><textarea matInput formControlName="message" rows="4"></textarea></mat-form-field>
<button mat-flat-button color="primary" type="submit" class="fw sb" [disabled]="f.invalid">Gửi yêu cầu</button></form></mat-card></div></div>`,
styles:[`.ch{background:linear-gradient(135deg,#1565c0,#2e7d32);color:#fff;padding:52px 24px;text-align:center;h1{font-size:32px;font-weight:700}p{opacity:.9}}
.ctn{max-width:1100px;margin:0 auto;padding:40px 24px}.cg{display:grid;grid-template-columns:1fr 1.5fr;gap:32px}
.ci{display:grid;grid-template-columns:1fr 1fr;gap:14px}.ic{background:#f8fafc;padding:20px;border-radius:10px;text-align:center;mat-icon{font-size:28px;width:28px;height:28px;color:#1565c0;margin-bottom:6px}h3{font-size:15px;margin-bottom:6px}p{font-size:13px;color:#666;margin:2px 0}}
.cf{padding:28px!important;border-radius:14px!important;h2{font-size:22px;font-weight:700;margin-bottom:20px}}.fr{display:flex;gap:12px;mat-form-field{flex:1}}.fw{width:100%}.sb{height:46px;font-size:15px;border-radius:10px!important}
@media(max-width:768px){.cg{grid-template-columns:1fr}.ci{grid-template-columns:1fr}}`]})
export class ContactComponent{
  private fb=inject(FormBuilder);private sb=inject(MatSnackBar);
  f=this.fb.group({name:['',Validators.required],phone:['',Validators.required],email:['',Validators.email],subject:['product'],message:['',Validators.required]});
  go(){this.sb.open('Cảm ơn! Chúng tôi sẽ liên hệ trong 24h.','OK',{duration:3000});this.f.reset();}
}