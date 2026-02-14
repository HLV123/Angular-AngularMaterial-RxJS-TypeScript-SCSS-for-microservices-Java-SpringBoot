import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../core/services/api.service';import{AuthService}from'../../core/services/auth.service';import{Notification}from'../../core/models';
@Component({selector:'app-notifications',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule],
template:`<div><section class="ph"><h1>Thông báo</h1></section><div class="ctn">
<mat-card *ngFor="let n of ns()" class="nc" [class.unread]="!n.read" appearance="outlined">
<div class="nr"><div class="ni" [style.background]="(n.color||'#2196F3')+'20'"><mat-icon [style.color]="n.color||'#2196F3'">{{n.icon||'notifications'}}</mat-icon></div>
<div class="ninf"><h3>{{n.title}}</h3><p>{{n.message}}</p><small>{{n.createdAt|date:'dd/MM/yyyy HH:mm'}}</small></div>
<a *ngIf="n.link" mat-icon-button [routerLink]="n.link"><mat-icon>chevron_right</mat-icon></a></div></mat-card>
<div *ngIf="ns().length===0" class="es"><mat-icon>notifications_none</mat-icon><p>Không có thông báo</p></div></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:800px;margin:0 auto;padding:28px 24px}
.nc{border-radius:12px!important;padding:16px!important;margin-bottom:10px;&.unread{border-left:3px solid #1565c0;background:#f8faff}}
.nr{display:flex;align-items:center;gap:14px}.ni{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ninf{flex:1;h3{font-size:14px;font-weight:600;margin:0}p{font-size:12px;color:#666;margin:2px 0}small{font-size:11px;color:#aaa}}
.es{text-align:center;padding:40px;color:#aaa;mat-icon{font-size:48px;width:48px;height:48px}}`]})
export class NotificationsComponent implements OnInit{
  private api=inject(ApiService);private auth=inject(AuthService);ns=signal<Notification[]>([]);
  ngOnInit(){this.api.getNotifications(this.auth.user()?.id||'').subscribe(n=>this.ns.set(n));}
}