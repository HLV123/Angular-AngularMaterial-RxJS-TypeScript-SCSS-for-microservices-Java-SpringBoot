import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule,ActivatedRoute}from'@angular/router';import{FormBuilder,ReactiveFormsModule,Validators}from'@angular/forms';import{MatCardModule}from'@angular/material/card';import{MatFormFieldModule}from'@angular/material/form-field';import{MatInputModule}from'@angular/material/input';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatSelectModule}from'@angular/material/select';import{MatStepperModule}from'@angular/material/stepper';import{MatDatepickerModule}from'@angular/material/datepicker';import{MatNativeDateModule}from'@angular/material/core';import{MatProgressSpinnerModule}from'@angular/material/progress-spinner';import{ApiService}from'../../core/services/api.service';import{Product}from'../../core/models';import{VndPipe}from'../../shared/pipes';
@Component({selector:'app-quote',standalone:true,imports:[CommonModule,RouterModule,ReactiveFormsModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule,MatSelectModule,MatStepperModule,MatDatepickerModule,MatNativeDateModule,MatProgressSpinnerModule,VndPipe],
template:`<div class="qp"><section class="qh"><h1>Nhận báo giá</h1><p>Điền thông tin để nhận báo giá ngay lập tức</p></section>
<div class="ctn"><div class="qg"><mat-card class="qf">
<mat-stepper linear #stepper>
<mat-step label="Thông tin"><div class="sf">
<mat-form-field appearance="outline" class="fw"><mat-label>Họ tên</mat-label><input matInput [formControl]="name"/></mat-form-field>
<div class="fr"><mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput [formControl]="email"/></mat-form-field>
<mat-form-field appearance="outline"><mat-label>SĐT</mat-label><input matInput [formControl]="phone"/></mat-form-field></div>
<div class="fr"><mat-form-field appearance="outline"><mat-label>Ngày sinh</mat-label><input matInput [formControl]="dob" placeholder="dd/mm/yyyy"/></mat-form-field>
<mat-form-field appearance="outline"><mat-label>Nghề nghiệp</mat-label><input matInput [formControl]="occ"/></mat-form-field></div>
<button mat-flat-button color="primary" matStepperNext>Tiếp theo</button></div></mat-step>
<mat-step label="Sản phẩm"><div class="sf">
<mat-form-field appearance="outline" class="fw"><mat-label>Sản phẩm</mat-label><mat-select [formControl]="prodId" (selectionChange)="loadProd()"><mat-option *ngFor="let p of prods()" [value]="p.id">{{p.name}}</mat-option></mat-select></mat-form-field>
<mat-form-field appearance="outline" class="fw" *ngIf="selProd()"><mat-label>Gói bảo hiểm</mat-label><mat-select [formControl]="planId"><mat-option *ngFor="let pl of selProd()!.plans" [value]="pl.id">{{pl.name}} - {{pl.premium|vnd}}/năm</mat-option></mat-select></mat-form-field>
<div class="fr"><button mat-stroked-button matStepperPrevious>Quay lại</button><button mat-flat-button color="primary" matStepperNext>Tiếp theo</button></div></div></mat-step>
<mat-step label="Kết quả"><div class="sf">
<div *ngIf="!qt()&&!ld()" class="qact"><p>Nhấn "Tính phí" để nhận báo giá.</p><button mat-flat-button color="primary" (click)="calc()" [disabled]="ld()">Tính phí bảo hiểm</button></div>
<mat-spinner *ngIf="ld()" diameter="40" class="sp"></mat-spinner>
<div *ngIf="qt() as q" class="qr"><h3>Kết quả báo giá</h3><div class="qi"><span>Mã báo giá</span><b>{{q.quoteNumber}}</b></div>
<div class="qi"><span>Phí năm</span><b class="hl">{{q.premiumAnnual|vnd}}</b></div><div class="qi"><span>Phí tháng</span><b>{{q.premiumMonthly|vnd}}</b></div>
<div class="qi" *ngFor="let b of q.breakdown"><span>{{b.item}}</span><b>{{b.amount|vnd}}</b></div>
<div class="qi"><span>Hiệu lực đến</span><b>{{q.validUntil|date:'dd/MM/yyyy'}}</b></div>
<div class="qa"><a mat-flat-button color="primary" routerLink="/register">Mua ngay</a><button mat-stroked-button matStepperPrevious>Thay đổi</button></div></div>
</div></mat-step></mat-stepper></mat-card>
<mat-card class="qs" *ngIf="selProd() as sp"><h3>{{sp.name}}</h3><img [src]="sp.image" class="qsi"/>
<p>{{sp.shortDescription}}</p><p class="qsp">Từ <b>{{sp.minPremium|vnd}}</b>/năm</p>
<div class="qst"><span>★ {{sp.rating}}</span><span>{{sp.reviewCount}} đánh giá</span></div></mat-card></div></div></div>`,
styles:[`.qp{}.qh{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:48px 24px;text-align:center;h1{font-size:30px;font-weight:700}p{opacity:.9}}
.ctn{max-width:1100px;margin:0 auto;padding:28px 24px}.qg{display:grid;grid-template-columns:1fr 320px;gap:24px}
.qf{padding:24px!important;border-radius:14px!important}.sf{padding:16px 0}.fw{width:100%}.fr{display:flex;gap:12px;mat-form-field{flex:1}}
.qact{text-align:center;padding:20px}.sp{margin:20px auto}
.qr{h3{font-size:18px;font-weight:700;margin-bottom:16px;color:#1565c0}}.qi{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;span{color:#666;font-size:13px}b{font-size:14px}&.hl b{color:#1565c0;font-size:18px}}
.qa{display:flex;gap:12px;margin-top:20px}
.qs{padding:20px!important;border-radius:14px!important;h3{font-size:16px;font-weight:600;margin-bottom:10px}.qsi{width:100%;height:160px;object-fit:cover;border-radius:8px;margin-bottom:10px}p{font-size:13px;color:#666}.qsp{color:#1565c0;font-size:14px;margin:8px 0}
.qst{display:flex;gap:8px;font-size:12px;color:#888;span:first-child{color:#FF9800}}}
@media(max-width:768px){.qg{grid-template-columns:1fr}.qs{display:none}}`]})
export class QuoteComponent implements OnInit{
  private api=inject(ApiService);private route=inject(ActivatedRoute);private fb=inject(FormBuilder);
  prods=signal<Product[]>([]);selProd=signal<Product|null>(null);qt=signal<any>(null);ld=signal(false);
  name=this.fb.control('',Validators.required);email=this.fb.control('');phone=this.fb.control('');dob=this.fb.control('');occ=this.fb.control('');
  prodId=this.fb.control('');planId=this.fb.control('');
  ngOnInit(){this.api.getProducts().subscribe(p=>{this.prods.set(p);this.route.queryParams.subscribe(q=>{if(q['productId']){this.prodId.setValue(q['productId']);this.loadProd();if(q['planId'])this.planId.setValue(q['planId']);}});});}
  loadProd(){const p=this.prods().find(x=>x.id===this.prodId.value);this.selProd.set(p||null);}
  calc(){this.ld.set(true);this.api.createQuote({productId:this.prodId.value,planId:this.planId.value}).subscribe(q=>{this.ld.set(false);this.qt.set(q);});}
}
