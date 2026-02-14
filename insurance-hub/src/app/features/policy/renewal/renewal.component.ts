import{Component}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{VndPipe}from'../../../shared/pipes';
@Component({selector:'app-renewal',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe],
template:`<div><section class="ph"><h1>Gia hạn hợp đồng</h1></section><div class="ctn">
<mat-card *ngFor="let r of renewals" class="rc" appearance="outlined">
<div class="rr"><mat-icon class="ri" [class]="r.urgency">{{r.urgency==='urgent'?'warning':'autorenew'}}</mat-icon>
<div class="rinfo"><h3>{{r.policyNumber}}</h3><p>{{r.productName}} · {{r.planName}}</p></div>
<div class="rd"><b>{{r.premium|vnd}}/năm</b><span>Hết hạn: {{r.endDate}}</span><span class="ru" [class]="r.urgency">{{r.label}}</span></div>
<button mat-flat-button color="primary"><mat-icon>autorenew</mat-icon>Gia hạn</button></div>
</mat-card>
<mat-card class="note"><mat-icon>info</mat-icon><div><h4>Gia hạn tự động</h4><p>HĐ có thiết lập auto-renewal sẽ tự động gia hạn 30 ngày trước hết hạn. Phí được trừ từ phương thức TT đã đăng ký.</p></div></mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:900px;margin:0 auto;padding:28px 24px}
.rc{border-radius:12px!important;padding:18px!important;margin-bottom:12px}
.rr{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.ri{font-size:28px;width:28px;height:28px;&.urgent{color:#F44336}&.normal{color:#FF9800}&.far{color:#4CAF50}}
.rinfo{flex:1;h3{font-size:14px;font-weight:600;margin:0}p{font-size:12px;color:#888;margin:0}}
.rd{text-align:right;margin-right:12px;b{display:block;font-size:15px;color:#1565c0}span{display:block;font-size:12px;color:#888}.ru{font-size:11px;font-weight:600;&.urgent{color:#c62828}&.normal{color:#e65100}&.far{color:#2e7d32}}}
.note{display:flex;gap:14px;padding:18px!important;border-radius:12px!important;margin-top:20px;background:#e3f2fd;mat-icon{color:#1565c0;font-size:24px;width:24px;height:24px;flex-shrink:0}h4{font-size:14px;margin:0 0 4px;color:#1565c0}p{font-size:13px;color:#555;margin:0}}`]})
export class RenewalComponent{
  renewals=[
    {policyNumber:'IH-2024-MOTOR-00001',productName:'BH Xe ô tô',planName:'Toàn diện Silver',premium:8000000,endDate:'2025-01-15',urgency:'normal',label:'Còn 7 tháng'},
    {policyNumber:'IH-2024-ACC-00001',productName:'BH Tai nạn 24/7',planName:'Nâng cao',premium:1500000,endDate:'2025-02-01',urgency:'far',label:'Còn 8 tháng'},
    {policyNumber:'IH-2024-HEALTH-00001',productName:'BH Sức khỏe',planName:'Silver',premium:12000000,endDate:'2025-03-01',urgency:'far',label:'Còn 9 tháng'}
  ];
}