import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{VndPipe}from'../../../shared/pipes';
@Component({selector:'app-payment-schedule',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe],
template:`<div><section class="ph"><h1>Lịch thanh toán</h1></section><div class="ctn">
<mat-card *ngFor="let p of ps()" class="pc" [class.overdue]="p.status==='OVERDUE'" appearance="outlined">
<div class="pr"><mat-icon class="pi" [class]="p.status.toLowerCase()">{{p.status==='OVERDUE'?'warning':'event'}}</mat-icon>
<div class="pinfo"><h3>{{p.productName}}</h3><p>{{p.policyNumber}}</p></div>
<div class="pa"><b>{{p.premium|vnd}}</b><span>{{p.dueDate}}</span><span class="ps" [class]="p.status.toLowerCase()">{{p.status==='OVERDUE'?'Quá hạn '+(-p.daysUntil)+' ngày':'Còn '+p.daysUntil+' ngày'}}</span></div>
<button mat-flat-button color="primary" *ngIf="p.status==='OVERDUE'">Thanh toán ngay</button></div>
</mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:800px;margin:0 auto;padding:28px 24px}
.pc{border-radius:12px!important;padding:18px!important;margin-bottom:12px;&.overdue{border-left:4px solid #F44336;background:#fff8f8}}
.pr{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.pi{font-size:28px;width:28px;height:28px;&.overdue{color:#F44336}&.upcoming{color:#1565c0}}
.pinfo{flex:1;h3{font-size:14px;font-weight:600;margin:0}p{font-size:12px;color:#888;margin:0}}
.pa{text-align:right;margin-right:12px;b{display:block;font-size:16px;color:#1565c0}span{display:block;font-size:12px;color:#888}
.ps{font-size:11px;font-weight:600;&.overdue{color:#c62828}&.upcoming{color:#2e7d32}}}`]})
export class PaymentScheduleComponent implements OnInit{
  private api=inject(ApiService);ps=signal<any[]>([]);
  ngOnInit(){this.api.getPaymentSchedule().subscribe(p=>this.ps.set(p));}
}