import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-product-management',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe,StatusViPipe],
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
<a routerLink="/admin/config" routerLinkActive="act"><mat-icon>settings</mat-icon>Cài đặt</a></nav></div><div class="am"><h2>Quản lý sản phẩm</h2><div class="pg"><mat-card *ngFor="let p of data()" class="pc" appearance="outlined">
<div class="pr"><img [src]="p.image" class="pi"/><div class="pinfo"><h3>{{p.name}}</h3><p>{{p.code}} · {{p.category|statusVi}}</p><span>{{p.plans.length}} gói · ★{{p.rating}}</span></div>
<div class="pa"><b>{{p.minPremium|vnd}}</b><small>min/năm</small><button mat-icon-button><mat-icon>edit</mat-icon></button></div></div></mat-card></div>
<style>.pg{display:grid;gap:12px}.pc{border-radius:12px!important;padding:16px!important}.pr{display:flex;align-items:center;gap:14px}.pi{width:60px;height:60px;border-radius:8px;object-fit:cover}.pinfo{flex:1;h3{font-size:14px;font-weight:600;margin:0}p{font-size:12px;color:#888;margin:2px 0}span{font-size:11px;color:#aaa}}.pa{text-align:right;b{display:block;font-size:14px;color:#1565c0}small{font-size:11px;color:#888;display:block}}</style></div></div>`,
styles:[`.al{display:flex;min-height:calc(100vh - 64px)}
.as{width:240px;background:#1a2332;color:#b0bec5;flex-shrink:0;padding:16px 0}
.sh{display:flex;align-items:center;gap:8px;padding:0 16px 16px;border-bottom:1px solid #2c3e50;.sl{height:28px}span{color:#fff;font-weight:700;font-size:15px}}
nav{padding:8px 0;a{display:flex;align-items:center;gap:10px;padding:10px 16px;color:#b0bec5;text-decoration:none;font-size:13px;transition:.2s;mat-icon{font-size:18px;width:18px;height:18px}&:hover{background:rgba(255,255,255,.05);color:#fff}&.act{background:rgba(21,101,192,.3);color:#42a5f5;border-left:3px solid #42a5f5}}}
.am{flex:1;padding:24px;background:#f5f7fa;overflow-y:auto;h2{font-size:24px;font-weight:700;margin-bottom:20px;color:#1a2332}}
@media(max-width:768px){.as{display:none}}`]})
export class ProductmanagementComponent implements OnInit{
  private api=inject(ApiService);data=signal<any[]>([]);
  ngOnInit(){this.api.getProducts().subscribe(p=>this.data.set(p));}
}