import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{AuthService}from'../../../core/services/auth.service';import{VndPipe}from'../../../shared/pipes';
@Component({selector:'app-partner-dashboard',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatButtonModule,MatIconModule,VndPipe],
template:`<div><section class="ph"><h1>Portal Đối tác</h1><p>BV Vinmec Central Park</p></section><div class="ctn">
<div class="sr"><mat-card class="sc"><mat-icon class="si b">assignment</mat-icon><div><b>1,250</b><span>Claims xử lý</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si g">check_circle</mat-icon><div><b>1,180</b><span>Đã duyệt</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si p">payment</mat-icon><div><b>{{15800000000|vnd}}</b><span>Tổng billing</span></div></mat-card>
<mat-card class="sc"><mat-icon class="si o">speed</mat-icon><div><b>4.2 ngày</b><span>TB xử lý</span></div></mat-card></div>
<div class="rg"><mat-card class="rc"><h3>Tra cứu quyền lợi</h3><p>Nhập mã HĐ hoặc tên KH để kiểm tra quyền lợi bảo hiểm và giới hạn bồi thường.</p>
<div class="sf"><input placeholder="Mã HĐ hoặc tên KH..."/><button>Tra cứu</button></div></mat-card>
<mat-card class="rc"><h3>Claims gần đây</h3>
<div class="ci" *ngFor="let c of recentClaims"><div><b>{{c.claimNum}}</b><span>{{c.patient}} · {{c.desc}}</span></div><div class="ca"><b>{{c.amount}}</b><span class="cs" [class]="c.st">{{c.stl}}</span></div></div>
</mat-card></div><mat-card class="rc" style="margin-top:16px"><h3>Dịch vụ Direct Billing</h3>
<p style="color:#666;font-size:13px">Đối tác Tier 1 - Hỗ trợ bảo lãnh viện phí. KH chỉ cần xuất trình thẻ BH, BV làm việc trực tiếp với Insurance Hub.</p>
<div class="specs"><span *ngFor="let s of specs"><mat-icon>check</mat-icon>{{s}}</span></div></mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:40px 24px;text-align:center;h1{font-size:28px;font-weight:700}p{opacity:.9}}
.ctn{max-width:1200px;margin:0 auto;padding:24px}
.sr{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
.sc{display:flex;align-items:center;gap:12px;padding:18px!important;border-radius:10px!important;.si{font-size:26px;width:26px;height:26px;&.b{color:#2196F3}&.g{color:#4CAF50}&.p{color:#9C27B0}&.o{color:#FF9800}}b{font-size:18px;display:block}span{font-size:11px;color:#888}}
.rg{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.rc{padding:20px!important;border-radius:14px!important;h3{font-size:15px;font-weight:600;margin-bottom:12px;color:#1565c0}}
.sf{display:flex;gap:8px;margin-top:12px;input{flex:1;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px}button{padding:10px 20px;background:#1565c0;color:#fff;border:none;border-radius:8px;cursor:pointer}}
.ci{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f5f5f5;b{display:block;font-size:13px}span{font-size:11px;color:#888;display:block}
.ca{text-align:right;.cs{padding:2px 8px;border-radius:10px;font-size:10px;&.approved{background:#e8f5e9;color:#2e7d32}&.pending{background:#fff3e0;color:#e65100}}}}
.specs{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;span{display:flex;align-items:center;gap:4px;font-size:13px;color:#2e7d32;mat-icon{font-size:16px;width:16px;height:16px}}}
@media(max-width:960px){.sr{grid-template-columns:repeat(2,1fr)}.rg{grid-template-columns:1fr}}`]})
export class PartnerDashboardComponent{
  auth=inject(AuthService);
  recentClaims=[{claimNum:'CLM-9001',patient:'Nguyễn Văn An',desc:'Khám ngoại trú',amount:'2.5 triệu',st:'approved',stl:'Đã duyệt'},{claimNum:'CLM-9015',patient:'Trần Thị B',desc:'Nội trú 2 ngày',amount:'18 triệu',st:'pending',stl:'Đang duyệt'},{claimNum:'CLM-9022',patient:'Lê Văn C',desc:'Phẫu thuật',amount:'45 triệu',st:'approved',stl:'Đã duyệt'}];
  specs=['Nội khoa','Ngoại khoa','Tim mạch','Ung bướu','Sản khoa','Nhi khoa','Mắt','Răng hàm mặt'];
}