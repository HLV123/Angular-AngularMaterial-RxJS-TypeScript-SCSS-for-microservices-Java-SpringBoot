import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../core/services/api.service';import{VndPipe,StatusViPipe}from'../../shared/pipes';
@Component({selector:'app-claims-handler',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe,StatusViPipe],
template:`<div><section class="ph"><h1>Xử lý bồi thường</h1><p>Claims Handler Dashboard</p></section><div class="ctn">
<div class="sr"><mat-card class="sc"><mat-icon class="si b">assignment</mat-icon><div><b>{{cs().length}}</b><span>Tổng claims</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si o">hourglass_top</mat-icon><div><b>{{review()}}</b><span>Đang xét</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si g">check_circle</mat-icon><div><b>{{done()}}</b><span>Đã xử lý</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si r">security</mat-icon><div><b>0</b><span>Nghi gian lận</span></div></mat-card></div>
<h3 class="sh">Claims cần xử lý</h3>
<mat-card *ngFor="let c of cs()" class="cc" appearance="outlined">
<div class="ch2"><div class="ci2" [style.background]="sc2(c.status)"><mat-icon>{{si(c.status)}}</mat-icon></div>
<div class="cinf"><h3>{{c.claimNumber}}</h3><p>{{c.customerName}} · {{c.description}}</p></div>
<span class="sb" [class]="c.status.toLowerCase().replace('_','-')">{{c.status|statusVi}}</span></div>
<div class="cb"><div><span>HĐ</span><b>{{c.policyNumber}}</b></div><div><span>Loại</span><b>{{c.productCategory|statusVi}}</b></div><div><span>Yêu cầu</span><b>{{c.claimedAmount|vnd}}</b></div><div><span>Fraud Score</span><b [class]="c.fraudScore>50?'high':c.fraudScore>20?'med':'low'">{{c.fraudScore}}/100</b></div></div>
<div class="cd"><span>Tài liệu: {{c.documents.length}} file</span><span>Ngày nộp: {{c.submissionDate}}</span><span *ngIf="c.approvedAmount">Đã duyệt: {{c.approvedAmount|vnd}}</span></div>
<div class="ca" *ngIf="c.status==='SUBMITTED'||c.status==='UNDER_REVIEW'">
<button mat-flat-button color="primary"><mat-icon>check</mat-icon>Phê duyệt</button>
<button mat-stroked-button><mat-icon>remove_circle</mat-icon>Duyệt 1 phần</button>
<button mat-stroked-button><mat-icon>info</mat-icon>Yêu cầu bổ sung</button>
<button mat-stroked-button color="warn"><mat-icon>cancel</mat-icon>Từ chối</button></div>
</mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}p{opacity:.9}}
.ctn{max-width:1100px;margin:0 auto;padding:28px 24px}.sh{font-size:16px;font-weight:600;margin-bottom:14px;color:#1a2332}
.sr{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.sc{display:flex;align-items:center;gap:12px;padding:16px!important;border-radius:10px!important;.si{font-size:26px;width:26px;height:26px;&.b{color:#2196F3}&.o{color:#FF9800}&.g{color:#4CAF50}&.r{color:#F44336}}b{font-size:18px;display:block}span{font-size:11px;color:#888}}
.cc{border-radius:14px!important;padding:20px!important;margin-bottom:14px}
.ch2{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.ci2{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;mat-icon{color:#fff;font-size:20px;width:20px;height:20px}}
.cinf{flex:1;h3{font-size:14px;font-weight:600;margin:0}p{font-size:12px;color:#666;margin:2px 0 0}}
.sb{padding:3px 12px;border-radius:16px;font-size:11px;font-weight:600;&.paid,.approved{background:#e8f5e9;color:#2e7d32}&.submitted,.under-review{background:#e3f2fd;color:#1565c0}&.additional-info-required{background:#fff3e0;color:#e65100}}
.cb{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:12px 0;border-top:1px solid #f0f0f0;div{span{font-size:11px;color:#888;display:block}b{font-size:13px;&.high{color:#c62828}&.med{color:#e65100}&.low{color:#2e7d32}}}}
.cd{display:flex;gap:20px;padding:8px 0;font-size:12px;color:#888}
.ca{display:flex;gap:8px;padding-top:12px;border-top:1px solid #f0f0f0;flex-wrap:wrap}
@media(max-width:768px){.sr,.cb{grid-template-columns:repeat(2,1fr)}}`]})
export class ClaimsHandlerComponent implements OnInit{
  private api=inject(ApiService);cs=signal<any[]>([]);review=signal(0);done=signal(0);
  ngOnInit(){this.api.getClaims().subscribe(c=>{this.cs.set(c);this.review.set(c.filter((x:any)=>['SUBMITTED','UNDER_REVIEW','ADDITIONAL_INFO_REQUIRED'].includes(x.status)).length);this.done.set(c.filter((x:any)=>['APPROVED','PAID','REJECTED'].includes(x.status)).length);});}
  sc2(s:string){const m:any={APPROVED:'#4CAF50',PAID:'#4CAF50',SUBMITTED:'#2196F3',UNDER_REVIEW:'#FF9800',REJECTED:'#F44336',ADDITIONAL_INFO_REQUIRED:'#FF9800'};return m[s]||'#757575';}
  si(s:string){const m:any={APPROVED:'check_circle',PAID:'payment',SUBMITTED:'send',UNDER_REVIEW:'hourglass_top',REJECTED:'cancel',ADDITIONAL_INFO_REQUIRED:'info'};return m[s]||'assignment';}
}