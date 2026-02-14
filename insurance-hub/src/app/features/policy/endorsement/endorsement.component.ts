import{Component,inject}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{FormBuilder,ReactiveFormsModule,Validators}from'@angular/forms';import{MatCardModule}from'@angular/material/card';import{MatFormFieldModule}from'@angular/material/form-field';import{MatInputModule}from'@angular/material/input';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatSelectModule}from'@angular/material/select';import{MatSnackBar,MatSnackBarModule}from'@angular/material/snack-bar';
@Component({selector:'app-endorsement',standalone:true,imports:[CommonModule,RouterModule,ReactiveFormsModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule,MatSelectModule,MatSnackBarModule],
template:`<div><section class="ph"><h1>Thay đổi hợp đồng (Endorsement)</h1></section><div class="ctn"><mat-card class="fc">
<form [formGroup]="f" (ngSubmit)="go()">
<mat-form-field appearance="outline" class="fw"><mat-label>Chọn hợp đồng</mat-label><mat-select formControlName="policyId">
<mat-option value="POL01">IH-2024-HEALTH-00001 - BH Sức khỏe</mat-option><mat-option value="POL02">IH-2024-MOTOR-00001 - BH Xe ô tô</mat-option>
<mat-option value="POL03">IH-2024-LIFE-00001 - BH Nhân thọ</mat-option></mat-select></mat-form-field>
<mat-form-field appearance="outline" class="fw"><mat-label>Loại thay đổi</mat-label><mat-select formControlName="type">
<mat-option value="ADDRESS">Đổi địa chỉ</mat-option><mat-option value="BENEFICIARY">Đổi người thụ hưởng</mat-option>
<mat-option value="PAYMENT_METHOD">Đổi phương thức thanh toán</mat-option><mat-option value="SUM_INSURED">Tăng/giảm STBH</mat-option>
<mat-option value="ADD_RIDER">Thêm quyền lợi bổ sung</mat-option></mat-select></mat-form-field>
<mat-form-field appearance="outline" class="fw"><mat-label>Chi tiết thay đổi</mat-label><textarea matInput formControlName="details" rows="4" placeholder="Mô tả chi tiết nội dung cần thay đổi..."></textarea></mat-form-field>
<div class="up"><mat-icon>cloud_upload</mat-icon><p>Upload tài liệu hỗ trợ (nếu có)</p></div>
<div class="fa"><button mat-stroked-button routerLink="/policies">Hủy</button><button mat-flat-button color="primary" type="submit" [disabled]="f.invalid">Gửi yêu cầu</button></div>
</form></mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:650px;margin:0 auto;padding:28px 24px}.fc{padding:28px!important;border-radius:14px!important}.fw{width:100%}
.up{border:2px dashed #ccc;border-radius:10px;padding:24px;text-align:center;margin:12px 0;cursor:pointer;mat-icon{font-size:32px;width:32px;height:32px;color:#aaa}p{font-size:13px;color:#888;margin-top:4px}}
.fa{display:flex;gap:12px;justify-content:flex-end;margin-top:16px}`]})
export class EndorsementComponent{
  private fb=inject(FormBuilder);private sb=inject(MatSnackBar);
  f=this.fb.group({policyId:['',Validators.required],type:['',Validators.required],details:['',Validators.required]});
  go(){this.sb.open('Yêu cầu thay đổi đã được gửi. Chúng tôi sẽ xử lý trong 24h.','OK',{duration:3000});this.f.reset();}
}