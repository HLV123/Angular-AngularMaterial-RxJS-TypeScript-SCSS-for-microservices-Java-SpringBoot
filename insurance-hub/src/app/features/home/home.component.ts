import{Component,inject,OnInit,signal}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatButtonModule}from'@angular/material/button';import{MatCardModule}from'@angular/material/card';import{MatIconModule}from'@angular/material/icon';import{ApiService}from'../../core/services/api.service';import{Product}from'../../core/models';import{VndPipe}from'../../shared/pipes';
@Component({selector:'app-home',standalone:true,imports:[CommonModule,RouterModule,MatButtonModule,MatCardModule,MatIconModule,VndPipe],templateUrl:'./home.component.html',styleUrl:'./home.component.scss'})
export class HomeComponent implements OnInit{
  private api=inject(ApiService);fp=signal<Product[]>([]);
  cats=[
    {code:'HEALTH',name:'BH Sức khỏe',desc:'Nội trú, ngoại trú, bệnh hiểm nghèo',icon:'local_hospital',img:'assets/images/health-insurance.jpg',from:5000000},
    {code:'LIFE',name:'BH Nhân thọ',desc:'Bảo vệ gia đình, tích lũy dài hạn',icon:'favorite',img:'assets/images/life-insurance.jpg',from:8500000},
    {code:'MOTOR',name:'BH Xe cơ giới',desc:'TNDS, vật chất xe, 500+ gara',icon:'directions_car',img:'assets/images/car-insurance.jpg',from:1200000},
    {code:'PROPERTY',name:'BH Tài sản',desc:'Cháy nổ, thiên tai, trộm cắp',icon:'home',img:'assets/images/home-insurance.jpg',from:500000},
    {code:'TRAVEL',name:'BH Du lịch',desc:'Đồng hành mọi chuyến đi',icon:'flight',img:'assets/images/travel-insurance.jpg',from:50000},
    {code:'ACCIDENT',name:'BH Tai nạn',desc:'Bảo vệ 24/7, phí hợp lý',icon:'health_and_safety',img:'assets/images/accident-insurance.jpg',from:500000}
  ];
  why=[
    {icon:'speed',title:'Nhanh chóng',desc:'Mua online 10 phút, phát hành tức thì',bg:'linear-gradient(135deg,#e3f2fd,#bbdefb)'},
    {icon:'verified',title:'Minh bạch',desc:'Thông tin rõ ràng, không phí ẩn',bg:'linear-gradient(135deg,#e8f5e9,#c8e6c9)'},
    {icon:'security',title:'Bảo mật',desc:'Mã hóa AES-256, chuẩn quốc tế',bg:'linear-gradient(135deg,#fff3e0,#ffe0b2)'},
    {icon:'support_agent',title:'Hỗ trợ 24/7',desc:'Đội ngũ tư vấn chuyên nghiệp',bg:'linear-gradient(135deg,#fce4ec,#f8bbd0)'},
    {icon:'flash_on',title:'Bồi thường nhanh',desc:'Trung bình 5 ngày, auto-approve',bg:'linear-gradient(135deg,#e8eaf6,#c5cae9)'},
    {icon:'devices',title:'Đa nền tảng',desc:'Web, mobile, mọi lúc mọi nơi',bg:'linear-gradient(135deg,#e0f7fa,#b2ebf2)'}
  ];
  steps=[
    {n:'01',title:'Chọn sản phẩm',desc:'Duyệt và so sánh sản phẩm',icon:'search'},
    {n:'02',title:'Nhận báo giá',desc:'Báo giá phí tức thì',icon:'calculate'},
    {n:'03',title:'Thanh toán',desc:'VNPay, Momo, thẻ tín dụng',icon:'payment'},
    {n:'04',title:'Nhận hợp đồng',desc:'HĐ điện tử qua email',icon:'description'}
  ];
  ngOnInit(){this.api.getFeaturedProducts().subscribe(p=>this.fp.set(p));}
  catColor(c:string){const m:any={HEALTH:'#4CAF50',LIFE:'#2196F3',MOTOR:'#FF9800',PROPERTY:'#9C27B0',TRAVEL:'#00BCD4',ACCIDENT:'#F44336'};return m[c]||'#1976d2';}
}