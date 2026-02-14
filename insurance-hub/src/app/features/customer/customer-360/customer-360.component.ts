import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatDividerModule}from'@angular/material/divider';import{ApiService}from'../../../core/services/api.service';import{AuthService}from'../../../core/services/auth.service';import{VndPipe}from'../../../shared/pipes';
@Component({selector:'app-customer-360',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,MatDividerModule,VndPipe],
template:`<div><section class="ph"><h1>Customer 360°</h1><p>Góc nhìn toàn diện về khách hàng</p></section>
<div class="ctn" *ngIf="d() as c"><div class="dg">
<mat-card class="mc"><div class="av"><mat-icon>account_circle</mat-icon></div><h2>{{c.fullName}}</h2>
<span class="sg">{{c.segment}}</span><div class="sc2">Customer Score: <b>{{c.score}}/100</b></div><p class="lv">Lifetime Value: <b>{{c.lifetimeValue|vnd}}</b></p></mat-card>
<mat-card class="dc"><h3>Tổng quan</h3>
<div class="sg2"><div><b>{{c.summary.totalPolicies}}</b><span>Tổng HĐ</span></div><div><b>{{c.summary.activePolicies}}</b><span>Active</span></div>
<div><b>{{c.summary.totalPremium|vnd}}</b><span>Phí/năm</span></div><div><b>{{c.summary.totalClaims}}</b><span>Claims</span></div></div>
<mat-divider></mat-divider><h3>Hồ sơ rủi ro</h3>
<div class="rp"><div *ngFor="let r of rpItems()" class="ri"><span>{{r.label}}</span><b [class]="r.cls">{{r.value}}</b></div></div>
<mat-divider></mat-divider><h3>Cơ hội cross-sell</h3>
<div class="cs"><div *ngFor="let o of c.crossSellOpportunities" class="ci"><mat-icon>lightbulb</mat-icon>{{o}}</div></div></mat-card></div>
<mat-card class="hc"><h3>Lịch sử tương tác</h3>
<div *ngFor="let i of c.interactions" class="hi"><div class="ht" [class]="i.type.toLowerCase()"><mat-icon>{{ti(i.type)}}</mat-icon></div>
<div class="hinfo"><b>{{tl(i.type)}}</b><p>{{i.note}}</p><small>{{i.date}} · {{i.agent}}</small></div></div></mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}p{opacity:.9}}
.ctn{max-width:1100px;margin:0 auto;padding:28px 24px}.dg{display:grid;grid-template-columns:280px 1fr;gap:20px;margin-bottom:20px}
.mc{padding:28px!important;border-radius:14px!important;text-align:center;.av mat-icon{font-size:72px;width:72px;height:72px;color:#1565c0}h2{font-size:20px;font-weight:700;margin:8px 0 4px}
.sg{padding:3px 14px;background:#ffd54f;color:#795548;border-radius:14px;font-size:12px;font-weight:700}.sc2{margin:12px 0;font-size:13px;b{color:#1565c0;font-size:20px}}.lv{font-size:13px;color:#666;b{color:#2e7d32}}}
.dc{padding:24px!important;border-radius:14px!important;h3{font-size:14px;font-weight:600;margin:12px 0 10px;color:#1565c0}}
.sg2{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;margin-bottom:16px;b{font-size:16px;display:block;color:#1565c0}span{font-size:11px;color:#888}}
.rp{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:16px}.ri{display:flex;justify-content:space-between;padding:6px 10px;background:#f8fafc;border-radius:6px;font-size:12px;span{color:#666}b{&.g{color:#2e7d32}&.y{color:#e65100}&.r{color:#c62828}}}
.cs{display:flex;flex-direction:column;gap:6px}.ci{display:flex;align-items:center;gap:6px;font-size:13px;color:#555;padding:6px 10px;background:#fff8e1;border-radius:6px;mat-icon{font-size:16px;width:16px;height:16px;color:#FF9800}}
.hc{padding:24px!important;border-radius:14px!important;h3{font-size:14px;font-weight:600;margin-bottom:14px;color:#1565c0}}
.hi{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #f5f5f5}
.ht{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;mat-icon{color:#fff;font-size:18px;width:18px;height:18px}
&.call{background:#4CAF50}&.email{background:#2196F3}&.claim{background:#FF9800}&.portal{background:#9C27B0}&.payment{background:#009688}}
.hinfo{flex:1;b{font-size:13px}p{font-size:12px;color:#666;margin:2px 0}small{font-size:11px;color:#aaa}}
@media(max-width:768px){.dg{grid-template-columns:1fr}.sg2{grid-template-columns:repeat(2,1fr)}}`]})
export class Customer360Component implements OnInit{
  private api=inject(ApiService);d=signal<any>(null);
  ngOnInit(){this.api.getCustomer360().subscribe(c=>this.d.set(c));}
  rpItems(){const r=this.d()?.riskProfile;if(!r)return[];return[{label:'Rủi ro sức khỏe',value:r.healthRisk,cls:r.healthRisk==='LOW'?'g':'y'},{label:'Tần suất claims',value:r.claimsFrequency,cls:r.claimsFrequency==='LOW'?'g':'y'},{label:'Lịch sử TT',value:r.paymentHistory,cls:'g'},{label:'Rủi ro gian lận',value:r.fraudRisk,cls:'g'}];}
  ti(t:string){const m:any={CALL:'phone',EMAIL:'email',CLAIM:'assignment',PORTAL:'computer',PAYMENT:'payment'};return m[t]||'info';}
  tl(t:string){const m:any={CALL:'Cuộc gọi',EMAIL:'Email',CLAIM:'Claims',PORTAL:'Portal',PAYMENT:'Thanh toán'};return m[t]||t;}
}