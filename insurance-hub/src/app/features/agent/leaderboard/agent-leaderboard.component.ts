import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-agent-leaderboard',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatIconModule,VndPipe,StatusViPipe],
template:`<div><section class="ph"><h1>Bảng xếp hạng Đại lý</h1></section><div class="ctn">
<div class="nav"><a routerLink="/agent"><mat-icon>dashboard</mat-icon>Dashboard</a><a routerLink="/agent/clients"><mat-icon>people</mat-icon>Khách hàng</a>
<a routerLink="/agent/leads"><mat-icon>person_search</mat-icon>Leads</a><a routerLink="/agent/commission"><mat-icon>payments</mat-icon>Hoa hồng</a>
<a routerLink="/agent/leaderboard" class="act"><mat-icon>leaderboard</mat-icon>Bảng xếp hạng</a></div>
<mat-card class="lc"><div *ngFor="let a of agents();let i=index" class="li" [class.top]="i<3">
<div class="lr" [class]="'r'+i"><span>{{i+1}}</span></div>
<mat-icon class="av">account_circle</mat-icon>
<div class="linfo"><h3>{{a.fullName}}</h3><p>{{a.agentCode}} · {{a.level|statusVi}} · {{a.branchName}}</p></div>
<div class="ls"><div><span>HĐ</span><b>{{a.totalPolicies}}</b></div><div><span>KH</span><b>{{a.clients}}</b></div><div><span>Phí BH</span><b>{{a.totalPremium|vnd}}</b></div>
<div><span>Mục tiêu</span><b>{{(a.monthlyAchieved/a.monthlyTarget*100).toFixed(0)}}%</b></div></div>
<div class="lb"><div class="lbf" [style.width.%]="a.monthlyAchieved/a.monthlyTarget*100"></div></div>
</div></mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:40px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:1100px;margin:0 auto;padding:24px}
.nav{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap;a{display:flex;align-items:center;gap:6px;padding:8px 16px;text-decoration:none;color:#666;border-radius:8px;font-size:13px;background:#f5f5f5;&:hover{background:#e3f2fd}&.act{background:#1565c0;color:#fff}mat-icon{font-size:18px;width:18px;height:18px}}}
.lc{padding:20px!important;border-radius:14px!important}
.li{display:flex;align-items:center;gap:14px;padding:18px 0;border-bottom:1px solid #f5f5f5;&.top{background:#f8faff;margin:0 -20px;padding:18px 20px;border-radius:8px}}
.lr{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0;
&.r0{background:#ffd54f;color:#795548}&.r1{background:#e0e0e0;color:#555}&.r2{background:#ffcc80;color:#795548}}
.lr:not(.r0):not(.r1):not(.r2){background:#f5f5f5;color:#888}
.av{font-size:36px;width:36px;height:36px;color:#1565c0;flex-shrink:0}
.linfo{flex:1;min-width:0;h3{font-size:14px;font-weight:600;margin:0}p{font-size:11px;color:#888;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.ls{display:flex;gap:16px;div{text-align:center;span{font-size:10px;color:#888;display:block}b{font-size:13px}}}
.lb{width:100px;height:8px;background:#e0e0e0;border-radius:4px;overflow:hidden;flex-shrink:0;.lbf{height:100%;background:linear-gradient(90deg,#1565c0,#42a5f5);border-radius:4px}}
@media(max-width:768px){.ls{display:none}.lb{display:none}}`]})
export class AgentLeaderboardComponent implements OnInit{
  private api=inject(ApiService);agents=signal<any[]>([]);
  ngOnInit(){this.api.getAgents().subscribe(a=>{this.agents.set(a.sort((x:any,y:any)=>y.totalPremium-x.totalPremium));});}
}