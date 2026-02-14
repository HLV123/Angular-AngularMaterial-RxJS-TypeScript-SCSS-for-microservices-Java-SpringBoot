import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../../core/services/api.service';import{AuthService}from'../../../core/services/auth.service';import{Payment}from'../../../core/models';import{VndPipe,StatusViPipe}from'../../../shared/pipes';
@Component({selector:'app-payment-history',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe,StatusViPipe],
template:`<div><section class="ph"><h1>Lịch sử thanh toán</h1></section><div class="ctn">
<div class="sr"><mat-card class="sc"><mat-icon class="si g">check_circle</mat-icon><div><b>{{succ()}}</b><span>Thành công</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si b">payment</mat-icon><div><b>{{total()|vnd}}</b><span>Tổng đã TT</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si o">hourglass_top</mat-icon><div><b>{{pend()}}</b><span>Chờ TT</span></div></mat-card></div>
<mat-card *ngFor="let p of ps()" class="pc" appearance="outlined">
<div class="pr"><div class="pm" [class]="mi(p.method)"><mat-icon>{{ic(p.method)}}</mat-icon></div>
<div class="pi"><h3>{{p.description}}</h3><p>{{p.policyNumber}} · {{p.transactionId}}</p></div>
<div class="pa"><b [class]="p.status.toLowerCase()">{{p.status==='SUCCESS'?'+':''}}{{p.amount|vnd}}</b><span>{{p.status|statusVi}}</span></div></div>
<div class="pd"><span>Phương thức: <b>{{p.gateway}}</b></span><span>Ngày: <b>{{(p.paidAt||p.createdAt)|date:'dd/MM/yyyy HH:mm'}}</b></span></div>
</mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:900px;margin:0 auto;padding:28px 24px}
.sr{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px}
.sc{display:flex;align-items:center;gap:12px;padding:16px!important;border-radius:10px!important;.si{font-size:26px;width:26px;height:26px;&.g{color:#4CAF50}&.b{color:#2196F3}&.o{color:#FF9800}}b{font-size:18px;display:block}span{font-size:11px;color:#888}}
.pc{border-radius:14px!important;padding:18px!important;margin-bottom:12px}
.pr{display:flex;align-items:center;gap:14px}.pm{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;mat-icon{color:#fff;font-size:20px;width:20px;height:20px}
&.vnpay{background:#1565c0}&.momo{background:#a50064}&.card{background:#FF9800}&.bank{background:#2e7d32}&.zalo{background:#0068FF}&.cash{background:#757575}}
.pi{flex:1;h3{font-size:14px;font-weight:600;margin:0}p{font-size:11px;color:#888;margin:2px 0 0}}
.pa{text-align:right;b{font-size:16px;display:block;&.success{color:#2e7d32}&.pending{color:#FF9800}&.failed{color:#d32f2f}}span{font-size:11px;color:#888}}
.pd{display:flex;gap:20px;margin-top:10px;padding-top:8px;border-top:1px solid #f5f5f5;font-size:12px;color:#888;b{color:#333}}`]})
export class PaymentHistoryComponent implements OnInit{
  private api=inject(ApiService);private auth=inject(AuthService);ps=signal<Payment[]>([]);succ=signal(0);total=signal(0);pend=signal(0);
  ngOnInit(){this.api.getPayments(this.auth.user()?.id).subscribe(p=>{this.ps.set(p);this.succ.set(p.filter(x=>x.status==='SUCCESS').length);this.total.set(p.filter(x=>x.status==='SUCCESS').reduce((s,x)=>s+x.amount,0));this.pend.set(p.filter(x=>x.status==='PENDING').length);});}
  ic(m:string){const i:any={BANK_TRANSFER:'account_balance',CREDIT_CARD:'credit_card',E_WALLET_MOMO:'account_balance_wallet',E_WALLET_VNPAY:'payment',E_WALLET_ZALOPAY:'account_balance_wallet',CASH:'money'};return i[m]||'payment';}
  mi(m:string){const i:any={BANK_TRANSFER:'bank',CREDIT_CARD:'card',E_WALLET_MOMO:'momo',E_WALLET_VNPAY:'vnpay',E_WALLET_ZALOPAY:'zalo',CASH:'cash'};return i[m]||'bank';}
}