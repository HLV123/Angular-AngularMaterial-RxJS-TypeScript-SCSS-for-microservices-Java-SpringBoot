import{Component,inject,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule,Router}from'@angular/router';import{FormBuilder,ReactiveFormsModule,Validators}from'@angular/forms';import{MatCardModule}from'@angular/material/card';import{MatFormFieldModule}from'@angular/material/form-field';import{MatInputModule}from'@angular/material/input';import{MatButtonModule}from'@angular/material/button';import{MatIconModule}from'@angular/material/icon';import{MatSelectModule}from'@angular/material/select';import{MatSnackBar,MatSnackBarModule}from'@angular/material/snack-bar';import{ApiService}from'../../../core/services/api.service';
@Component({selector:'app-claim-submit',standalone:true,imports:[CommonModule,RouterModule,ReactiveFormsModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule,MatSelectModule,MatSnackBarModule],
template:`<div><section class="ph"><h1>Nộp yêu cầu bồi thường</h1></section>
<div class="ctn"><mat-card class="fc"><form [formGroup]="f" (ngSubmit)="go()">
<mat-form-field appearance="outline" class="fw"><mat-label>Chọn hợp đồng</mat-label><mat-select formControlName="policyId">
<mat-option value="POL01">IH-2024-HEALTH-00001 - BH Sức khỏe</mat-option><mat-option value="POL02">IH-2024-MOTOR-00001 - BH Xe ô tô</mat-option>
<mat-option value="POL03">IH-2024-LIFE-00001 - BH Nhân thọ</mat-option><mat-option value="POL05">IH-2024-ACC-00001 - BH Tai nạn</mat-option></mat-select></mat-form-field>
<mat-form-field appearance="outline" class="fw"><mat-label>Loại bồi thường</mat-label><mat-select formControlName="type">
<mat-option value="OUTPATIENT">Ngoại trú</mat-option><mat-option value="INPATIENT">Nội trú</mat-option><mat-option value="SURGERY">Phẫu thuật</mat-option>
<mat-option value="VEHICLE_DAMAGE">Thiệt hại xe</mat-option><mat-option value="ACCIDENT">Tai nạn</mat-option></mat-select></mat-form-field>
<div class="fr"><mat-form-field appearance="outline"><mat-label>Ngày xảy ra</mat-label><input matInput formControlName="incidentDate" type="date"/></mat-form-field>
<mat-form-field appearance="outline"><mat-label>Số tiền yêu cầu (VND)</mat-label><input matInput formControlName="amount" type="number"/></mat-form-field></div>
<mat-form-field appearance="outline" class="fw"><mat-label>Mô tả chi tiết</mat-label><textarea matInput formControlName="description" rows="4"></textarea></mat-form-field>
<mat-form-field appearance="outline" class="fw"><mat-label>Ngân hàng nhận tiền</mat-label><input matInput formControlName="bankName"/></mat-form-field>
<mat-form-field appearance="outline" class="fw"><mat-label>Số tài khoản</mat-label><input matInput formControlName="accountNumber"/></mat-form-field>
<div class="up"><mat-icon>cloud_upload</mat-icon><p>Kéo thả hoặc click để upload tài liệu (hóa đơn, giấy chẩn đoán, ảnh...)</p></div>
<div class="fa"><button mat-stroked-button routerLink="/claims">Hủy</button><button mat-flat-button color="primary" type="submit" [disabled]="f.invalid">Nộp yêu cầu</button></div>
</form></mat-card></div></div>`,
styles:[`.ph{background:linear-gradient(135deg,#1565c0,#0d47a1);color:#fff;padding:44px 24px;text-align:center;h1{font-size:28px;font-weight:700}}
.ctn{max-width:700px;margin:0 auto;padding:28px 24px}.fc{padding:28px!important;border-radius:14px!important}.fw{width:100%}.fr{display:flex;gap:12px;mat-form-field{flex:1}}
.up{border:2px dashed #ccc;border-radius:10px;padding:28px;text-align:center;margin:12px 0;cursor:pointer;mat-icon{font-size:36px;width:36px;height:36px;color:#aaa}p{font-size:13px;color:#888;margin-top:6px}}
.fa{display:flex;gap:12px;justify-content:flex-end;margin-top:16px}`]})
export class ClaimSubmitComponent{
  private fb=inject(FormBuilder);private api=inject(ApiService);private router=inject(Router);private sb=inject(MatSnackBar);
  f=this.fb.group({policyId:['',Validators.required],type:['',Validators.required],incidentDate:['',Validators.required],amount:['',Validators.required],description:['',Validators.required],bankName:['Vietcombank'],accountNumber:['']});
  go(){this.api.submitClaim(this.f.value).subscribe(r=>{this.sb.open('Đã nộp: '+r.claimNumber,'OK',{duration:3000});this.router.navigate(['/claims']);});}
}