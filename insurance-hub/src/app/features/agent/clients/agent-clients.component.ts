import{Component}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';
@Component({selector:'app-agent-clients',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule],
template:`<div><section class="ph"><h1>Khách hàng của tôi</h1></section><div class="ctn">
<div class="nav"><a routerLink="/agent" routerLinkActive="act" [routerLinkActiveOptions]="{exact:true}"><mat-icon>dashboard</mat-icon>Dashboard</a>
<a routerLink="/agent/clients" routerLinkActive="act"><mat-icon>people</mat-icon>Khách hàng</a>
<a routerLink="/agent/commission" routerLinkActive="act"><mat-icon>payments</mat-icon>Hoa hồng</a></div>
<div class="cg"><mat-card *ngFor="let c of clients" class="cc" appearance="outlined">
<div class="cr"><mat-icon class="av">account_circle</mat-icon><div><h3>{{c.name}}</h3><p>{{c.phone}} · {{c.email}}</p></div></div>
<div class="cd"><div><span>Hợp đồng</span><b>{{c.policies}}</b></div><div><span>Phí/năm</span><b>{{c.premium}}</b></div><div><span>Claims</span><b>{{c.claims}}</b></div></div>
</mat-card></div></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:40px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:1200px;margin:0 auto;padding:24px}
.nav{display:flex;gap:6px;margin-bottom:20px;a{display:flex;align-items:center;gap:6px;padding:8px 16px;text-decoration:none;color:#666;border-radius:8px;font-size:13px;background:#f5f5f5;&.act{background:#1565c0;color:#fff}mat-icon{font-size:18px;width:18px;height:18px}}}
.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}
.cc{border-radius:12px!important;padding:18px!important}.cr{display:flex;align-items:center;gap:12px;margin-bottom:12px;.av{font-size:40px;width:40px;height:40px;color:#1565c0}h3{font-size:15px;font-weight:600;margin:0}p{font-size:12px;color:#888;margin:0}}
.cd{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-top:10px;border-top:1px solid #f0f0f0;text-align:center;span{font-size:11px;color:#888;display:block}b{font-size:14px}}`]})
export class AgentClientsComponent{
  clients=[
    {name:'Nguyễn Văn An',phone:'0901234567',email:'an.nv@email.com',policies:6,premium:'46.8 triệu',claims:4},
    {name:'Trần Văn Bé',phone:'0912345000',email:'be.tv@email.com',policies:2,premium:'34 triệu',claims:1},
    {name:'Lê Thị Hoa',phone:'0923456000',email:'hoa.lt@email.com',policies:3,premium:'20 triệu',claims:0},
    {name:'Phạm Duy Khánh',phone:'0934567000',email:'khanh.pd@email.com',policies:1,premium:'15 triệu',claims:0},
    {name:'Võ Thị Cẩm Tú',phone:'0945678000',email:'tu.vtc@email.com',policies:2,premium:'18 triệu',claims:2},
    {name:'Huỳnh Minh Quân',phone:'0956789000',email:'quan.hm@email.com',policies:1,premium:'8 triệu',claims:0}
  ];
}