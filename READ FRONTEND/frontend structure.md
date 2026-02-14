# Insurance Hub — Angular 18 Frontend
### Cài dependencies
Mở Terminal trong VSCode :

```
npm install
```
### Chạy dev server

```
npx ng serve
```
### Mở trình duyệt

```
http://localhost:4200
```
### Build production

```
npx ng build
```
Demo (mật khẩu tất cả là `Demo@123`):

| Tài khoản | Role |
|---|---|
| customer@demo.com | Khách hàng |
| agent@demo.com | Đại lý |
| admin@demo.com | Quản trị + Super Admin |
| underwriter@demo.com | Thẩm định rủi ro |
| claims@demo.com | Xử lý bồi thường |
| partner@demo.com | Đối tác (BV Vinmec) |
| sales@demo.com | Nhân viên bán hàng |
| cs@demo.com | Chăm sóc khách hàng |
| accountant@demo.com | Kế toán |
| branch@demo.com | Quản lý chi nhánh |
| regional@demo.com | Quản lý vùng |
| pm@demo.com | Quản lý sản phẩm |
| compliance@demo.com | Tuân thủ pháp lý |

## Cấu trúc frontend VSCode

```
insurance-hub/
├── .editorconfig
├── .gitignore
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   └── tasks.json
├── public/
│   └── favicon.ico
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/
│   │   └── images/
│   │       ├── logo.png
│   │       ├── hero-banner.jpg
│   │       ├── health-insurance.jpg
│   │       ├── life-insurance.jpg
│   │       ├── car-insurance.jpg
│   │       ├── home-insurance.jpg
│   │       ├── travel-insurance.jpg
│   │       ├── accident-insurance.jpg
│   │       ├── about-office.jpg
│   │       ├── agent-team.jpg
│   │       └── claims-process.jpg
│   └── app/
│       ├── app.component.ts
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── core/
│       │   ├── models/
│       │   │   └── index.ts
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   ├── api.service.ts
│       │   │   ├── mock-data.service.ts
│       │   │   └── error.service.ts
│       │   ├── guards/
│       │   │   └── auth.guard.ts
│       │   └── interceptors/
│       │       └── auth.interceptor.ts
│       ├── shared/
│       │   ├── pipes/
│       │   │   └── index.ts
│       │   └── components/
│       │       ├── header/
│       │       │   └── header.component.ts
│       │       └── footer/
│       │           └── footer.component.ts
│       └── features/
│           ├── home/
│           │   ├── home.component.ts
│           │   ├── home.component.html
│           │   └── home.component.scss
│           ├── auth/
│           │   ├── login/
│           │   │   └── login.component.ts
│           │   └── register/
│           │       └── register.component.ts
│           ├── products/
│           │   ├── product-list/
│           │   │   └── product-list.component.ts
│           │   └── product-detail/
│           │       └── product-detail.component.ts
│           ├── quote/
│           │   └── quote.component.ts
│           ├── policy/
│           │   ├── policy-list/
│           │   │   └── policy-list.component.ts
│           │   ├── policy-detail/
│           │   │   └── policy-detail.component.ts
│           │   ├── endorsement/
│           │   │   └── endorsement.component.ts
│           │   └── renewal/
│           │       └── renewal.component.ts
│           ├── claims/
│           │   ├── claim-list/
│           │   │   └── claim-list.component.ts
│           │   ├── claim-detail/
│           │   │   └── claim-detail.component.ts
│           │   └── claim-submit/
│           │       └── claim-submit.component.ts
│           ├── claims-handler/
│           │   └── claims-handler.component.ts
│           ├── payment/
│           │   ├── payment-history/
│           │   │   └── payment-history.component.ts
│           │   └── schedule/
│           │       └── payment-schedule.component.ts
│           ├── customer/
│           │   ├── profile/
│           │   │   └── profile.component.ts
│           │   └── customer-360/
│           │       └── customer-360.component.ts
│           ├── notifications/
│           │   └── notifications.component.ts
│           ├── agent/
│           │   ├── dashboard/
│           │   │   └── agent-dashboard.component.ts
│           │   ├── clients/
│           │   │   └── agent-clients.component.ts
│           │   ├── leads/
│           │   │   └── agent-leads.component.ts
│           │   ├── commission/
│           │   │   └── agent-commission.component.ts
│           │   └── leaderboard/
│           │       └── agent-leaderboard.component.ts
│           ├── underwriting/
│           │   └── underwriting.component.ts
│           ├── partner/
│           │   ├── dashboard/
│           │   │   └── partner-dashboard.component.ts
│           │   └── direct-billing/
│           │       └── direct-billing.component.ts
│           ├── admin/
│           │   ├── dashboard/
│           │   │   └── admin-dashboard.component.ts
│           │   ├── user-management/
│           │   │   └── user-management.component.ts
│           │   ├── product-management/
│           │   │   └── product-management.component.ts
│           │   ├── policy-management/
│           │   │   └── policy-management.component.ts
│           │   ├── claims-management/
│           │   │   └── claims-management.component.ts
│           │   ├── agent-management/
│           │   │   └── agent-management.component.ts
│           │   ├── partner-management/
│           │   │   └── partner-management.component.ts
│           │   ├── reports/
│           │   │   └── admin-reports.component.ts
│           │   ├── audit-log/
│           │   │   └── audit-log.component.ts
│           │   ├── system-config/
│           │   │   └── system-config.component.ts
│           │   └── monitoring/
│           │       └── monitoring.component.ts
│           ├── about/
│           │   └── about.component.ts
│           └── contact/
│               └── contact.component.ts
```
--> **53 file TypeScript**, **11 ảnh**, **2 file environment**.

---

npm install --> folder `node_modules/` được sinh ra (~307 MB, ~900 packages)
npx ng serve --> folder `.angular/` được sinh ra (build cache):
npx ng build --> folder `dist/` được sinh ra
Folder `dist/insurance-hub/browser/` chính là bản build tĩnh, có thể deploy lên Nginx, S3, hoặc bất kỳ static hosting nào.

```
insurance-hub/
├── node_modules/           ← MỚI — sinh ra bởi npm install
│   └── ... (~900 thư mục)
```

```
insurance-hub/
├── .angular/               ← MỚI — Angular build cache
│   └── cache/
│       └── 18.2.x/
│           └── ... (cache files)
```

```
insurance-hub/
├── dist/                   ← MỚI — sinh ra bởi ng build
│   └── insurance-hub/
│       ├── 3rdpartylicenses.txt
│       └── browser/
│           ├── index.html
│           ├── main-XXXXXXXX.js
│           ├── polyfills-XXXXXXXX.js
│           ├── styles-XXXXXXXX.css
│           ├── chunk-XXXXXXXX.js      (x63 lazy-loaded chunks)
│           ├── favicon.ico
│           └── assets/
│               └── images/
│                   ├── logo.png
│                   └── ... (11 ảnh)
```

---
