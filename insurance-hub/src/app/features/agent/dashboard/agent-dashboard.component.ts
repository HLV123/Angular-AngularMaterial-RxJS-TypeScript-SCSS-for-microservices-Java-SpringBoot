import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{AuthService}from'../../../core/services/auth.service';import{Agent,Commission}from'../../../core/models';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-agent-dashboard',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe,StatusViPipe],
template:`<div><section class="ph"><h1>Portal Đại lý</h1><p>Xin chào, {{auth.user()?.firstName}} {{auth.user()?.lastName}}</p></section>
<div class="ctn"><div class="nav"><a routerLink="/agent" routerLinkActive="act" [routerLinkActiveOptions]="{exact:true}"><mat-icon>dashboard</mat-icon>Dashboard</a>
<a routerLink="/agent/clients" routerLinkActive="act"><mat-icon>people</mat-icon>Khách hàng</a>
<a routerLink="/agent/commission" routerLinkActive="act"><mat-icon>payments</mat-icon>Hoa hồng</a></div>
<div *ngIf="ag() as a"><div class="sr">
<mat-card class="sc"><mat-icon class="si b">description</mat-icon><div><b>{{a.totalPolicies}}</b><span>Tổng HĐ</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si g">people</mat-icon><div><b>{{a.clients}}</b><span>Khách hàng</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si p">payment</mat-icon><div><b>{{a.totalPremium|vnd}}</b><span>Tổng phí</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si o">payments</mat-icon><div><b>{{a.totalCommission|vnd}}</b><span>Tổng HH</span></div></mat-card></div>
<div class="rg"><mat-card class="rc"><h3>Tiến độ tháng</h3>
<div class="pb"><div class="pf" [style.width.%]="a.monthlyAchieved/a.monthlyTarget*100"></div></div>
<div class="pv"><span>{{a.monthlyAchieved|vnd}}</span><span>Mục tiêu: {{a.monthlyTarget|vnd}}</span></div>
<p class="pp">Đạt <b>{{(a.monthlyAchieved/a.monthlyTarget*100).toFixed(0)}}%</b> mục tiêu</p></mat-card>
<mat-card class="rc"><h3>Thông tin đại lý</h3>
<div class="di"><span>Mã đại lý</span><b>{{a.agentCode}}</b></div><div class="di"><span>Cấp</span><b>{{a.level|statusVi}}</b></div>
<div class="di"><span>Chi nhánh</span><b>{{a.branchName}}</b></div><div class="di"><span>Ngày gia nhập</span><b>{{a.joinDate}}</b></div></mat-card></div>
<mat-card class="rc" style="margin-top:16px"><h3>Hoa hồng gần đây</h3>
<div *ngFor="let c of cms()" class="ci"><div class="cinfo"><b>{{c.customerName}}</b><span>{{c.policyNumber}} · {{c.productName}}</span></div>
<div class="ca"><b class="hl">{{c.amount|vnd}}</b><span>{{c.rate}}% · {{c.status|statusVi}}</span></div></div>
<a mat-button color="primary" routerLink="/agent/commission">Xem tất cả →</a></mat-card></div></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:40px 24px;text-align:center;h1{font-size:28px;font-weight:700}p{opacity:.9}}
.ctn{max-width:1200px;margin:0 auto;padding:24px}
.nav{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap;a{display:flex;align-items:center;gap:6px;padding:8px 16px;text-decoration:none;color:#666;border-radius:8px;font-size:13px;font-weight:500;background:#f5f5f5;&:hover{background:#e3f2fd}&.act{background:#1565c0;color:#fff}mat-icon{font-size:18px;width:18px;height:18px}}}
.sr{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
.sc{display:flex;align-items:center;gap:12px;padding:18px!important;border-radius:10px!important;.si{font-size:26px;width:26px;height:26px;&.b{color:#2196F3}&.g{color:#4CAF50}&.p{color:#9C27B0}&.o{color:#FF9800}}b{font-size:18px;display:block}span{font-size:11px;color:#888}}
.rg{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.rc{padding:20px!important;border-radius:14px!important;h3{font-size:15px;font-weight:600;margin-bottom:14px;color:#1565c0}}
.pb{height:12px;background:#e0e0e0;border-radius:6px;overflow:hidden;margin:8px 0}.pf{height:100%;background:linear-gradient(90deg,#1565c0,#42a5f5);border-radius:6px;transition:width .5s}
.pv{display:flex;justify-content:space-between;font-size:12px;color:#888}.pp{font-size:13px;margin-top:8px;b{color:#1565c0}}
.di{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f5f5f5;span{color:#888;font-size:12px}b{font-size:13px}}
.ci{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f5f5f5;.cinfo{b{display:block;font-size:13px}span{font-size:11px;color:#888}}.ca{text-align:right;.hl{color:#1565c0;font-size:15px;display:block}span{font-size:11px;color:#888}}}
@media(max-width:960px){.sr{grid-template-columns:repeat(2,1fr)}.rg{grid-template-columns:1fr}}`]})
export class AgentDashboardComponent implements OnInit{
  auth=inject(AuthService);private api=inject(ApiService);ag=signal<Agent|null>(null);cms=signal<Commission[]>([]);
  ngOnInit(){this.api.getAgents().subscribe(a=>{this.ag.set(a[0]);});this.api.getCommissions('A01').subscribe(c=>this.cms.set(c));}
}