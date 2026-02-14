import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule,ActivatedRoute}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatDividerModule}from'@angular/material/divider';import{ApiService}from'../../../core/services/api.service';import{Claim}from'../../../core/models';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-claim-detail',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,MatDividerModule,VndPipe,StatusViPipe],
template:`<div *ngIf="c() as cl"><section class="ph"><div class="ctn"><a routerLink="/claims" class="bk"><mat-icon>arrow_back</mat-icon>Quay lại</a>
<h1>{{cl.claimNumber}}</h1><span class="sb" [class]="cl.status.toLowerCase()">{{cl.status|statusVi}}</span></div></section>
<div class="ctn"><div class="dg"><mat-card class="dc"><h3>Chi tiết yêu cầu</h3>
<div class="di"><span>Hợp đồng</span><b>{{cl.policyNumber}}</b></div><div class="di"><span>Loại</span><b>{{cl.type|statusVi}}</b></div>
<div class="di"><span>Mô tả</span><b>{{cl.description}}</b></div><div class="di"><span>Ngày xảy ra</span><b>{{cl.incidentDate}}</b></div>
<div class="di"><span>Ngày nộp</span><b>{{cl.submissionDate}}</b></div><div class="di"><span>Số tiền YC</span><b>{{cl.claimedAmount|vnd}}</b></div>
<div class="di"><span>Khấu trừ</span><b>{{cl.deductible|vnd}}</b></div><div class="di"><span>Đã duyệt</span><b class="hl">{{(cl.approvedAmount||0)|vnd}}</b></div>
<div class="di" *ngIf="cl.handlerName"><span>Người xử lý</span><b>{{cl.handlerName}}</b></div>
<div class="di" *ngIf="cl.fraudScore!=null"><span>Fraud Score</span><b>{{cl.fraudScore}}/100</b></div></mat-card>
<div><mat-card class="dc"><h3>Timeline</h3><div *ngFor="let t of cl.timeline;let l=last" class="ti"><div class="td" [class.ac]="l"></div>
<div class="tc"><b>{{t.status|statusVi}}</b><p>{{t.description}}</p><small>{{t.timestamp|date:'dd/MM/yyyy HH:mm'}}</small></div></div></mat-card>
<mat-card class="dc" *ngIf="cl.documents.length"><h3>Tài liệu ({{cl.documents.length}})</h3>
<div *ngFor="let d of cl.documents" class="doi"><mat-icon>description</mat-icon><span>{{d.name}}</span></div></mat-card>
<mat-card class="dc" *ngIf="cl.bankAccount"><h3>TK nhận tiền</h3>
<div class="di"><span>Ngân hàng</span><b>{{cl.bankAccount.bankName}}</b></div>
<div class="di"><span>Số TK</span><b>{{cl.bankAccount.accountNumber}}</b></div>
<div class="di"><span>Chủ TK</span><b>{{cl.bankAccount.accountHolder}}</b></div></mat-card></div></div></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:32px 24px;.bk{color:rgba(255,255,255,.7);text-decoration:none;display:flex;align-items:center;gap:4px;font-size:13px;margin-bottom:8px}
h1{font-size:24px;font-weight:700;display:inline;margin-right:10px}.sb{padding:3px 12px;border-radius:16px;font-size:11px;font-weight:600;vertical-align:middle;&.paid,.approved{background:rgba(76,175,80,.3);color:#a5d6a7}&.under_review{background:rgba(255,152,0,.3);color:#ffcc80}&.additional_info_required{background:rgba(255,152,0,.3);color:#ffcc80}}}
.ctn{max-width:1100px;margin:0 auto;padding:24px}.dg{display:grid;grid-template-columns:1.2fr 1fr;gap:20px}
.dc{padding:20px!important;border-radius:14px!important;margin-bottom:16px;h3{font-size:15px;font-weight:600;margin-bottom:12px;color:#1565c0}}
.di{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f5f5f5;span{color:#888;font-size:12px}b{font-size:13px}.hl{color:#1565c0;font-weight:700}}
.ti{display:flex;gap:12px;padding:6px 0;position:relative;&:not(:last-child)::before{content:'';position:absolute;left:6px;top:20px;bottom:-6px;width:2px;background:#e0e0e0}}
.td{width:14px;height:14px;border-radius:50%;background:#e0e0e0;flex-shrink:0;margin-top:3px;&.ac{background:#1565c0}}.tc{b{font-size:12px}p{font-size:11px;color:#666;margin:1px 0}small{font-size:10px;color:#aaa}}
.doi{display:flex;align-items:center;gap:8px;padding:8px 0;font-size:13px;mat-icon{color:#1565c0;font-size:18px;width:18px;height:18px}}
@media(max-width:768px){.dg{grid-template-columns:1fr}}`]})
export class ClaimDetailComponent implements OnInit{
  private api=inject(ApiService);private route=inject(ActivatedRoute);c=signal<Claim|null>(null);
  ngOnInit(){this.route.params.subscribe(p=>{this.api.getClaimById(p['id']).subscribe(r=>{if(r)this.c.set(r);});});}
}