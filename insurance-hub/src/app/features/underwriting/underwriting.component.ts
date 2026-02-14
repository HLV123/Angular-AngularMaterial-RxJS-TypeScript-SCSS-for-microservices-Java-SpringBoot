import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatChipsModule}from'@angular/material/chips';import{ApiService}from'../../core/services/api.service';import{VndPipe}from'../../shared/pipes';
@Component({selector:'app-underwriting',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,MatChipsModule,VndPipe],
template:`<div><section class="ph"><h1>Thẩm định rủi ro</h1><p>Underwriting Dashboard</p></section><div class="ctn">
<div class="sr"><mat-card class="sc"><mat-icon class="si o">hourglass_top</mat-icon><div><b>{{pending()}}</b><span>Chờ duyệt</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si g">check_circle</mat-icon><div><b>{{approved()}}</b><span>Đã duyệt</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si r">cancel</mat-icon><div><b>{{declined()}}</b><span>Từ chối</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si b">auto_awesome</mat-icon><div><b>{{auto()}}</b><span>Auto-approve</span></div></mat-card></div>
<mat-card *ngFor="let u of queue()" class="uc" appearance="outlined">
<div class="uh"><div class="ur" [class]="u.riskLevel.toLowerCase()"><mat-icon>{{u.riskLevel==='HIGH'?'warning':u.riskLevel==='MEDIUM'?'info':'check_circle'}}</mat-icon>{{u.riskLevel}}</div>
<div class="ui"><h3>{{u.applicationId}}</h3><p>{{u.customerName}} · {{u.productName}} · {{u.planName}}</p></div>
<span class="us" [class]="u.status.toLowerCase().replace('_','-')">{{stl(u.status)}}</span></div>
<div class="ub"><div><span>STBH</span><b>{{u.sumInsured|vnd}}</b></div><div><span>Phí/năm</span><b>{{u.premium|vnd}}</b></div><div><span>Risk Score</span><b [class]="rsc(u.riskScore)">{{u.riskScore}}/100</b></div><div><span>SLA Deadline</span><b>{{u.slaDeadline|date:'dd/MM HH:mm'}}</b></div></div>
<div class="ud"><h4>Khai báo sức khỏe</h4><div class="uf"><span>Hút thuốc: <b [class]="u.healthDeclaration.smoker?'red':'grn'">{{u.healthDeclaration.smoker?'Có':'Không'}}</b></span>
<span>BMI: <b [class]="u.healthDeclaration.bmi>27?'red':'grn'">{{u.healthDeclaration.bmi}}</b></span>
<span>Bệnh nền: <b [class]="u.healthDeclaration.preConditions.length?'red':'grn'">{{u.healthDeclaration.preConditions.length?u.healthDeclaration.preConditions.join(', '):'Không'}}</b></span></div>
<p class="un"><mat-icon>notes</mat-icon>{{u.notes}}</p>
<p class="ua"><mat-icon>person</mat-icon>Đại lý: {{u.agentName}} · Nộp: {{u.submittedAt|date:'dd/MM/yyyy HH:mm'}}</p></div>
<div class="uact" *ngIf="u.status==='PENDING_REVIEW'">
<button mat-flat-button color="primary"><mat-icon>check</mat-icon>Phê duyệt</button>
<button mat-stroked-button color="warn"><mat-icon>add_circle</mat-icon>Duyệt + Phụ phí</button>
<button mat-stroked-button><mat-icon>help</mat-icon>Yêu cầu khám</button>
<button mat-stroked-button color="warn"><mat-icon>cancel</mat-icon>Từ chối</button></div>
</mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}p{opacity:.9}}
.ctn{max-width:1100px;margin:0 auto;padding:28px 24px}
.sr{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.sc{display:flex;align-items:center;gap:12px;padding:16px!important;border-radius:10px!important;.si{font-size:26px;width:26px;height:26px;&.o{color:#FF9800}&.g{color:#4CAF50}&.r{color:#F44336}&.b{color:#2196F3}}b{font-size:18px;display:block}span{font-size:11px;color:#888}}
.uc{border-radius:14px!important;padding:20px!important;margin-bottom:16px}
.uh{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.ur{padding:4px 12px;border-radius:8px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:4px;mat-icon{font-size:14px;width:14px;height:14px}
&.high{background:#ffebee;color:#c62828}&.medium{background:#fff3e0;color:#e65100}&.low{background:#e8f5e9;color:#2e7d32}}
.ui{flex:1;h3{font-size:15px;font-weight:600;margin:0}p{font-size:12px;color:#666;margin:2px 0 0}}
.us{padding:3px 12px;border-radius:16px;font-size:11px;font-weight:600;&.pending-review{background:#e3f2fd;color:#1565c0}&.auto-approved,.approved-with-loading{background:#e8f5e9;color:#2e7d32}&.declined{background:#ffebee;color:#c62828}}
.ub{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:14px 0;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;div{span{font-size:11px;color:#888;display:block}b{font-size:13px}}}
.ud{padding:12px 0;h4{font-size:13px;font-weight:600;margin-bottom:8px;color:#1565c0}
.uf{display:flex;gap:20px;flex-wrap:wrap;font-size:13px;span{color:#666}b{font-weight:600;&.red{color:#c62828}&.grn{color:#2e7d32}}}
.un,.ua{font-size:12px;color:#666;display:flex;align-items:center;gap:6px;margin:8px 0 0;mat-icon{font-size:14px;width:14px;height:14px;color:#aaa}}}
.uact{display:flex;gap:8px;padding-top:12px;border-top:1px solid #f0f0f0;flex-wrap:wrap}
.red{color:#c62828}.grn{color:#2e7d32}
@media(max-width:768px){.sr,.ub{grid-template-columns:repeat(2,1fr)}}`]})
export class UnderwritingComponent implements OnInit{
  private api=inject(ApiService);queue=signal<any[]>([]);pending=signal(0);approved=signal(0);declined=signal(0);auto=signal(0);
  ngOnInit(){this.api.getUWQueue().subscribe(q=>{this.queue.set(q);this.pending.set(q.filter((x:any)=>x.status==='PENDING_REVIEW').length);this.approved.set(q.filter((x:any)=>['AUTO_APPROVED','APPROVED_WITH_LOADING'].includes(x.status)).length);this.declined.set(q.filter((x:any)=>x.status==='DECLINED').length);this.auto.set(q.filter((x:any)=>x.status==='AUTO_APPROVED').length);});}
  stl(s:string){const m:any={PENDING_REVIEW:'Chờ duyệt',AUTO_APPROVED:'Auto duyệt',APPROVED_WITH_LOADING:'Duyệt+Phụ phí',DECLINED:'Từ chối',MEDICAL_REQUIRED:'Cần khám'};return m[s]||s;}
  rsc(s:number){return s>70?'red':s>40?'':'grn';}
}