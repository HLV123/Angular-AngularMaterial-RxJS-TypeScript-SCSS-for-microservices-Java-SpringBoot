import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';
@Component({selector:'app-agent-leads',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule],
template:`<div><section class="ph"><h1>Quản lý Lead</h1></section><div class="ctn">
<div class="nav"><a routerLink="/agent"><mat-icon>dashboard</mat-icon>Dashboard</a><a routerLink="/agent/clients"><mat-icon>people</mat-icon>Khách hàng</a>
<a routerLink="/agent/leads" class="act"><mat-icon>person_search</mat-icon>Leads</a><a routerLink="/agent/commission"><mat-icon>payments</mat-icon>Hoa hồng</a>
<a routerLink="/agent/leaderboard"><mat-icon>leaderboard</mat-icon>Bảng xếp hạng</a></div>
<div class="sr"><mat-card class="sc"><mat-icon class="si b">person_add</mat-icon><div><b>{{ls().length}}</b><span>Tổng leads</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si g">check</mat-icon><div><b>{{won()}}</b><span>Won</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si o">trending_up</mat-icon><div><b>{{conv()}}%</b><span>Conversion</span></div></mat-card></div>
<mat-card *ngFor="let l of ls()" class="lc" appearance="outlined">
<div class="lr"><div class="ll" [class]="l.status.toLowerCase()"><mat-icon>{{li(l.status)}}</mat-icon></div>
<div class="linfo"><h3>{{l.firstName}} {{l.lastName}}</h3><p>{{l.phone}} · {{l.email}}</p></div>
<div class="lsc"><div class="lsb" [style.width.%]="l.score"><div class="lsf"></div></div><span>Score: {{l.score}}</span></div>
<span class="lst" [class]="l.status.toLowerCase()">{{stl(l.status)}}</span></div>
<div class="ld"><span><mat-icon>source</mat-icon>{{l.source}}</span>
<span><mat-icon>inventory</mat-icon>{{l.interestedProducts.join(', ')}}</span>
<span><mat-icon>event</mat-icon>{{l.createdAt}}</span></div>
<p class="ln"><mat-icon>notes</mat-icon>{{l.notes}}</p>
<div class="la" *ngIf="l.status!=='WON'&&l.status!=='LOST'">
<button mat-button color="primary"><mat-icon>phone</mat-icon>Gọi</button>
<button mat-button><mat-icon>email</mat-icon>Email</button>
<button mat-flat-button color="primary"><mat-icon>assignment</mat-icon>Tạo báo giá</button></div>
</mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:40px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:1100px;margin:0 auto;padding:24px}
.nav{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap;a{display:flex;align-items:center;gap:6px;padding:8px 16px;text-decoration:none;color:#666;border-radius:8px;font-size:13px;background:#f5f5f5;&:hover{background:#e3f2fd}&.act{background:#1565c0;color:#fff}mat-icon{font-size:18px;width:18px;height:18px}}}
.sr{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
.sc{display:flex;align-items:center;gap:12px;padding:16px!important;border-radius:10px!important;.si{font-size:24px;width:24px;height:24px;&.b{color:#2196F3}&.g{color:#4CAF50}&.o{color:#FF9800}}b{font-size:18px;display:block}span{font-size:11px;color:#888}}
.lc{border-radius:12px!important;padding:18px!important;margin-bottom:12px}
.lr{display:flex;align-items:center;gap:14px;margin-bottom:10px}
.ll{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;mat-icon{color:#fff;font-size:18px;width:18px;height:18px}
&.new{background:#2196F3}&.contacted{background:#FF9800}&.qualified{background:#9C27B0}&.proposal_sent{background:#1565c0}&.won{background:#4CAF50}&.lost{background:#9E9E9E}}
.linfo{flex:1;h3{font-size:14px;font-weight:600;margin:0}p{font-size:11px;color:#888;margin:0}}
.lsc{width:80px;margin-right:8px;.lsb{height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden}.lsf{height:100%;background:linear-gradient(90deg,#1565c0,#42a5f5);border-radius:3px}span{font-size:10px;color:#888}}
.lst{padding:3px 10px;border-radius:14px;font-size:10px;font-weight:600;&.new{background:#e3f2fd;color:#1565c0}&.contacted{background:#fff3e0;color:#e65100}&.qualified{background:#ede7f6;color:#4527a0}&.proposal_sent{background:#e8eaf6;color:#1565c0}&.won{background:#e8f5e9;color:#2e7d32}&.lost{background:#f5f5f5;color:#757575}}
.ld{display:flex;gap:16px;font-size:12px;color:#888;flex-wrap:wrap;span{display:flex;align-items:center;gap:3px;mat-icon{font-size:14px;width:14px;height:14px}}}
.ln{font-size:12px;color:#666;margin:6px 0 0;display:flex;align-items:flex-start;gap:4px;mat-icon{font-size:14px;width:14px;height:14px;color:#aaa;flex-shrink:0;margin-top:1px}}
.la{display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #f0f0f0}`]})
export class AgentLeadsComponent implements OnInit{
  private api=inject(ApiService);ls=signal<any[]>([]);won=signal(0);conv=signal(0);
  ngOnInit(){this.api.getLeads().subscribe(l=>{this.ls.set(l);this.won.set(l.filter((x:any)=>x.status==='WON').length);const t=l.length;this.conv.set(t?Math.round(this.won()/t*100):0);});}
  li(s:string){const m:any={NEW:'fiber_new',CONTACTED:'phone',QUALIFIED:'star',PROPOSAL_SENT:'send',WON:'check_circle',LOST:'cancel'};return m[s]||'person';}
  stl(s:string){const m:any={NEW:'Mới',CONTACTED:'Đã liên hệ',QUALIFIED:'Tiềm năng',PROPOSAL_SENT:'Đã gửi BG',WON:'Đã chốt',LOST:'Mất'};return m[s]||s;}
}