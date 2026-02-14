import{Component}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatFormFieldModule}from'@angular/material/form-field';import{MatInputModule}from'@angular/material/input';import{VndPipe}from'../../../shared/pipes';
@Component({selector:'app-direct-billing',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,MatFormFieldModule,MatInputModule,VndPipe],
template:`<div><section class="ph"><h1>Direct Billing (Bảo lãnh viện phí)</h1></section><div class="ctn">
<div class="nav"><a routerLink="/partner"><mat-icon>dashboard</mat-icon>Dashboard</a><a routerLink="/partner/direct-billing" class="act"><mat-icon>local_hospital</mat-icon>Direct Billing</a></div>
<mat-card class="sc"><h3>Tra cứu quyền lợi bệnh nhân</h3>
<div class="sf"><mat-form-field appearance="outline"><mat-label>Mã HĐ / Tên KH / CCCD</mat-label><input matInput/></mat-form-field>
<button mat-flat-button color="primary"><mat-icon>search</mat-icon>Tra cứu</button></div></mat-card>
<mat-card class="rc"><h3>Kết quả mẫu: Nguyễn Văn An</h3>
<div class="rg"><div class="ri"><span>Mã HĐ</span><b>IH-2024-HEALTH-00001</b></div><div class="ri"><span>Gói</span><b>Silver</b></div>
<div class="ri"><span>STBH</span><b>{{300000000|vnd}}</b></div><div class="ri"><span>Trạng thái</span><b class="g">ACTIVE</b></div>
<div class="ri"><span>Nội trú</span><b>300 triệu/năm</b></div><div class="ri"><span>Ngoại trú</span><b>30 triệu/năm</b></div>
<div class="ri"><span>Đã sử dụng</span><b>{{24200000|vnd}}</b></div><div class="ri"><span>Còn lại</span><b class="b">{{275800000|vnd}}</b></div></div>
<div class="act"><button mat-flat-button color="primary"><mat-icon>check</mat-icon>Xác nhận bảo lãnh</button><button mat-stroked-button><mat-icon>print</mat-icon>In xác nhận</button></div></mat-card>
<h3 class="sh">Giao dịch Direct Billing gần đây</h3>
<mat-card *ngFor="let t of txs" class="tc" appearance="outlined">
<div class="tr"><div><b>{{t.patient}}</b><span>{{t.service}} · {{t.date}}</span></div><div class="ta"><b>{{t.amount}}</b><span class="ts" [class]="t.st">{{t.stl}}</span></div></div>
</mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:900px;margin:0 auto;padding:24px}
.nav{display:flex;gap:6px;margin-bottom:20px;a{display:flex;align-items:center;gap:6px;padding:8px 16px;text-decoration:none;color:#666;border-radius:8px;font-size:13px;background:#f5f5f5;&.act{background:#1565c0;color:#fff}mat-icon{font-size:18px;width:18px;height:18px}}}
.sc{padding:24px!important;border-radius:14px!important;margin-bottom:20px;h3{font-size:16px;font-weight:600;margin-bottom:12px;color:#1565c0}}
.sf{display:flex;gap:10px;align-items:center;mat-form-field{flex:1}}
.rc{padding:24px!important;border-radius:14px!important;margin-bottom:20px;h3{font-size:16px;font-weight:600;margin-bottom:14px;color:#1565c0}}
.rg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;.ri{background:#f8fafc;padding:10px;border-radius:6px;span{font-size:11px;color:#888;display:block}b{font-size:13px;&.g{color:#2e7d32}&.b{color:#1565c0}}}}
.act{display:flex;gap:10px}.sh{font-size:15px;font-weight:600;margin-bottom:12px}
.tc{border-radius:10px!important;padding:14px!important;margin-bottom:8px}.tr{display:flex;justify-content:space-between;align-items:center;b{display:block;font-size:13px}span{font-size:11px;color:#888;display:block}
.ta{text-align:right;.ts{padding:2px 8px;border-radius:10px;font-weight:600;&.ok{background:#e8f5e9;color:#2e7d32}&.pend{background:#fff3e0;color:#e65100}}}}
@media(max-width:768px){.rg{grid-template-columns:repeat(2,1fr)}}`]})
export class DirectBillingComponent{
  txs=[
    {patient:'Nguyễn Văn An',service:'Khám ngoại trú - Viêm họng',date:'20/05/2024',amount:'2.5 triệu',st:'ok',stl:'Đã TT'},
    {patient:'Trần Thị Bé',service:'Nội trú 2 ngày - Viêm phổi',date:'15/06/2024',amount:'18 triệu',st:'pend',stl:'Chờ duyệt'},
    {patient:'Lê Văn C',service:'Phẫu thuật - Ruột thừa',date:'10/06/2024',amount:'45 triệu',st:'ok',stl:'Đã TT'},
    {patient:'Phạm Thị D',service:'Khám ngoại trú - Dị ứng',date:'08/06/2024',amount:'1.2 triệu',st:'ok',stl:'Đã TT'}
  ];
}