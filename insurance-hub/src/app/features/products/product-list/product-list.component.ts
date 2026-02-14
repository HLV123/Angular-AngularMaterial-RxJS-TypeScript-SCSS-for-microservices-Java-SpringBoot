import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule,ActivatedRoute}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatFormFieldModule}from'@angular/material/form-field';import{MatInputModule}from'@angular/material/input';import{ApiService}from'../../../core/services/api.service';import{Product}from'../../../core/models';import{VndPipe}from'../../../shared/pipes';
@Component({selector:'app-product-list',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,MatFormFieldModule,MatInputModule,VndPipe],
template:`<div class="pp"><section class="ph"><h1>Sản phẩm Bảo hiểm</h1><p>Khám phá sản phẩm phù hợp nhu cầu</p></section>
<div class="ctn"><div class="fl"><div class="cc"><button mat-stroked-button [class.act]="!sc()" (click)="fc(null)">Tất cả</button>
<button mat-stroked-button *ngFor="let c of cl" [class.act]="sc()===c.code" (click)="fc(c.code)"><mat-icon>{{c.icon}}</mat-icon>{{c.name}}</button></div>
<mat-form-field appearance="outline" class="sf"><mat-icon matPrefix>search</mat-icon><input matInput placeholder="Tìm kiếm..." (input)="os($event)"/></mat-form-field></div>
<div class="pg" *ngIf="fp().length;else emp"><mat-card *ngFor="let p of fp()" class="pc" appearance="outlined">
<div class="piw"><img [src]="p.image" [alt]="p.name"/><span class="pb" [style.background]="cc(p.category)"><mat-icon>{{p.icon}}</mat-icon>{{cl2(p.category)}}</span><span class="fb" *ngIf="p.featured">⭐ Nổi bật</span></div>
<mat-card-content><h3>{{p.name}}</h3><p class="d">{{p.shortDescription}}</p>
<div class="pm"><span class="rt">★ {{p.rating}}</span><span>{{p.reviewCount|number}} đánh giá</span></div>
<div class="pl"><span *ngFor="let pl of p.plans" class="plc" [class]="pl.tier.toLowerCase()">{{pl.name}}</span></div>
<div class="pr">Từ <b>{{p.minPremium|vnd}}</b>/năm</div></mat-card-content>
<mat-card-actions><a mat-button color="primary" [routerLink]="['/products',p.id]"><mat-icon>info</mat-icon>Chi tiết</a>
<a mat-flat-button color="primary" [routerLink]="['/quote']" [queryParams]="{productId:p.id}"><mat-icon>calculate</mat-icon>Báo giá</a></mat-card-actions></mat-card></div>
<ng-template #emp><div class="es"><mat-icon>search_off</mat-icon><h3>Không tìm thấy</h3></div></ng-template></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#2e7d32);color:#fff;padding:52px 24px;text-align:center;h1{font-size:32px;font-weight:700}p{opacity:.9}}
.ctn{max-width:1400px;margin:0 auto;padding:28px 24px}
.fl{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:28px}
.cc{display:flex;flex-wrap:wrap;gap:6px;button{border-radius:18px!important;font-size:12px;text-transform:none;&.act{background:#1565c0!important;color:#fff!important}mat-icon{font-size:14px;width:14px;height:14px;margin-right:3px}}}.sf{width:260px}
.pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px}
.pc{border-radius:14px!important;overflow:hidden;transition:.3s;&:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.1)}}
.piw{position:relative;height:200px;overflow:hidden;img{width:100%;height:100%;object-fit:cover}
.pb{position:absolute;top:10px;left:10px;color:#fff;padding:3px 10px;border-radius:16px;font-size:11px;display:flex;align-items:center;gap:3px;mat-icon{font-size:12px;width:12px;height:12px}}
.fb{position:absolute;top:10px;right:10px;background:#ffd54f;color:#333;padding:3px 10px;border-radius:16px;font-size:11px;font-weight:600}}
mat-card-content{padding:16px!important;h3{font-size:16px;font-weight:600;margin-bottom:6px}.d{font-size:13px;color:#666;line-height:1.4;min-height:36px}
.pm{display:flex;gap:8px;margin:8px 0;font-size:12px;.rt{color:#FF9800;font-weight:600}span{color:#999}}
.pl{display:flex;gap:4px;margin-bottom:8px;.plc{padding:1px 8px;border-radius:10px;font-size:10px;font-weight:600;&.bronze{background:#fff3e0;color:#e65100}&.silver{background:#eceff1;color:#455a64}&.gold{background:#fff8e1;color:#f57f17}&.platinum{background:#ede7f6;color:#4527a0}}}
.pr{font-size:14px;color:#1565c0;b{font-size:18px}}}
mat-card-actions{display:flex;justify-content:space-between;padding:6px 12px 12px!important}
.es{text-align:center;padding:60px;color:#999;mat-icon{font-size:56px;width:56px;height:56px}h3{margin-top:12px;color:#666}}
@media(max-width:600px){.sf{width:100%}.pg{grid-template-columns:1fr}}`]})
export class ProductListComponent implements OnInit{
  private api=inject(ApiService);private route=inject(ActivatedRoute);
  ap=signal<Product[]>([]);fp=signal<Product[]>([]);sc=signal<string|null>(null);st=signal('');
  cl=[{code:'HEALTH',name:'Sức khỏe',icon:'local_hospital'},{code:'LIFE',name:'Nhân thọ',icon:'favorite'},{code:'MOTOR',name:'Xe',icon:'directions_car'},{code:'PROPERTY',name:'Tài sản',icon:'home'},{code:'TRAVEL',name:'Du lịch',icon:'flight'},{code:'ACCIDENT',name:'Tai nạn',icon:'health_and_safety'}];
  ngOnInit(){this.api.getProducts().subscribe(p=>{this.ap.set(p);this.route.queryParams.subscribe(q=>{if(q['category'])this.sc.set(q['category']);this.af();});});}
  fc(c:any){this.sc.set(c);this.af();}
  os(e:Event){this.st.set((e.target as HTMLInputElement).value);this.af();}
  private af(){let r=this.ap();if(this.sc())r=r.filter(p=>p.category===this.sc());if(this.st()){const t=this.st().toLowerCase();r=r.filter(p=>p.name.toLowerCase().includes(t)||p.shortDescription.toLowerCase().includes(t));}this.fp.set(r);}
  cc(c:string){const m:any={HEALTH:'#4CAF50',LIFE:'#2196F3',MOTOR:'#FF9800',PROPERTY:'#9C27B0',TRAVEL:'#00BCD4',ACCIDENT:'#F44336'};return m[c]||'#1976d2';}
  cl2(c:string){const m:any={HEALTH:'Sức khỏe',LIFE:'Nhân thọ',MOTOR:'Xe',PROPERTY:'Tài sản',TRAVEL:'Du lịch',ACCIDENT:'Tai nạn'};return m[c]||c;}
}
