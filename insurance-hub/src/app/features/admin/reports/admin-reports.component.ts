import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-admin-reports',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe,StatusViPipe],
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
<a routerLink="/admin/config" routerLinkActive="act"><mat-icon>settings</mat-icon>Cài đặt</a></nav></div><div class="am"><h2>Báo cáo</h2><div class="rg"><mat-card *ngFor="let r of reports" class="rc" appearance="outlined">
<div class="ri"><mat-icon [style.color]="r.color">{{r.icon}}</mat-icon></div>
<h3>{{r.name}}</h3><p>{{r.desc}}</p><button mat-stroked-button color="primary"><mat-icon>download</mat-icon>Xuất báo cáo</button>
</mat-card></div>
<style>.rg{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}.rc{padding:24px!important;border-radius:12px!important;text-align:center;.ri{width:56px;height:56px;border-radius:14px;background:#e3f2fd;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;mat-icon{font-size:28px;width:28px;height:28px}}h3{font-size:15px;font-weight:600;margin-bottom:6px}p{font-size:13px;color:#666;margin-bottom:14px}}</style></div></div>`,
styles:[`.al{display:flex;min-height:calc(100vh - 64px)}
.as{width:240px;background:#1a2332;color:#b0bec5;flex-shrink:0;padding:16px 0}
.sh{display:flex;align-items:center;gap:8px;padding:0 16px 16px;border-bottom:1px solid #2c3e50;.sl{height:28px}span{color:#fff;font-weight:700;font-size:15px}}
nav{padding:8px 0;a{display:flex;align-items:center;gap:10px;padding:10px 16px;color:#b0bec5;text-decoration:none;font-size:13px;transition:.2s;mat-icon{font-size:18px;width:18px;height:18px}&:hover{background:rgba(255,255,255,.05);color:#fff}&.act{background:rgba(21,101,192,.3);color:#42a5f5;border-left:3px solid #42a5f5}}}
.am{flex:1;padding:24px;background:#f5f7fa;overflow-y:auto;h2{font-size:24px;font-weight:700;margin-bottom:20px;color:#1a2332}}
@media(max-width:768px){.as{display:none}}`]})
export class AdminreportsComponent implements OnInit{
  private api=inject(ApiService);data=signal<any[]>([]);
  reports=[{name:'Doanh thu phí BH',desc:'Báo cáo phí theo tháng/quý/năm',icon:'trending_up',color:'#4CAF50'},{name:'Tỷ lệ bồi thường',desc:'Loss ratio theo sản phẩm',icon:'assessment',color:'#FF9800'},{name:'Hiệu quả đại lý',desc:'KPI và hoa hồng đại lý',icon:'support_agent',color:'#2196F3'},{name:'Khách hàng mới',desc:'Tăng trưởng khách hàng',icon:'person_add',color:'#9C27B0'},{name:'Sản phẩm bán chạy',desc:'Top sản phẩm theo doanh số',icon:'star',color:'#F44336'},{name:'Thanh toán',desc:'Tổng hợp giao dịch',icon:'payment',color:'#009688'}];
ngOnInit(){}
}