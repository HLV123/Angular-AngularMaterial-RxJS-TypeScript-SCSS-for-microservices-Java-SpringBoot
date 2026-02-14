import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-system-config',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe,StatusViPipe],
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
<a routerLink="/admin/config" routerLinkActive="act"><mat-icon>settings</mat-icon>Cài đặt</a></nav></div><div class="am"><h2>Cài đặt hệ thống</h2><div class="sg"><mat-card *ngFor="let s of settings" class="sc2" appearance="outlined">
<div class="sr2"><mat-icon [style.color]="s.color">{{s.icon}}</mat-icon><div><h3>{{s.name}}</h3><p>{{s.desc}}</p></div>
<span class="ss" [class]="s.status">{{s.statusLabel}}</span></div></mat-card></div>
<style>.sg{display:grid;gap:12px}.sc2{padding:18px!important;border-radius:12px!important}.sr2{display:flex;align-items:center;gap:14px;mat-icon{font-size:28px;width:28px;height:28px}h3{font-size:14px;font-weight:600;margin:0}p{font-size:12px;color:#888;margin:0}}.ss{padding:3px 12px;border-radius:12px;font-size:11px;font-weight:600;&.ok{background:#e8f5e9;color:#2e7d32}&.warn{background:#fff3e0;color:#e65100}&.off{background:#f5f5f5;color:#757575}}</style></div></div>`,
styles:[`.al{display:flex;min-height:calc(100vh - 64px)}
.as{width:240px;background:#1a2332;color:#b0bec5;flex-shrink:0;padding:16px 0}
.sh{display:flex;align-items:center;gap:8px;padding:0 16px 16px;border-bottom:1px solid #2c3e50;.sl{height:28px}span{color:#fff;font-weight:700;font-size:15px}}
nav{padding:8px 0;a{display:flex;align-items:center;gap:10px;padding:10px 16px;color:#b0bec5;text-decoration:none;font-size:13px;transition:.2s;mat-icon{font-size:18px;width:18px;height:18px}&:hover{background:rgba(255,255,255,.05);color:#fff}&.act{background:rgba(21,101,192,.3);color:#42a5f5;border-left:3px solid #42a5f5}}}
.am{flex:1;padding:24px;background:#f5f7fa;overflow-y:auto;h2{font-size:24px;font-weight:700;margin-bottom:20px;color:#1a2332}}
@media(max-width:768px){.as{display:none}}`]})
export class SystemconfigComponent implements OnInit{
  private api=inject(ApiService);data=signal<any[]>([]);
  settings=[{name:'Email Service',desc:'SMTP notification system',icon:'email',color:'#4CAF50',status:'ok',statusLabel:'Hoạt động'},{name:'Kafka Cluster',desc:'Message queue & event streaming',icon:'flash_on',color:'#FF9800',status:'ok',statusLabel:'3 brokers'},{name:'Redis Cache',desc:'Session & data caching',icon:'memory',color:'#F44336',status:'ok',statusLabel:'Hit rate 94%'},{name:'Keycloak SSO',desc:'Authentication & authorization',icon:'security',color:'#2196F3',status:'ok',statusLabel:'v22.0'},{name:'PostgreSQL',desc:'Primary database cluster',icon:'storage',color:'#9C27B0',status:'ok',statusLabel:'Master-Slave'},{name:'Prometheus/Grafana',desc:'Monitoring & alerting',icon:'monitor_heart',color:'#009688',status:'ok',statusLabel:'24/7'},{name:'ELK Stack',desc:'Logging & search analytics',icon:'manage_search',color:'#795548',status:'ok',statusLabel:'7 ngày retention'},{name:'VNPay Gateway',desc:'Payment processing',icon:'payment',color:'#1565c0',status:'ok',statusLabel:'Connected'},{name:'Momo Gateway',desc:'E-wallet payment',icon:'account_balance_wallet',color:'#a50064',status:'ok',statusLabel:'Connected'},{name:'SMS OTP',desc:'2FA verification',icon:'sms',color:'#FF5722',status:'warn',statusLabel:'Low credits'}];
ngOnInit(){}
}