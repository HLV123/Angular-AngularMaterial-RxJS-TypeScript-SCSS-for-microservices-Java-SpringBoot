import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{DashboardStats}from'../../../core/models';import{VndPipe}from'../../../shared/pipes';
@Component({selector:'app-admin-dashboard',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe],
template:`<div class="al"><div class="as"><div class="sh"><img src="assets/images/logo.png" class="sl"/><span>Admin</span></div><nav>
<a routerLink="/admin" routerLinkActive="act" [routerLinkActiveOptions]="{exact:true}"><mat-icon>dashboard</mat-icon>Dashboard</a>
<a routerLink="/admin/users" routerLinkActive="act"><mat-icon>people</mat-icon>Người dùng</a>
<a routerLink="/admin/products" routerLinkActive="act"><mat-icon>inventory</mat-icon>Sản phẩm</a>
<a routerLink="/admin/policies" routerLinkActive="act"><mat-icon>description</mat-icon>Hợp đồng</a>
<a routerLink="/admin/claims" routerLinkActive="act"><mat-icon>assignment</mat-icon>Bồi thường</a>
<a routerLink="/admin/agents" routerLinkActive="act"><mat-icon>support_agent</mat-icon>Đại lý</a>
<a routerLink="/admin/partners" routerLinkActive="act"><mat-icon>handshake</mat-icon>Đối tác</a>
<a routerLink="/admin/reports" routerLinkActive="act"><mat-icon>bar_chart</mat-icon>Báo cáo</a>
<a routerLink="/admin/audit" routerLinkActive="act"><mat-icon>history</mat-icon>Audit Log</a>
<a routerLink="/admin/config" routerLinkActive="act"><mat-icon>settings</mat-icon>Cài đặt</a></nav></div><div class="am"><h2>Dashboard tổng quan</h2>
<div *ngIf="s() as st"><div class="kg"><mat-card class="kc bl"><mat-icon>description</mat-icon><div><b>{{st.totalPolicies|number}}</b><span>Tổng HĐ</span></div></mat-card>
<mat-card class="kc gr"><mat-icon>check_circle</mat-icon><div><b>{{st.activePolicies|number}}</b><span>Active</span></div></mat-card>
<mat-card class="kc pu"><mat-icon>payment</mat-icon><div><b>{{st.totalPremium|vnd}}</b><span>Tổng phí</span></div></mat-card>
<mat-card class="kc or"><mat-icon>assignment</mat-icon><div><b>{{st.totalClaims|number}}</b><span>Claims</span></div></mat-card>
<mat-card class="kc re"><mat-icon>hourglass_top</mat-icon><div><b>{{st.pendingClaims}}</b><span>Chờ xử lý</span></div></mat-card>
<mat-card class="kc te"><mat-icon>trending_up</mat-icon><div><b>+{{st.premiumGrowth}}%</b><span>Tăng trưởng</span></div></mat-card></div>
<div class="cg"><mat-card class="cc"><h3>Phí BH theo tháng (tỷ VND)</h3><div class="bc">
<div *ngFor="let d of st.monthlyPremium" class="bi"><div class="bb" [style.height.%]="d.value/170"></div><span class="bl2">{{d.label}}</span></div></div></mat-card>
<mat-card class="cc"><h3>Claims theo loại</h3><div class="dl">
<div *ngFor="let d of st.claimsByCategory" class="di2"><div class="dd" [style.background]="d.color"></div><span>{{d.label}}</span><b>{{d.value|number}}</b></div></div></mat-card>
<mat-card class="cc"><h3>Top Đại lý</h3><div *ngFor="let a of st.topAgents;let i=index" class="ai"><span class="ar">{{i+1}}</span><div class="an">{{a.name}}</div><div class="av2"><b>{{a.premium|number}} tỷ</b><span>{{a.achievement}}%</span></div></div></mat-card>
<mat-card class="cc"><h3>Top Sản phẩm</h3><div *ngFor="let p of st.topProducts" class="pi"><div><b>{{p.name}}</b><span>{{p.policies|number}} HĐ</span></div><b>{{p.premium|number}} tỷ</b></div></mat-card></div>
<mat-card class="ac"><h3>Hoạt động gần đây</h3><div *ngFor="let a of st.recentActivities" class="aci"><div class="aci2" [style.background]="a.color+'20'"><mat-icon [style.color]="a.color">{{a.icon}}</mat-icon></div>
<div class="aci3"><p>{{a.description}}</p><small>{{a.timestamp|date:'dd/MM HH:mm'}}</small></div></div></mat-card></div>
</div></div>`,
styles:[`.al{display:flex;min-height:calc(100vh - 64px)}
.as{width:240px;background:#1a2332;color:#b0bec5;flex-shrink:0;padding:16px 0}
.sh{display:flex;align-items:center;gap:8px;padding:0 16px 16px;border-bottom:1px solid #2c3e50;.sl{height:28px}span{color:#fff;font-weight:700;font-size:15px}}
nav{padding:8px 0;a{display:flex;align-items:center;gap:10px;padding:10px 16px;color:#b0bec5;text-decoration:none;font-size:13px;transition:.2s;mat-icon{font-size:18px;width:18px;height:18px}&:hover{background:rgba(255,255,255,.05);color:#fff}&.act{background:rgba(21,101,192,.3);color:#42a5f5;border-left:3px solid #42a5f5}}}
.am{flex:1;padding:24px;background:#f5f7fa;overflow-y:auto;h2{font-size:24px;font-weight:700;margin-bottom:20px;color:#1a2332}}
@media(max-width:768px){.as{display:none}}
.kg{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px}
.kc{padding:16px!important;border-radius:10px!important;display:flex;align-items:center;gap:10px;border-left:3px solid transparent;mat-icon{font-size:24px;width:24px;height:24px}b{font-size:16px;display:block}span{font-size:11px;color:#888}
&.bl{border-left-color:#2196F3;mat-icon{color:#2196F3}}&.gr{border-left-color:#4CAF50;mat-icon{color:#4CAF50}}&.pu{border-left-color:#9C27B0;mat-icon{color:#9C27B0}}&.or{border-left-color:#FF9800;mat-icon{color:#FF9800}}&.re{border-left-color:#F44336;mat-icon{color:#F44336}}&.te{border-left-color:#009688;mat-icon{color:#009688}}}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px}
.cc{padding:18px!important;border-radius:12px!important;h3{font-size:14px;font-weight:600;margin-bottom:14px;color:#1a2332}}
.bc{display:flex;align-items:flex-end;gap:6px;height:160px;padding-top:16px}
.bi{flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;.bb{width:100%;background:linear-gradient(180deg,#1565c0,#42a5f5);border-radius:3px 3px 0 0;min-height:3px}.bl2{font-size:10px;color:#888;margin-top:4px}}
.dl{.di2{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f5f5f5;.dd{width:10px;height:10px;border-radius:50%}span{flex:1;font-size:13px}b{font-size:13px}}}
.ai{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f5f5f5;.ar{width:22px;height:22px;border-radius:50%;background:#e3f2fd;color:#1565c0;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}.an{flex:1;font-size:13px}.av2{text-align:right;b{display:block;font-size:13px;color:#1565c0}span{font-size:11px;color:#888}}}
.pi{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f5f5f5;div{b{display:block;font-size:13px}span{font-size:11px;color:#888}}b{font-size:13px;color:#1565c0}}
.ac{padding:18px!important;border-radius:12px!important;h3{font-size:14px;font-weight:600;margin-bottom:14px}}
.aci{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #f5f5f5;.aci2{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.aci3{flex:1;p{font-size:13px;margin:0}small{font-size:11px;color:#aaa}}}
@media(max-width:1200px){.kg{grid-template-columns:repeat(3,1fr)}.cg{grid-template-columns:1fr}}`]})
export class AdminDashboardComponent implements OnInit{
  private api=inject(ApiService);s=signal<DashboardStats|null>(null);
  ngOnInit(){this.api.getDashboardStats().subscribe(s=>this.s.set(s));}
}