import{Component,inject,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule,Router}from'@angular/router';import{FormBuilder,ReactiveFormsModule,Validators}from'@angular/forms';import{MatCardModule}from'@angular/material/card';import{MatFormFieldModule}from'@angular/material/form-field';import{MatInputModule}from'@angular/material/input';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatCheckboxModule}from'@angular/material/checkbox';import{MatSelectModule}from'@angular/material/select';import{MatProgressSpinnerModule}from'@angular/material/progress-spinner';import{MatSnackBar,MatSnackBarModule}from'@angular/material/snack-bar';import{AuthService}from'../../../core/services/auth.service';
@Component({selector:'app-register',standalone:true,imports:[CommonModule,RouterModule,ReactiveFormsModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule,MatCheckboxModule,MatSelectModule,MatProgressSpinnerModule,MatSnackBarModule],
template:`<div class="rp"><mat-card class="rc"><div class="rh"><img src="assets/images/logo.png" class="rl"/><h2>Đăng ký tài khoản</h2><p>Tạo tài khoản Insurance Hub</p></div>
<form [formGroup]="f" (ngSubmit)="go()">
  <div class="fr"><mat-form-field appearance="outline"><mat-label>Họ</mat-label><input matInput formControlName="firstName"/></mat-form-field>
  <mat-form-field appearance="outline"><mat-label>Tên</mat-label><input matInput formControlName="lastName"/></mat-form-field></div>
  <mat-form-field appearance="outline" class="fw"><mat-label>Email</mat-label><input matInput formControlName="email" type="email"/><mat-icon matPrefix>email</mat-icon></mat-form-field>
  <mat-form-field appearance="outline" class="fw"><mat-label>Số điện thoại</mat-label><input matInput formControlName="phone"/><mat-icon matPrefix>phone</mat-icon></mat-form-field>
  <mat-form-field appearance="outline" class="fw"><mat-label>Loại tài khoản</mat-label><mat-select formControlName="userType"><mat-option value="INDIVIDUAL">Cá nhân</mat-option><mat-option value="CORPORATE">Doanh nghiệp</mat-option></mat-select></mat-form-field>
  <mat-form-field appearance="outline" class="fw"><mat-label>Mật khẩu</mat-label><input matInput [type]="hp()?'password':'text'" formControlName="password"/><mat-icon matPrefix>lock</mat-icon><button mat-icon-button matSuffix type="button" (click)="hp.set(!hp())"><mat-icon>{{hp()?'visibility_off':'visibility'}}</mat-icon></button><mat-hint>Tối thiểu 8 ký tự</mat-hint></mat-form-field>
  <mat-checkbox formControlName="agreeTerms" color="primary" class="tc">Tôi đồng ý với <a href="#">Điều khoản</a> và <a href="#">Chính sách bảo mật</a></mat-checkbox>
  <button mat-flat-button color="primary" type="submit" class="fw sb" [disabled]="ld()||f.invalid"><mat-spinner *ngIf="ld()" diameter="20"></mat-spinner><span *ngIf="!ld()">Đăng ký</span></button>
  <p class="ll">Đã có tài khoản? <a routerLink="/login">Đăng nhập</a></p>
</form></mat-card></div>`,
styles:[`.rp{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px 24px;background:linear-gradient(135deg,#e3f2fd,#e8f5e9)}
.rc{max-width:500px;width:100%;padding:36px 28px;border-radius:18px!important}
.rh{text-align:center;margin-bottom:28px;.rl{height:52px;margin-bottom:12px}h2{font-size:26px;font-weight:700}p{color:#666;font-size:14px}}
.fr{display:flex;gap:12px;mat-form-field{flex:1}}.fw{width:100%}
.tc{margin:10px 0 20px;font-size:13px;a{color:#1565c0}}.sb{height:46px;font-size:15px;border-radius:10px!important;margin-bottom:16px}
.ll{text-align:center;font-size:13px;color:#666;a{color:#1565c0;font-weight:600;text-decoration:none}}`]})
export class RegisterComponent{
  private fb=inject(FormBuilder);private auth=inject(AuthService);private router=inject(Router);private sb=inject(MatSnackBar);
  hp=signal(true);ld=signal(false);
  f=this.fb.group({firstName:['',Validators.required],lastName:['',Validators.required],email:['',[Validators.required,Validators.email]],phone:['',Validators.required],userType:['INDIVIDUAL'],password:['',[Validators.required,Validators.minLength(8)]],agreeTerms:[false,Validators.requiredTrue]});
  go(){this.ld.set(true);this.auth.register(this.f.value).subscribe({next:()=>{this.ld.set(false);this.sb.open('Đăng ký thành công!','OK',{duration:3000});this.router.navigate(['/login']);},error:()=>{this.ld.set(false);}});}
}
