import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatMenuModule}from'@angular/material/menu';import{ApiService}from'../../../core/services/api.service';import{AuthService}from'../../../core/services/auth.service';import{Policy,PolicyStatus}from'../../../core/models';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-policy-list',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,MatMenuModule,VndPipe,StatusViPipe],
template:`<div><section class="ph"><h1>Hợp đồng bảo hiểm</h1><p>Quản lý tất cả hợp đồng của bạn</p></section><div class="ctn">
<div class="sr"><mat-card class="sc"><mat-icon class="si g">check_circle</mat-icon><div><b>{{act().length}}</b><span>Hiệu lực</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si b">description</mat-icon><div><b>{{ps().length}}</b><span>Tổng HĐ</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si o">payment</mat-icon><div><b>{{tp()|vnd}}</b><span>Phí/năm</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si r">event</mat-icon><div><b>{{ren().length}}</b><span>Sắp gia hạn</span></div></mat-card></div>
<mat-card *ngFor="let p of ps()" class="pc" appearance="outlined">
<div class="pch"><div class="pi" [style.background]="cb(p.productCategory)"><mat-icon>{{ci(p.productCategory)}}</mat-icon></div>
<div class="pinf"><h3>{{p.productName}}</h3><p>{{p.policyNumber}} · {{p.planName}}</p></div>
<span class="sb" [class]="p.status.toLowerCase()">{{p.status|statusVi}}</span></div>
<div class="pb"><div><span>Quyền lợi</span><b>{{p.sumInsured|vnd}}</b></div><div><span>Phí BH</span><b>{{p.premium|vnd}}/năm</b></div>
<div><span>Hiệu lực</span><b>{{p.startDate}} - {{p.endDate}}</b></div><div><span>TT tiếp</span><b>{{p.nextPaymentDate||'N/A'}}</b></div></div>
<div class="pa"><a mat-button color="primary" [routerLink]="['/policies',p.id]"><mat-icon>visibility</mat-icon>Chi tiết</a>
<button mat-button [matMenuTriggerFor]="am"><mat-icon>more_vert</mat-icon>Thao tác</button>
<mat-menu #am="matMenu"><button mat-menu-item><mat-icon>autorenew</mat-icon>Gia hạn</button><button mat-menu-item><mat-icon>edit</mat-icon>Thay đổi</button>
<button mat-menu-item routerLink="/claims/submit"><mat-icon>assignment</mat-icon>Nộp bồi thường</button><button mat-menu-item><mat-icon>download</mat-icon>Tải HĐ</button></mat-menu></div>
</mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:30px;font-weight:700}p{opacity:.9}}
.ctn{max-width:1200px;margin:0 auto;padding:28px 24px}
.sr{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.sc{display:flex;align-items:center;gap:14px;padding:18px!important;border-radius:10px!important;.si{font-size:28px;width:28px;height:28px;&.g{color:#4CAF50}&.b{color:#2196F3}&.o{color:#FF9800}&.r{color:#F44336}}b{font-size:20px;display:block}span{font-size:12px;color:#888}}
.pc{border-radius:14px!important;padding:20px!important;margin-bottom:14px}
.pch{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.pi{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;mat-icon{color:#fff}}
.pinf{flex:1;h3{font-size:15px;font-weight:600;margin:0}p{font-size:12px;color:#888;margin:2px 0 0}}
.sb{padding:3px 12px;border-radius:16px;font-size:11px;font-weight:600;&.active{background:#e8f5e9;color:#2e7d32}&.expired{background:#f5f5f5;color:#757575}&.cancelled{background:#ffebee;color:#c62828}&.lapsed{background:#fff3e0;color:#e65100}&.pending_payment{background:#e3f2fd;color:#1565c0}}
.pb{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:14px 0;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;div{span{font-size:11px;color:#888;display:block}b{font-size:13px}}}
.pa{display:flex;gap:6px;margin-top:12px}
@media(max-width:960px){.sr{grid-template-columns:repeat(2,1fr)}.pb{grid-template-columns:repeat(2,1fr)}}`]})
export class PolicyListComponent implements OnInit{
  private api=inject(ApiService);private auth=inject(AuthService);
  ps=signal<Policy[]>([]);act=signal<Policy[]>([]);ren=signal<Policy[]>([]);tp=signal(0);
  ngOnInit(){this.api.getPolicies(this.auth.user()?.id).subscribe(p=>{this.ps.set(p);this.act.set(p.filter(x=>x.status===PolicyStatus.ACTIVE));this.ren.set(p.filter(x=>!!x.renewalDate));this.tp.set(p.filter(x=>x.status===PolicyStatus.ACTIVE).reduce((s,x)=>s+x.premium,0));});}
  ci(c:string){const m:any={HEALTH:'local_hospital',LIFE:'favorite',MOTOR:'directions_car',PROPERTY:'home',TRAVEL:'flight',ACCIDENT:'health_and_safety'};return m[c]||'description';}
  cb(c:string){const m:any={HEALTH:'#4CAF50',LIFE:'#2196F3',MOTOR:'#FF9800',PROPERTY:'#9C27B0',TRAVEL:'#00BCD4',ACCIDENT:'#F44336'};return m[c]||'#1976d2';}
}