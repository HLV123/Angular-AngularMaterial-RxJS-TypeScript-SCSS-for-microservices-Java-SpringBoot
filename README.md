# Insurance Hub

Hệ thống quản lý bảo hiểm trực tuyến toàn diện — phục vụ 10 nghiệp vụ cốt lõi: Sản phẩm, CRM, Bán hàng, Đại lý, Hợp đồng, Bồi thường, Thanh toán, Thẩm định, Báo cáo, Quản trị hệ thống.

**Frontend** chạy độc lập bằng mock data, sẵn sàng kết nối **13 microservices** backend chỉ bằng 1 dòng config.

```
Tech Stack
├── Frontend:   Angular 18 · Angular Material · RxJS · TypeScript · SCSS
└── Backend:    Java 17 · Spring Boot · PostgreSQL · Keycloak · Apache Kafka
                Redis · MinIO · Prometheus · Grafana · ELK Stack · Kubernetes
```

---

## Tài liệu

```
READ FRONTEND/           Dành cho frontend developer
├── architecture.md        Cấu trúc thư mục, components, routing, services
├── frontend structure.md  Cây file chi tiết khi mở VSCode + lệnh chạy
└── mock data.md           13 tài khoản demo, quan hệ dữ liệu, luồng test

READ BACKEND/            Dành cho backend developer
├── backend structure.md   Cấu trúc 13 microservices, từng file Java
├── api contracts.md       42 endpoints, request/response JSON, status codes
├── database schema.md     ERD, 30 bảng SQL, indexes, constraints
├── kafka events.md        8 topics, 20 event types, producer/consumer mapping
└── keycloak setup.md      Realm, 14 roles, 13 users, MFA, token settings

READ DEPLOY/             Dành cho DevOps / người cài đặt
├── docker compose.md      23 containers, ports, lệnh chạy/dừng
└── environment window.md  Cài đặt toàn bộ môi trường trên Windows
```

---

## Chạy nhanh (chỉ Frontend)

```bash
cd insurance-hub
npm install
npx ng serve
```

Mở http://localhost:4200 — đăng nhập `customer@demo.com` / `Demo@123`. 
