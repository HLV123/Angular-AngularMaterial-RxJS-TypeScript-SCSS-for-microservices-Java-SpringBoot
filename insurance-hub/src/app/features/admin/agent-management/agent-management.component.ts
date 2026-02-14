import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-agent-management',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe,StatusViPipe],
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
<a routerLink="/admin/config" routerLinkActive="act"><mat-icon>settings</mat-icon>Cài đặt</a></nav></div><div class="am"><h2>Quản lý đại lý</h2><div class="pg"><mat-card *ngFor="let a of data()" class="ac" appearance="outlined">
<div class="ar"><mat-icon class="av">account_circle</mat-icon><div><h3>{{a.fullName}}</h3><p>{{a.agentCode}} · {{a.level|statusVi}} · {{a.branchName}}</p></div></div>
<div class="ad"><div><span>HĐ</span><b>{{a.totalPolicies}}</b></div><div><span>KH</span><b>{{a.clients}}</b></div><div><span>Phí</span><b>{{a.totalPremium|vnd}}</b></div><div><span>HH</span><b>{{a.totalCommission|vnd}}</b></div></div>
<div class="ap"><div class="apb"><div class="apf" [style.width.%]="a.monthlyAchieved/a.monthlyTarget*100"></div></div><span class="aps">{{(a.monthlyAchieved/a.monthlyTarget*100).toFixed(0)}}% mục tiêu</span></div>
</mat-card></div>
<style>.pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:14px}.ac{border-radius:12px!important;padding:18px!important}.ar{display:flex;align-items:center;gap:12px;margin-bottom:12px;.av{font-size:40px;width:40px;height:40px;color:#1565c0}h3{font-size:14px;font-weight:600;margin:0}p{font-size:12px;color:#888;margin:0}}.ad{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px 0;border-top:1px solid #f0f0f0;text-align:center;span{font-size:10px;color:#888;display:block}b{font-size:12px}}.ap{margin-top:8px}.apb{height:8px;background:#e0e0e0;border-radius:4px;overflow:hidden}.apf{height:100%;background:linear-gradient(90deg,#1565c0,#42a5f5);border-radius:4px}.aps{font-size:11px;color:#888}</style></div></div>`,
styles:[`.al{display:flex;min-height:calc(100vh - 64px)}
.as{width:240px;background:#1a2332;color:#b0bec5;flex-shrink:0;padding:16px 0}
.sh{display:flex;align-items:center;gap:8px;padding:0 16px 16px;border-bottom:1px solid #2c3e50;.sl{height:28px}span{color:#fff;font-weight:700;font-size:15px}}
nav{padding:8px 0;a{display:flex;align-items:center;gap:10px;padding:10px 16px;color:#b0bec5;text-decoration:none;font-size:13px;transition:.2s;mat-icon{font-size:18px;width:18px;height:18px}&:hover{background:rgba(255,255,255,.05);color:#fff}&.act{background:rgba(21,101,192,.3);color:#42a5f5;border-left:3px solid #42a5f5}}}
.am{flex:1;padding:24px;background:#f5f7fa;overflow-y:auto;h2{font-size:24px;font-weight:700;margin-bottom:20px;color:#1a2332}}
@media(max-width:768px){.as{display:none}}`]})
export class AgentmanagementComponent implements OnInit{
  private api=inject(ApiService);data=signal<any[]>([]);
  ngOnInit(){this.api.getAgents().subscribe(a=>this.data.set(a));}
}