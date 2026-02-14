## Tương thích với Backend

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (project này)                                 │
│  Angular 18 + Angular Material                          │
│  http://localhost:4200                                   │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │ AuthService │  │ ApiService  │  │ Auth           │  │
│  │             │  │             │  │ Interceptor    │  │
│  │ Keycloak    │  │ HTTP calls  │  │                │  │
│  │ login/      │  │ REST API    │  │ JWT Bearer     │  │
│  │ logout/     │  │ Observable  │  │ 401 redirect   │  │
│  │ refresh     │  │ <T> typed   │  │ 403 handling   │  │
│  └──────┬──────┘  └──────┬──────┘  └───────┬────────┘  │
│         │                │                  │           │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
          ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│  BACKEND (chưa có — cần develop riêng)                  │
│                                                         │
│  ┌──────────────┐  ┌────────────────────────────────┐   │
│  │   Keycloak   │  │     Spring Boot API Gateway    │   │
│  │   :8180      │  │     :8080/api/v1               │   │
│  │              │  │                                 │   │
│  │  - SSO       │  │  /products      GET POST PUT   │   │
│  │  - JWT       │  │  /policies      GET POST PUT   │   │
│  │  - MFA       │  │  /claims        GET POST PUT   │   │
│  │  - Realm:    │  │  /payments      GET POST       │   │
│  │    insurance │  │  /agents        GET             │   │
│  │    -hub      │  │  /underwriting  GET POST       │   │
│  └──────────────┘  │  /partners      GET             │   │
│                    │  /customers     GET PUT          │   │
│  ┌──────────────┐  │  /notifications GET PUT         │   │
│  │   Kafka      │  │  /admin/*       GET POST PUT    │   │
│  │   :9092      │  └────────────────────────────────┘   │
│  │              │                                       │
│  │  WebSocket   │  ┌──────────┐  ┌──────────┐          │
│  │  :8085/ws    │  │PostgreSQL│  │  Redis   │          │
│  └──────────────┘  │  :5432   │  │  :6379   │          │
│                    └──────────┘  └──────────┘          │
│  ┌──────────────┐  ┌──────────────────────┐            │
│  │  Prometheus  │  │  ELK Stack           │            │
│  │  + Grafana   │  │  Elasticsearch       │            │
│  │  :9090/:3000 │  │  Logstash + Kibana   │            │
│  └──────────────┘  └──────────────────────┘            │
└─────────────────────────────────────────────────────────┘
```
### Cơ chế chuyển đổi Mock ↔ Real Backend
File `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  keycloakUrl: 'http://localhost:8180',
  keycloakRealm: 'insurance-hub',
  keycloakClientId: 'insurance-hub-frontend',
  kafkaWebSocket: 'ws://localhost:8085/ws',
  useMockData: true       // ← true = dùng mock data, false = gọi backend thật
};
```
Hiện tại `useMockData: true` — toàn bộ data nằm trong `mock-data.service.ts`, frontend chạy độc lập không cần backend.
Khi backend sẵn sàng, chỉ cần đổi `useMockData: false`, `ApiService` sẽ chuyển từ `of(mockData).pipe(delay())` sang `this.http.get<T>(apiUrl + '/endpoint')`.
### Mapping Frontend → Backend API
Mỗi method trong `api.service.ts` tương ứng 1:1 với endpoint REST backend cần implement:

```
Frontend ApiService method        Backend REST endpoint
──────────────────────────────    ───────────────────────────────────
login(creds)                   →  POST   /api/v1/auth/login
logout()                       →  POST   /api/v1/auth/logout

getProducts()                  →  GET    /api/v1/products
getProductById(id)             →  GET    /api/v1/products/:id
getFeaturedProducts()          →  GET    /api/v1/products/featured

createQuote(data)              →  POST   /api/v1/quotes
getPolicies(customerId?)       →  GET    /api/v1/policies?customerId=
getPolicyById(id)              →  GET    /api/v1/policies/:id
createPolicy(data)             →  POST   /api/v1/policies
updatePolicy(id, data)         →  PUT    /api/v1/policies/:id
deletePolicy(id)               →  DELETE /api/v1/policies/:id
renewPolicy(id)                →  POST   /api/v1/policies/:id/renew
endorsePolicy(id, data)        →  POST   /api/v1/policies/:id/endorse
cancelPolicy(id, reason)       →  POST   /api/v1/policies/:id/cancel

getClaims(customerId?)         →  GET    /api/v1/claims?customerId=
getClaimById(id)               →  GET    /api/v1/claims/:id
submitClaim(data)              →  POST   /api/v1/claims
approveClaim(id, decision)     →  POST   /api/v1/claims/:id/approve
rejectClaim(id, reason)        →  POST   /api/v1/claims/:id/reject
requestClaimInfo(id, msg)      →  POST   /api/v1/claims/:id/request-info

getPayments(customerId?)       →  GET    /api/v1/payments?customerId=
getPaymentSchedule()           →  GET    /api/v1/payments/schedule
processPayment(data)           →  POST   /api/v1/payments/initiate
refundPayment(id)              →  POST   /api/v1/payments/:id/refund

getAgents()                    →  GET    /api/v1/agents
getCommissions(agentId?)       →  GET    /api/v1/agents/:id/commissions
getLeads()                     →  GET    /api/v1/agents/leads
createLead(data)               →  POST   /api/v1/agents/leads
updateLead(id, data)           →  PUT    /api/v1/agents/leads/:id

getUWQueue()                   →  GET    /api/v1/underwriting/queue
approveUnderwriting(id, data)  →  POST   /api/v1/underwriting/:id/approve
declineUnderwriting(id, data)  →  POST   /api/v1/underwriting/:id/decline

getPartners()                  →  GET    /api/v1/partners
getCustomer360()               →  GET    /api/v1/customers/:id/360
updateCustomerProfile(id,data) →  PUT    /api/v1/customers/:id
submitKYC(id, data)            →  POST   /api/v1/customers/:id/kyc
exportCustomerData(id)         →  GET    /api/v1/customers/:id/export

getNotifications(userId)       →  GET    /api/v1/notifications
markAsRead(id)                 →  PUT    /api/v1/notifications/:id/mark-read
markAllAsRead(userId)          →  PUT    /api/v1/notifications/mark-all-read

getDashboardStats()            →  GET    /api/v1/admin/dashboard/stats
getAllUsers()                   →  GET    /api/v1/admin/users
createUser(data)               →  POST   /api/v1/admin/users
updateUser(id, data)           →  PUT    /api/v1/admin/users/:id
deleteUser(id)                 →  DELETE /api/v1/admin/users/:id
getAuditLogs()                 →  GET    /api/v1/admin/audit-logs
```
### Keycloak Integration
Frontend đã cấu hình sẵn Keycloak realm `insurance-hub` với client `insurance-hub-frontend`. Auth interceptor tự động:

- Gắn header `Authorization: Bearer <JWT>` vào mọi request
- Redirect về `/login` khi nhận 401 (token hết hạn)
- Hiển thị thông báo lỗi khi nhận 403 (không có quyền)

Backend chỉ cần validate JWT token từ cùng Keycloak instance.
### Kafka WebSocket
Frontend đã cấu hình endpoint `ws://localhost:8085/ws` cho real-time notifications. 
Khi backend publish event lên Kafka topic (ví dụ `notification.push.send`), WebSocket gateway forward xuống browser để cập nhật badge thông báo và hiển thị toast.
### Data Models đồng bộ
Tất cả TypeScript interfaces trong `core/models/index.ts` phản ánh trực tiếp các entity trong database:

```
TypeScript Interface    Java Entity (Backend)     DB Table
────────────────────    ─────────────────────     ──────────────
User                 →  UserEntity             →  users
Product              →  ProductEntity          →  products
ProductPlan          →  ProductPlanEntity      →  product_plans
Policy               →  PolicyEntity           →  policies
Beneficiary          →  BeneficiaryEntity      →  beneficiaries
Endorsement          →  EndorsementEntity      →  endorsements
Claim                →  ClaimEntity            →  claims
ClaimDocument        →  ClaimDocumentEntity    →  claim_documents
ClaimTimeline        →  ClaimTimelineEntity    →  claim_timeline
Payment              →  PaymentEntity          →  payments
Agent                →  AgentEntity            →  agents
Commission           →  CommissionEntity       →  commissions
Partner              →  PartnerEntity          →  partners
Notification         →  NotificationEntity     →  notifications
AuditLog             →  AuditLogEntity         →  audit_logs
```
Enum values (PolicyStatus, ClaimStatus, PaymentMethod, UserRole, ProductCategory) cũng khớp 1:1 giữa frontend và backend.