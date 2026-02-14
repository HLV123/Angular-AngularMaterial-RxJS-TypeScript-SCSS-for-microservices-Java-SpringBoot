import{Component,inject,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule,Router,ActivatedRoute}from'@angular/router';import{FormBuilder,ReactiveFormsModule,Validators}from'@angular/forms';import{MatCardModule}from'@angular/material/card';import{MatFormFieldModule}from'@angular/material/form-field';import{MatInputModule}from'@angular/material/input';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatCheckboxModule}from'@angular/material/checkbox';import{MatProgressSpinnerModule}from'@angular/material/progress-spinner';import{MatSnackBar,MatSnackBarModule}from'@angular/material/snack-bar';import{MatDividerModule}from'@angular/material/divider';import{AuthService}from'../../../core/services/auth.service';
@Component({selector:'app-login',standalone:true,imports:[CommonModule,RouterModule,ReactiveFormsModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule,MatCheckboxModule,MatProgressSpinnerModule,MatSnackBarModule,MatDividerModule],
template:`
<div class="lp"><div class="ll" [style.backgroundImage]="'url(assets/images/about-office.jpg)'"><div class="llo">
  <img src="assets/images/logo.png" class="llg"/><h2>Insurance Hub</h2><p>Nền tảng bảo hiểm số hàng đầu</p>
  <div class="da"><h4>Tài khoản demo <small>(mật khẩu: Demo&#64;123)</small></h4>
  <div *ngFor="let a of accs" class="di" (click)="fill(a)"><mat-icon>{{a.ic}}</mat-icon><span>{{a.lb}}</span></div></div>
</div></div><div class="lr"><mat-card class="lc">
  <h2>Đăng nhập</h2><p class="ls">Chào mừng bạn trở lại</p>
  <form [formGroup]="f" (ngSubmit)="go()">
    <mat-form-field appearance="outline" class="fw"><mat-label>Email</mat-label><input matInput formControlName="username"/><mat-icon matPrefix>email</mat-icon></mat-form-field>
    <mat-form-field appearance="outline" class="fw"><mat-label>Mật khẩu</mat-label><input matInput [type]="hp()?'password':'text'" formControlName="password"/><mat-icon matPrefix>lock</mat-icon><button mat-icon-button matSuffix type="button" (click)="hp.set(!hp())"><mat-icon>{{hp()?'visibility_off':'visibility'}}</mat-icon></button></mat-form-field>
    <div class="lo"><mat-checkbox formControlName="rememberMe" color="primary">Ghi nhớ</mat-checkbox><a routerLink="/register" class="fl">Quên mật khẩu?</a></div>
    <button mat-flat-button color="primary" type="submit" class="fw sb" [disabled]="ld()"><mat-spinner *ngIf="ld()" diameter="20"></mat-spinner><span *ngIf="!ld()">Đăng nhập</span></button>
    <div *ngIf="err()" class="em"><mat-icon>error</mat-icon>{{err()}}</div>
    <mat-divider></mat-divider><p class="rl">Chưa có tài khoản? <a routerLink="/register">Đăng ký ngay</a></p>
  </form>
</mat-card></div></div>`,
styles:[`
.lp{display:flex;min-height:100vh}
.ll{flex:1;background-size:cover;background-position:center;display:none}
.llo{position:absolute;inset:0;background:linear-gradient(135deg,rgba(21,101,192,.92),rgba(46,125,50,.88));display:flex;flex-direction:column;justify-content:center;align-items:center;padding:40px;color:#fff;text-align:center;position:relative;
  .llg{height:72px;margin-bottom:12px}h2{font-size:28px;font-weight:700;margin-bottom:4px}p{opacity:.9;font-size:15px}}
.da{margin-top:36px;text-align:left;background:rgba(255,255,255,.1);border-radius:14px;padding:20px;width:100%;max-width:300px;
  h4{margin-bottom:12px;font-size:14px;small{opacity:.7;font-weight:400}}
  .di{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:6px;cursor:pointer;transition:.2s;font-size:13px;&:hover{background:rgba(255,255,255,.15)}mat-icon{font-size:18px;width:18px;height:18px}}}
.lr{flex:1;display:flex;align-items:center;justify-content:center;padding:24px;background:#f8fafc}
.lc{max-width:440px;width:100%;padding:36px 28px;border-radius:18px!important;
  h2{font-size:26px;font-weight:700;margin-bottom:4px}.ls{color:#666;font-size:14px;margin-bottom:24px}}
.fw{width:100%}.lo{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.fl{color:#1565c0;text-decoration:none;font-size:13px}
.sb{height:46px;font-size:15px;border-radius:10px!important;margin-bottom:16px}
.em{display:flex;align-items:center;gap:6px;color:#d32f2f;font-size:13px;margin:10px 0;padding:10px;background:#ffebee;border-radius:8px;mat-icon{font-size:18px;width:18px;height:18px}}
mat-divider{margin:20px 0!important}.rl{text-align:center;font-size:13px;color:#666;a{color:#1565c0;font-weight:600;text-decoration:none}}
@media(min-width:960px){.ll{display:block}}
`]})
export class LoginComponent{
  private fb=inject(FormBuilder);private auth=inject(AuthService);private router=inject(Router);private route=inject(ActivatedRoute);private sb=inject(MatSnackBar);
  f=this.fb.group({username:['',Validators.required],password:['',Validators.required],rememberMe:[false]});
  hp=signal(true);ld=signal(false);err=signal('');
  accs=[{lb:'Khách hàng',un:'customer@demo.com',ic:'person'},{lb:'Đại lý',un:'agent@demo.com',ic:'support_agent'},{lb:'Quản trị',un:'admin@demo.com',ic:'admin_panel_settings'},{lb:'Underwriter',un:'underwriter@demo.com',ic:'assignment_ind'},{lb:'Claims',un:'claims@demo.com',ic:'assignment'},{lb:'Đối tác',un:'partner@demo.com',ic:'handshake'},{lb:'Sales',un:'sales@demo.com',ic:'storefront'},{lb:'CSKH',un:'cs@demo.com',ic:'headset_mic'},{lb:'Kế toán',un:'accountant@demo.com',ic:'calculate'},{lb:'Chi nhánh',un:'branch@demo.com',ic:'business'},{lb:'Vùng',un:'regional@demo.com',ic:'map'},{lb:'SP Manager',un:'pm@demo.com',ic:'inventory'},{lb:'Compliance',un:'compliance@demo.com',ic:'gavel'}];
  fill(a:any){this.f.patchValue({username:a.un,password:'Demo@123'});}
  go(){if(this.f.invalid)return;this.ld.set(true);this.err.set('');
    this.auth.login(this.f.value).subscribe({next:(r:any)=>{this.ld.set(false);this.sb.open('Xin chào '+r.user.firstName+'!','OK',{duration:2000});const u=this.route.snapshot.queryParams['returnUrl']||'/';this.router.navigateByUrl(u);},error:(e:any)=>{this.ld.set(false);this.err.set(e.message);}});}
}
