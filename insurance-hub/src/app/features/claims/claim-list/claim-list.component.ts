import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{AuthService}from'../../../core/services/auth.service';import{Claim,ClaimStatus}from'../../../core/models';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-claim-list',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe,StatusViPipe],
template:`<div><section class="ph"><h1>Yêu cầu bồi thường</h1><p>Theo dõi và quản lý yêu cầu</p>
<a mat-flat-button routerLink="/claims/submit" class="nb"><mat-icon>add_circle</mat-icon>Nộp yêu cầu mới</a></section>
<div class="ctn"><div class="sr">
<mat-card class="sc"><mat-icon class="si b">assignment</mat-icon><div><b>{{cs().length}}</b><span>Tổng</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si o">hourglass_top</mat-icon><div><b>{{pc()}}</b><span>Đang xử lý</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si g">check_circle</mat-icon><div><b>{{ac()}}</b><span>Đã duyệt</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si p">payment</mat-icon><div><b>{{tpd()|vnd}}</b><span>Đã chi trả</span></div></mat-card></div>
<mat-card *ngFor="let c of cs()" class="cc" appearance="outlined">
<div class="ch"><div class="ci" [style.background]="sc2(c.status)"><mat-icon>{{si(c.status)}}</mat-icon></div>
<div class="cinf"><h3>{{c.claimNumber}}</h3><p>{{c.description}}</p></div>
<span class="sb" [class]="c.status.toLowerCase()">{{c.status|statusVi}}</span></div>
<div class="cb"><div><span>Hợp đồng</span><b>{{c.policyNumber}}</b></div><div><span>Ngày xảy ra</span><b>{{c.incidentDate}}</b></div>
<div><span>Yêu cầu</span><b>{{c.claimedAmount|vnd}}</b></div><div><span>Duyệt</span><b>{{(c.approvedAmount||0)|vnd}}</b></div></div>
<div class="tl" *ngIf="c.timeline.length"><div *ngFor="let t of c.timeline;let l=last" class="ti"><div class="td" [class.ac]="l"></div>
<div class="tc"><b>{{t.status|statusVi}}</b><p>{{t.description}}</p><small>{{t.timestamp|date:'dd/MM HH:mm'}} · {{t.actor}}</small></div></div></div>
<div class="ca"><a mat-button color="primary" [routerLink]="['/claims',c.id]"><mat-icon>visibility</mat-icon>Chi tiết</a>
<button mat-button *ngIf="c.status==='ADDITIONAL_INFO_REQUIRED'"><mat-icon>upload</mat-icon>Bổ sung</button></div>
</mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:30px;font-weight:700}p{opacity:.9;margin-bottom:16px}.nb{background:#fff!important;color:#1565c0!important;border-radius:10px;font-weight:600}}
.ctn{max-width:1000px;margin:0 auto;padding:28px 24px}
.sr{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.sc{display:flex;align-items:center;gap:12px;padding:16px!important;border-radius:10px!important;.si{font-size:26px;width:26px;height:26px;&.b{color:#2196F3}&.o{color:#FF9800}&.g{color:#4CAF50}&.p{color:#9C27B0}}b{font-size:18px;display:block}span{font-size:11px;color:#888}}
.cc{border-radius:14px!important;padding:20px!important;margin-bottom:14px}
.ch{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.ci{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;mat-icon{color:#fff;font-size:20px;width:20px;height:20px}}
.cinf{flex:1;h3{font-size:14px;font-weight:600;margin:0}p{font-size:12px;color:#666;margin:2px 0 0}}
.sb{padding:3px 12px;border-radius:16px;font-size:11px;font-weight:600;&.paid,.approved{background:#e8f5e9;color:#2e7d32}&.submitted,.under_review{background:#e3f2fd;color:#1565c0}&.rejected{background:#ffebee;color:#c62828}&.additional_info_required{background:#fff3e0;color:#e65100}}
.cb{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:12px 0;border-top:1px solid #f0f0f0;div{span{font-size:11px;color:#888;display:block}b{font-size:13px}}}
.tl{padding:12px 0;border-top:1px solid #f0f0f0;.ti{display:flex;gap:12px;padding:6px 0;position:relative;&:not(:last-child)::before{content:'';position:absolute;left:6px;top:20px;bottom:-6px;width:2px;background:#e0e0e0}}
.td{width:14px;height:14px;border-radius:50%;background:#e0e0e0;flex-shrink:0;margin-top:3px;&.ac{background:#1565c0}}
.tc{b{font-size:12px}p{font-size:11px;color:#666;margin:1px 0}small{font-size:10px;color:#aaa}}}
.ca{display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #f0f0f0}
@media(max-width:768px){.sr,.cb{grid-template-columns:repeat(2,1fr)}}`]})
export class ClaimListComponent implements OnInit{
  private api=inject(ApiService);private auth=inject(AuthService);
  cs=signal<Claim[]>([]);pc=signal(0);ac=signal(0);tpd=signal(0);
  ngOnInit(){this.api.getClaims(this.auth.user()?.id).subscribe(c=>{this.cs.set(c);this.pc.set(c.filter(x=>[ClaimStatus.SUBMITTED,ClaimStatus.UNDER_REVIEW].includes(x.status)).length);this.ac.set(c.filter(x=>[ClaimStatus.APPROVED,ClaimStatus.PAID].includes(x.status)).length);this.tpd.set(c.filter(x=>x.status===ClaimStatus.PAID).reduce((s,x)=>s+(x.approvedAmount||0),0));});}
  sc2(s:string){const m:any={APPROVED:'#4CAF50',PAID:'#4CAF50',SUBMITTED:'#2196F3',UNDER_REVIEW:'#FF9800',REJECTED:'#F44336',ADDITIONAL_INFO_REQUIRED:'#FF9800'};return m[s]||'#757575';}
  si(s:string){const m:any={APPROVED:'check_circle',PAID:'payment',SUBMITTED:'send',UNDER_REVIEW:'hourglass_top',REJECTED:'cancel',ADDITIONAL_INFO_REQUIRED:'info'};return m[s]||'assignment';}
}