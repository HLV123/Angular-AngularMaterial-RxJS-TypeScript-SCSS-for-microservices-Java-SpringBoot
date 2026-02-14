import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{Commission}from'../../../core/models';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-agent-commission',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe,StatusViPipe],
template:`<div><section class="ph"><h1>Hoa hồng</h1></section><div class="ctn">
<div class="nav"><a routerLink="/agent" routerLinkActive="act" [routerLinkActiveOptions]="{exact:true}"><mat-icon>dashboard</mat-icon>Dashboard</a>
<a routerLink="/agent/clients" routerLinkActive="act"><mat-icon>people</mat-icon>Khách hàng</a>
<a routerLink="/agent/commission" routerLinkActive="act"><mat-icon>payments</mat-icon>Hoa hồng</a></div>
<div class="sr"><mat-card class="sc"><mat-icon class="si g">check_circle</mat-icon><div><b>{{paid()|vnd}}</b><span>Đã nhận</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si b">schedule</mat-icon><div><b>{{pending()|vnd}}</b><span>Chờ duyệt</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si o">trending_up</mat-icon><div><b>{{total()|vnd}}</b><span>Tổng HH</span></div></mat-card></div>
<mat-card class="rc"><h3>Chi tiết hoa hồng</h3>
<div *ngFor="let c of cms()" class="ci">
<div class="cr"><div class="ct" [class]="c.type.toLowerCase()">{{c.type|statusVi}}</div><div class="cinfo"><b>{{c.customerName}}</b><span>{{c.policyNumber}}</span><span>{{c.productName}} · {{c.period}}</span></div></div>
<div class="ca"><div class="cv"><b>{{c.amount|vnd}}</b><span>{{c.rate}}% × {{c.premium|vnd}}</span></div>
<span class="cs" [class]="c.status.toLowerCase()">{{c.status|statusVi}}</span></div></div></mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:40px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:1000px;margin:0 auto;padding:24px}
.nav{display:flex;gap:6px;margin-bottom:20px;a{display:flex;align-items:center;gap:6px;padding:8px 16px;text-decoration:none;color:#666;border-radius:8px;font-size:13px;background:#f5f5f5;&.act{background:#1565c0;color:#fff}mat-icon{font-size:18px;width:18px;height:18px}}}
.sr{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
.sc{display:flex;align-items:center;gap:12px;padding:18px!important;border-radius:10px!important;.si{font-size:26px;width:26px;height:26px;&.g{color:#4CAF50}&.b{color:#2196F3}&.o{color:#FF9800}}b{font-size:18px;display:block}span{font-size:11px;color:#888}}
.rc{padding:20px!important;border-radius:14px!important;h3{font-size:15px;font-weight:600;margin-bottom:14px;color:#1565c0}}
.ci{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid #f5f5f5}
.cr{display:flex;align-items:center;gap:12px}.ct{padding:2px 8px;border-radius:8px;font-size:10px;font-weight:600;&.first_year{background:#e3f2fd;color:#1565c0}&.renewal{background:#e8f5e9;color:#2e7d32}&.bonus{background:#fff3e0;color:#e65100}}
.cinfo{b{display:block;font-size:13px}span{display:block;font-size:11px;color:#888}}
.ca{text-align:right;.cv{b{font-size:16px;color:#1565c0;display:block}span{font-size:11px;color:#888;display:block}}.cs{padding:2px 10px;border-radius:12px;font-size:10px;font-weight:600;&.paid{background:#e8f5e9;color:#2e7d32}&.approved{background:#e3f2fd;color:#1565c0}&.pending{background:#fff3e0;color:#e65100}}}`]})
export class AgentCommissionComponent implements OnInit{
  private api=inject(ApiService);cms=signal<Commission[]>([]);paid=signal(0);pending=signal(0);total=signal(0);
  ngOnInit(){this.api.getCommissions('A01').subscribe(c=>{this.cms.set(c);this.paid.set(c.filter(x=>x.status==='PAID').reduce((s,x)=>s+x.amount,0));this.pending.set(c.filter(x=>x.status!=='PAID').reduce((s,x)=>s+x.amount,0));this.total.set(c.reduce((s,x)=>s+x.amount,0));});}
}