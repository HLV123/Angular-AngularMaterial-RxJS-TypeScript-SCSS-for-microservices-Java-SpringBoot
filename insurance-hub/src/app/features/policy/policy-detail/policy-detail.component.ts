import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule,ActivatedRoute}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatTabsModule}from'@angular/material/tabs';import{MatDividerModule}from'@angular/material/divider';import{ApiService}from'../../../core/services/api.service';import{Policy}from'../../../core/models';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-policy-detail',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,MatTabsModule,MatDividerModule,VndPipe,StatusViPipe],
template:`<div *ngIf="p() as pol"><section class="ph"><div class="ctn"><a routerLink="/policies" class="bk"><mat-icon>arrow_back</mat-icon>Quay lại</a>
<h1>{{pol.policyNumber}}</h1><span class="sb" [class]="pol.status.toLowerCase()">{{pol.status|statusVi}}</span></div></section>
<div class="ctn"><div class="dg"><mat-card class="dc"><h3>Thông tin hợp đồng</h3>
<div class="di"><span>Sản phẩm</span><b>{{pol.productName}}</b></div><div class="di"><span>Gói</span><b>{{pol.planName}}</b></div>
<div class="di"><span>Quyền lợi</span><b>{{pol.sumInsured|vnd}}</b></div><div class="di"><span>Phí BH</span><b>{{pol.premium|vnd}}/năm</b></div>
<div class="di"><span>Hiệu lực</span><b>{{pol.startDate}} → {{pol.endDate}}</b></div><div class="di"><span>Thanh toán</span><b>{{pol.paymentFrequency|statusVi}}</b></div>
<div class="di"><span>Ngày phát hành</span><b>{{pol.issuedAt}}</b></div><div class="di" *ngIf="pol.agentName"><span>Đại lý</span><b>{{pol.agentName}}</b></div></mat-card>
<mat-card class="dc"><h3>Người thụ hưởng</h3>
<div *ngIf="pol.beneficiaries.length===0" class="em">Chưa có người thụ hưởng</div>
<div *ngFor="let b of pol.beneficiaries" class="bi"><mat-icon>person</mat-icon><div><b>{{b.name}}</b><span>{{b.relationship}} · {{b.percentage}}%</span></div></div>
<mat-divider></mat-divider><h3 style="margin-top:16px">Thao tác nhanh</h3>
<div class="qa"><a mat-stroked-button color="primary" routerLink="/claims/submit"><mat-icon>assignment</mat-icon>Nộp bồi thường</a>
<button mat-stroked-button><mat-icon>autorenew</mat-icon>Gia hạn</button><button mat-stroked-button><mat-icon>download</mat-icon>Tải HĐ PDF</button></div>
</mat-card></div></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:36px 24px;.bk{color:rgba(255,255,255,.7);text-decoration:none;display:flex;align-items:center;gap:4px;font-size:13px;margin-bottom:10px}
h1{font-size:26px;font-weight:700;display:inline;margin-right:12px}.sb{padding:3px 12px;border-radius:16px;font-size:11px;font-weight:600;vertical-align:middle;&.active{background:rgba(76,175,80,.3);color:#a5d6a7}&.expired{background:rgba(255,255,255,.2);color:#ccc}}}
.ctn{max-width:1100px;margin:0 auto;padding:28px 24px}.dg{display:grid;grid-template-columns:1.2fr 1fr;gap:20px}
.dc{padding:24px!important;border-radius:14px!important;h3{font-size:16px;font-weight:600;margin-bottom:14px;color:#1565c0}}
.di{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f5f5f5;span{color:#888;font-size:13px}b{font-size:13px}}
.em{color:#999;font-size:13px;padding:12px 0}.bi{display:flex;align-items:center;gap:10px;padding:10px 0;mat-icon{color:#1565c0}b{display:block;font-size:14px}span{font-size:12px;color:#888}}
.qa{display:flex;flex-direction:column;gap:8px;margin-top:12px}
@media(max-width:768px){.dg{grid-template-columns:1fr}}`]})
export class PolicyDetailComponent implements OnInit{
  private api=inject(ApiService);private route=inject(ActivatedRoute);p=signal<Policy|null>(null);
  ngOnInit(){this.route.params.subscribe(p=>{this.api.getPolicyById(p['id']).subscribe(r=>{if(r)this.p.set(r);});});}
}