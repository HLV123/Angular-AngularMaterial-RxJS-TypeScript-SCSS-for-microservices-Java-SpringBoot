import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule,ActivatedRoute}from'@angular/router';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatTabsModule}from'@angular/material/tabs';import{MatCardModule}from'@angular/material/card';import{ApiService}from'../../../core/services/api.service';import{Product}from'../../../core/models';import{VndPipe}from'../../../shared/pipes';
@Component({selector:'app-product-detail',standalone:true,imports:[CommonModule,RouterModule,MatButtonModule,MatIconModule,MatTabsModule,MatCardModule,VndPipe],
template:`<div *ngIf="p() as pr"><div class="ph" [style.backgroundImage]="'url('+pr.image+')'"><div class="po"><div class="ctn">
<div class="bc"><a routerLink="/products">Sản phẩm</a> / {{pr.name}}</div><h1>{{pr.name}}</h1><p>{{pr.shortDescription}}</p>
<div class="hm"><span class="rt">★ {{pr.rating}} ({{pr.reviewCount}} đánh giá)</span><span class="hp">Từ {{pr.minPremium|vnd}}/năm</span></div></div></div></div>
<div class="ctn"><section class="ps"><h2>Chọn gói phù hợp</h2>
<div class="pg"><div *ngFor="let pl of pr.plans" class="plc" [class.rec]="pl.recommended">
<div class="plb" *ngIf="pl.recommended">Phổ biến nhất</div><h3>{{pl.name}}</h3><p class="pt">{{pl.tier}}</p>
<div class="pp"><b>{{pl.premium|vnd}}</b><span>/năm</span></div><p class="pm">~ {{pl.premiumMonthly|vnd}}/tháng</p>
<div class="si">Quyền lợi: <b>{{pl.sumInsured|vnd}}</b></div>
<ul class="bl"><li *ngFor="let b of pl.benefits" [class.inc]="b.included" [class.exc]="!b.included">
<mat-icon>{{b.included?'check_circle':'cancel'}}</mat-icon><div><b>{{b.name}}</b><span>{{b.limit}}</span></div></li></ul>
<a mat-flat-button [color]="pl.recommended?'primary':''" class="pb" [routerLink]="['/quote']" [queryParams]="{productId:pr.id,planId:pl.id}">Nhận báo giá</a>
</div></div></section>
<mat-tab-group class="dt"><mat-tab label="Mô tả chi tiết"><div class="tc"><p>{{pr.description}}</p><h4>Đối tượng:</h4><p>Tuổi: {{pr.eligibility.minAge}}-{{pr.eligibility.maxAge}}. Kỳ hạn: {{pr.eligibility.minTerm}}-{{pr.eligibility.maxTerm}} tháng.</p></div></mat-tab>
<mat-tab label="Loại trừ"><div class="tc"><ul class="el"><li *ngFor="let e of pr.exclusions"><mat-icon>block</mat-icon>{{e}}</li></ul></div></mat-tab>
<mat-tab label="Tags"><div class="tc"><span *ngFor="let t of pr.tags" class="tag">{{t}}</span></div></mat-tab></mat-tab-group></div></div>`,
styles:[`.ph{min-height:260px;background-size:cover;background-position:center}
.po{min-height:260px;background:linear-gradient(135deg,rgba(21,101,192,.92),rgba(10,60,120,.95));display:flex;align-items:flex-end;padding-bottom:36px}
.ctn{max-width:1200px;margin:0 auto;padding:0 24px;width:100%}
.bc{font-size:12px;color:rgba(255,255,255,.7);margin-bottom:10px;a{color:rgba(255,255,255,.7)}}
.po h1{color:#fff;font-size:32px;font-weight:700;margin-bottom:6px}.po p{color:rgba(255,255,255,.9);font-size:15px}
.hm{margin-top:12px;display:flex;gap:20px;color:#fff;.rt{color:#ffd54f;font-weight:600}.hp{font-size:17px;font-weight:700}}
.ps{padding:40px 0;h2{font-size:26px;font-weight:700;text-align:center;margin-bottom:28px}}
.pg{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.plc{background:#fff;border:2px solid #e0e0e0;border-radius:18px;padding:28px 20px;text-align:center;position:relative;transition:.3s;
&.rec{border-color:#1565c0;transform:scale(1.02);box-shadow:0 6px 24px rgba(21,101,192,.12)}
&:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,.08)}
.plb{position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#1565c0;color:#fff;padding:3px 16px;border-radius:16px;font-size:11px;font-weight:600}
h3{font-size:20px;font-weight:700;margin:6px 0}.pt{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px}
.pp{margin:14px 0 2px;b{font-size:24px;color:#1565c0}span{font-size:13px;color:#666}}.pm{font-size:12px;color:#888;margin-bottom:10px}
.si{font-size:12px;color:#555;padding:6px;background:#f5f5f5;border-radius:6px;margin-bottom:16px}}
.bl{list-style:none;padding:0;text-align:left;margin-bottom:20px;li{display:flex;align-items:flex-start;gap:6px;padding:6px 0;border-bottom:1px solid #f5f5f5;
&.inc mat-icon{color:#4CAF50}&.exc{opacity:.4;mat-icon{color:#ccc}}
mat-icon{font-size:18px;width:18px;height:18px;flex-shrink:0;margin-top:1px}b{display:block;font-size:13px}span{font-size:11px;color:#888}}}
.pb{width:100%;border-radius:10px!important;height:42px}
.dt{margin:28px 0 56px}.tc{padding:20px 0;font-size:14px;line-height:1.7;color:#555;h4{color:#333;margin:14px 0 6px}}
.el{list-style:none;padding:0;li{display:flex;align-items:center;gap:6px;padding:6px 0;color:#d32f2f;font-size:13px;mat-icon{font-size:16px;width:16px;height:16px}}}
.tag{display:inline-block;padding:4px 12px;background:#e3f2fd;color:#1565c0;border-radius:14px;font-size:12px;margin:4px}`]})
export class ProductDetailComponent implements OnInit{
  private api=inject(ApiService);private route=inject(ActivatedRoute);p=signal<Product|null>(null);
  ngOnInit(){this.route.params.subscribe(p=>{this.api.getProductById(p['id']).subscribe(r=>{if(r)this.p.set(r);});});}
}
