# Keycloak Setup — Insurance Hub

## Tổng quan

```
Keycloak Server:     http://localhost:8180
Admin Console:       http://localhost:8180/admin
Admin Account:       admin / admin
Realm:               insurance-hub
Frontend Client:     insurance-hub-frontend
Backend Client:      insurance-hub-backend
```

---

## Bước 1 — Khởi động Keycloak

```bash
# Trong docker-compose.yml
docker-compose up -d keycloak

# Hoặc chạy riêng
docker run -d \
  --name keycloak \
  -p 8180:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  -e KC_DB=postgres \
  -e KC_DB_URL=jdbc:postgresql://postgres:5432/keycloak_db \
  -e KC_DB_USERNAME=postgres \
  -e KC_DB_PASSWORD=postgres \
  quay.io/keycloak/keycloak:24.0 start-dev
```

Mở http://localhost:8180/admin, đăng nhập `admin / admin`.

---

## Bước 2 — Tạo Realm

```
Realm name:         insurance-hub
Display name:       Insurance Hub
Enabled:            ON
```

Tạo qua Admin Console: hamburger menu góc trái → Create Realm → nhập `insurance-hub`.

Hoặc import file JSON:

```json
{
  "realm": "insurance-hub",
  "enabled": true,
  "displayName": "Insurance Hub",
  "sslRequired": "external",
  "registrationAllowed": true,
  "loginWithEmailAllowed": true,
  "duplicateEmailsAllowed": false,
  "resetPasswordAllowed": true,
  "editUsernameAllowed": false,
  "bruteForceProtected": true,
  "permanentLockout": false,
  "maxFailureWaitSeconds": 900,
  "failureFactor": 5,
  "accessTokenLifespan": 3600,
  "refreshTokenLifespan": 86400,
  "ssoSessionIdleTimeout": 1800,
  "ssoSessionMaxLifespan": 36000
}
```

---

## Bước 3 — Tạo Clients

### 3.1 Frontend Client

```
Client ID:              insurance-hub-frontend
Client Protocol:        openid-connect
Access Type:            public
Root URL:               http://localhost:4200
Valid Redirect URIs:    http://localhost:4200/*
Web Origins:            http://localhost:4200
Direct Access Grants:   ON
Standard Flow:          ON
Implicit Flow:          OFF
```

Settings chi tiết:

```json
{
  "clientId": "insurance-hub-frontend",
  "name": "Insurance Hub Frontend",
  "enabled": true,
  "publicClient": true,
  "directAccessGrantsEnabled": true,
  "standardFlowEnabled": true,
  "implicitFlowEnabled": false,
  "rootUrl": "http://localhost:4200",
  "baseUrl": "/",
  "redirectUris": [
    "http://localhost:4200/*"
  ],
  "webOrigins": [
    "http://localhost:4200"
  ],
  "defaultClientScopes": [
    "openid",
    "profile",
    "email",
    "roles"
  ]
}
```

### 3.2 Backend Client

```
Client ID:              insurance-hub-backend
Client Protocol:        openid-connect
Access Type:            confidential
Service Accounts:       ON
Authorization:          ON
```

```json
{
  "clientId": "insurance-hub-backend",
  "name": "Insurance Hub Backend",
  "enabled": true,
  "publicClient": false,
  "secret": "insurance-hub-backend-secret",
  "serviceAccountsEnabled": true,
  "authorizationServicesEnabled": true,
  "directAccessGrantsEnabled": true
}
```

---

## Bước 4 — Tạo Roles

### 4.1 Realm Roles

Tạo 14 roles trong Realm Settings → Roles → Create Role:

```
Role Name              Description
─────────────────────  ────────────────────────────────────────
CUSTOMER               Khách hàng mua bảo hiểm
AGENT                  Đại lý bảo hiểm
SALES_STAFF            Nhân viên bán hàng
UNDERWRITER            Thẩm định viên rủi ro
CLAIMS_HANDLER         Nhân viên xử lý bồi thường
CUSTOMER_SERVICE       Nhân viên chăm sóc khách hàng
ACCOUNTANT             Kế toán
BRANCH_MANAGER         Quản lý chi nhánh
REGIONAL_MANAGER       Quản lý vùng/miền
PRODUCT_MANAGER        Quản lý sản phẩm
COMPLIANCE_OFFICER     Nhân viên tuân thủ pháp lý
PARTNER                Đối tác (bệnh viện, gara, ngân hàng)
ADMIN                  Quản trị viên hệ thống
SUPER_ADMIN            Quản trị viên cao nhất
```

### 4.2 Composite Roles (kế thừa)

```
SUPER_ADMIN    bao gồm: ADMIN
ADMIN          bao gồm: (tất cả quyền)
BRANCH_MANAGER bao gồm: SALES_STAFF
REGIONAL_MANAGER bao gồm: BRANCH_MANAGER
```

### 4.3 Permissions mapping

```
Role                   Permissions
─────────────────────  ────────────────────────────────────────────────────
CUSTOMER               policy.view, claim.submit, claim.view, payment.view,
                       payment.make, profile.edit, notification.view

AGENT                  quote.create, policy.create, policy.view,
                       customer.view, lead.manage, commission.view

SALES_STAFF            quote.create, policy.create, policy.view,
                       customer.view, customer.create

UNDERWRITER            underwriting.view, underwriting.decide,
                       policy.view, customer.view

CLAIMS_HANDLER         claim.view, claim.assess, claim.approve,
                       claim.reject, document.view

CUSTOMER_SERVICE       customer.view, policy.view, claim.view,
                       ticket.manage, notification.send

ACCOUNTANT             payment.view, payment.reconcile,
                       report.financial, commission.approve

BRANCH_MANAGER         agent.manage, report.branch, policy.view,
                       claim.view, target.set

REGIONAL_MANAGER       branch.manage, agent.manage, report.regional,
                       target.set

PRODUCT_MANAGER        product.manage, product.approve, product.pricing,
                       report.product

COMPLIANCE_OFFICER     audit.view, report.compliance, product.review,
                       data.export

PARTNER                eligibility.check, claim.submit,
                       direct_billing.manage

ADMIN                  user.manage, config.manage, report.all,
                       product.manage, system.monitor

SUPER_ADMIN            (toàn quyền) + user.delete, system.config,
                       data.purge
```

---

## Bước 5 — Tạo Users

Tạo 13 demo users trong Users → Add User:

```
Username                Roles                          Password
──────────────────────  ─────────────────────────────  ──────────
customer@demo.com       CUSTOMER                       Demo@123
agent@demo.com          AGENT                          Demo@123
admin@demo.com          ADMIN, SUPER_ADMIN             Demo@123
underwriter@demo.com    UNDERWRITER                    Demo@123
claims@demo.com         CLAIMS_HANDLER                 Demo@123
partner@demo.com        PARTNER                        Demo@123
sales@demo.com          SALES_STAFF                    Demo@123
cs@demo.com             CUSTOMER_SERVICE               Demo@123
accountant@demo.com     ACCOUNTANT                     Demo@123
branch@demo.com         BRANCH_MANAGER                 Demo@123
regional@demo.com       REGIONAL_MANAGER               Demo@123
pm@demo.com             PRODUCT_MANAGER                Demo@123
compliance@demo.com     COMPLIANCE_OFFICER             Demo@123
```

Với mỗi user:
1. Tạo user: Users → Add User → nhập Username, Email, First Name, Last Name
2. Set password: Tab Credentials → Set Password → nhập `Demo@123`, tắt Temporary
3. Gán role: Tab Role Mappings → Assign Role → chọn role tương ứng

---

## Bước 6 — Token Settings

Realm Settings → Tokens:

```
Setting                          Value        Ghi chú
───────────────────────────────  ───────────  ──────────────────────────────
Access Token Lifespan            1 giờ        Frontend token
Refresh Token Lifespan           24 giờ       Cho "Remember Me"
SSO Session Idle                 30 phút      Tự logout nếu không hoạt động
SSO Session Max                  10 giờ       Phiên làm việc tối đa
Client Session Idle              30 phút
Client Session Max               10 giờ
Access Token Lifespan For        5 phút       Implicit flow (không dùng)
  Implicit Flow
```

---

## Bước 7 — MFA (Multi-Factor Authentication)

Áp dụng cho staff roles (không bắt buộc CUSTOMER):

Authentication → Flows → Browser → Chọn "Browser - Conditional OTP":

```
Roles bắt buộc MFA:
├── ADMIN
├── SUPER_ADMIN
├── ACCOUNTANT
├── UNDERWRITER
└── CLAIMS_HANDLER

Roles không bắt buộc MFA:
├── CUSTOMER
├── AGENT
└── PARTNER
```

Cấu hình OTP:
```
OTP Type:        TOTP (Time-based)
Algorithm:       HmacSHA1
Digits:          6
Period:          30 giây
Look Ahead:      1
```

---

## Bước 8 — Password Policy

Realm Settings → Authentication → Password Policy:

```
Policy                  Value
──────────────────────  ──────────
Minimum Length           8
Uppercase Characters     1
Lowercase Characters     1
Digits                   1
Special Characters       1
Not Username             ON
Password History         3
Max Authentication Age   365 ngày
```

---

## Bước 9 — Email Configuration

Realm Settings → Email:

```
From:                   noreply@insurance-hub.vn
Host:                   smtp.sendgrid.net
Port:                   587
Enable StartTLS:        ON
Username:               apikey
Password:               <SendGrid API Key>
```

Dùng cho: xác thực email, quên mật khẩu, MFA recovery.

---

## Tích hợp Frontend

File `src/environments/environment.ts` đã cấu hình sẵn:

```typescript
export const environment = {
  keycloakUrl: 'http://localhost:8180',
  keycloakRealm: 'insurance-hub',
  keycloakClientId: 'insurance-hub-frontend'
};
```

Khi `useMockData: false`, AuthService sẽ gọi Keycloak thay vì mock login:

```typescript
// Luồng login thật
POST http://localhost:8180/realms/insurance-hub/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id=insurance-hub-frontend
&username=customer@demo.com
&password=Demo@123
```

---

## Tích hợp Backend

Mỗi Spring Boot service cấu hình JWT validation:

```yaml
# application.yml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8180/realms/insurance-hub
          jwk-set-uri: http://localhost:8180/realms/insurance-hub/protocol/openid-connect/certs
```

Backend chỉ cần validate token, không cần biết password. Keycloak xử lý toàn bộ authentication.

---

## Import / Export Realm

```bash
# Export toàn bộ realm (chạy trong container)
docker exec keycloak /opt/keycloak/bin/kc.sh export \
  --dir /opt/keycloak/data/export \
  --realm insurance-hub

# Import khi setup môi trường mới
docker exec keycloak /opt/keycloak/bin/kc.sh import \
  --dir /opt/keycloak/data/import

# Hoặc mount file JSON khi khởi động
docker run -v ./realm-insurance-hub.json:/opt/keycloak/data/import/realm.json \
  quay.io/keycloak/keycloak:24.0 start-dev --import-realm
```
