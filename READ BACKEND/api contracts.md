# API Contract — Insurance Hub

## Quy ước chung

```
Base URL:        http://localhost:8080/api/v1
Content-Type:    application/json
Authorization:   Bearer <JWT_TOKEN>
Charset:         UTF-8
Currency:        VND (đơn vị đồng, không chia lẻ)
Date format:     ISO 8601 (2024-06-10T14:30:00Z)
ID format:       UUID v4
```

### Response wrapper

Tất cả response đều dùng format thống nhất:

```json
// Thành công — đối tượng đơn
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-06-10T14:30:00Z"
}

// Thành công — danh sách có phân trang
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 156,
    "totalPages": 8
  },
  "timestamp": "2024-06-10T14:30:00Z"
}

// Lỗi
{
  "success": false,
  "error": {
    "code": "POLICY_NOT_FOUND",
    "message": "Không tìm thấy hợp đồng với mã POL-001",
    "details": null
  },
  "timestamp": "2024-06-10T14:30:00Z"
}
```

### HTTP Status Codes

```
200   OK                  Thành công
201   Created             Tạo mới thành công
204   No Content          Xóa thành công
400   Bad Request         Dữ liệu không hợp lệ
401   Unauthorized        Chưa đăng nhập / token hết hạn
403   Forbidden           Không có quyền
404   Not Found           Không tìm thấy tài nguyên
409   Conflict            Trùng dữ liệu (ví dụ: duplicate policy number)
422   Unprocessable       Nghiệp vụ không cho phép (ví dụ: claim > sum insured)
429   Too Many Requests   Rate limit
500   Internal Error      Lỗi server
```

### Phân trang

```
GET /api/v1/policies?page=0&size=20&sort=createdAt,desc
```

---

## 1. Authentication

### POST /auth/login

```json
// Request
{
  "username": "customer@demo.com",
  "password": "Demo@123",
  "rememberMe": false
}

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "username": "customer@demo.com",
      "email": "customer@demo.com",
      "firstName": "Nguyễn Văn",
      "lastName": "An",
      "phone": "0901234567",
      "roles": ["CUSTOMER"],
      "permissions": ["policy.view", "claim.submit", "payment.view"]
    }
  }
}

// Response 401
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Tên đăng nhập hoặc mật khẩu không đúng"
  }
}
```

### POST /auth/register

```json
// Request
{
  "username": "newuser@email.com",
  "email": "newuser@email.com",
  "password": "SecurePass@123",
  "firstName": "Trần Thị",
  "lastName": "Mai",
  "phone": "0912345678",
  "userType": "CUSTOMER",
  "agreeTerms": true
}

// Response 201
{
  "success": true,
  "data": {
    "id": "550e8400-...",
    "username": "newuser@email.com",
    "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực."
  }
}
```

### POST /auth/refresh

```json
// Request
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs...(new)",
    "expiresIn": 3600
  }
}
```

### POST /auth/logout

```
Authorization: Bearer <token>
Response 204 (No Content)
```

---

## 2. Products

### GET /products

```
Query params: ?category=HEALTH&featured=true&page=0&size=10

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "PRD01",
      "code": "HEALTH-001",
      "name": "BH Sức khỏe Toàn diện",
      "category": "HEALTH",
      "shortDescription": "Bảo hiểm sức khỏe toàn diện, nội trú + ngoại trú",
      "image": "/assets/images/health-insurance.jpg",
      "icon": "health_and_safety",
      "status": "ACTIVE",
      "featured": true,
      "rating": 4.5,
      "reviewCount": 128,
      "minPremium": 6000000,
      "maxPremium": 36000000,
      "currency": "VND",
      "plans": [
        {
          "id": "PH1",
          "name": "Bronze",
          "tier": "BRONZE",
          "sumInsured": 100000000,
          "premium": 6000000,
          "premiumMonthly": 540000,
          "recommended": false,
          "benefits": [
            { "name": "Nội trú", "limit": "100 triệu/năm", "description": "...", "included": true },
            { "name": "Ngoại trú", "limit": "Không", "description": "...", "included": false }
          ]
        }
      ],
      "exclusions": ["Bệnh có sẵn trước 12 tháng", "Thẩm mỹ"],
      "eligibility": { "minAge": 1, "maxAge": 65, "minTerm": 12, "maxTerm": 12 },
      "riders": [
        { "id": "R1", "name": "Thai sản", "description": "Quyền lợi thai sản", "premium": 2000000, "sumInsured": 50000000 }
      ],
      "taxRate": 0,
      "autoRenewal": true,
      "renewalGracePeriod": 30
    }
  ],
  "pagination": { "page": 0, "size": 10, "totalElements": 6, "totalPages": 1 }
}
```

### GET /products/:id

```
// Response 200 — cùng cấu trúc như 1 item ở trên
```

### GET /products/featured

```
// Response 200 — array products có featured=true
```

---

## 3. Quotes

### POST /quotes

```json
// Request
{
  "productId": "PRD01",
  "planId": "PH2",
  "customerInfo": {
    "age": 35,
    "gender": "M",
    "occupation": "Engineer",
    "smoker": false
  },
  "coverage": {
    "sumInsured": 300000000,
    "term": 12
  }
}

// Response 201
{
  "success": true,
  "data": {
    "id": "QT-001",
    "quoteNumber": "IH-QT-20240610-001",
    "productId": "PRD01",
    "productName": "BH Sức khỏe Toàn diện",
    "planId": "PH2",
    "planName": "Silver",
    "sumInsured": 300000000,
    "totalPremium": 12000000,
    "premiumMonthly": 1080000,
    "premiumAnnual": 12000000,
    "validUntil": "2024-07-10T00:00:00Z",
    "breakdown": [
      { "item": "Phí cơ bản", "amount": 12600000 },
      { "item": "Giảm giá online -5%", "amount": -600000 }
    ],
    "createdAt": "2024-06-10T14:30:00Z"
  }
}
```

---

## 4. Policies

### GET /policies

```
Query: ?customerId=U01&status=ACTIVE&page=0&size=20

// Response 200 — array of Policy objects
```

### GET /policies/:id

```json
// Response 200
{
  "success": true,
  "data": {
    "id": "POL01",
    "policyNumber": "IH-2024-HEALTH-00001",
    "productId": "PRD01",
    "productName": "BH Sức khỏe Toàn diện",
    "productCategory": "HEALTH",
    "planName": "Silver",
    "customerId": "U01",
    "customerName": "Nguyễn Văn An",
    "agentId": "U02",
    "agentName": "Trần Thị Bình",
    "status": "ACTIVE",
    "sumInsured": 300000000,
    "premium": 12000000,
    "paymentFrequency": "ANNUAL",
    "startDate": "2024-03-01",
    "endDate": "2025-03-01",
    "nextPaymentDate": "2025-03-01",
    "autoRenewal": true,
    "beneficiaries": [
      { "name": "Nguyễn Thị Hoa", "relationship": "Vợ", "percentage": 60, "idNumber": "079..." },
      { "name": "Nguyễn Minh Tuấn", "relationship": "Con", "percentage": 40 }
    ],
    "endorsements": [],
    "issuedAt": "2024-03-01T00:00:00Z",
    "renewalDate": "2025-02-01",
    "createdAt": "2024-02-28",
    "updatedAt": "2024-06-01"
  }
}
```

### POST /policies

```json
// Request
{
  "quoteId": "QT-001",
  "customerId": "U01",
  "paymentFrequency": "ANNUAL",
  "beneficiaries": [
    { "name": "Nguyễn Thị Hoa", "relationship": "Vợ", "percentage": 100 }
  ]
}

// Response 201
{
  "success": true,
  "data": {
    "id": "POL-NEW",
    "policyNumber": "IH-2024-HEALTH-00007",
    "status": "PENDING_PAYMENT"
  }
}
```

### POST /policies/:id/renew

```json
// Request (body tuỳ chọn)
{
  "paymentFrequency": "ANNUAL"
}

// Response 200
{
  "success": true,
  "data": {
    "newPolicyId": "POL-REN-001",
    "newPolicyNumber": "IH-2025-HEALTH-00001",
    "status": "PENDING_PAYMENT"
  }
}
```

### POST /policies/:id/endorse

```json
// Request
{
  "type": "ADD_BENEFICIARY",
  "changes": {
    "beneficiary": { "name": "Nguyễn Minh Khoa", "relationship": "Con", "percentage": 20 }
  },
  "effectiveDate": "2024-07-01"
}

// Response 200
{
  "success": true,
  "data": {
    "endorsementId": "END-001",
    "status": "PENDING"
  }
}
```

### POST /policies/:id/cancel

```json
// Request
{
  "reason": "Chuyển sang công ty khác",
  "effectiveDate": "2024-07-01"
}

// Response 200
{
  "success": true,
  "data": {
    "refundAmount": 6000000,
    "refundMethod": "BANK_TRANSFER"
  }
}
```

---

## 5. Claims

### GET /claims

```
Query: ?customerId=U01&status=UNDER_REVIEW&page=0&size=20
```

### GET /claims/:id

```json
// Response 200 — full Claim object bao gồm documents, timeline, bankAccount
```

### POST /claims

```json
// Request (multipart/form-data)
{
  "policyId": "POL01",
  "type": "OUTPATIENT",
  "description": "Khám ngoại trú BV Vinmec",
  "incidentDate": "2024-06-10",
  "claimedAmount": 3500000,
  "bankAccount": {
    "bankName": "Vietcombank",
    "accountNumber": "1234567890",
    "accountHolder": "NGUYEN VAN AN"
  }
  // + file attachments qua multipart
}

// Response 201
{
  "success": true,
  "data": {
    "id": "CLM-NEW",
    "claimNumber": "IH-CLM-2024-00005",
    "status": "SUBMITTED"
  }
}
```

### POST /claims/:id/approve

```json
// Request
{
  "approvedAmount": 3200000,
  "deductible": 300000,
  "notes": "Hồ sơ hợp lệ, phê duyệt."
}

// Response 200
{
  "success": true,
  "data": { "status": "APPROVED", "approvedAmount": 3200000 }
}
```

### POST /claims/:id/reject

```json
// Request
{
  "reason": "Sự kiện không thuộc phạm vi bảo hiểm"
}

// Response 200
{
  "success": true,
  "data": { "status": "REJECTED" }
}
```

### POST /claims/:id/request-info

```json
// Request
{
  "message": "Cần bổ sung hóa đơn gốc có đóng dấu bệnh viện."
}

// Response 200
{
  "success": true,
  "data": { "status": "ADDITIONAL_INFO_REQUIRED" }
}
```

### POST /claims/:id/documents

```
Content-Type: multipart/form-data
Fields: type=INVOICE, file=<binary>

// Response 201
{
  "success": true,
  "data": {
    "id": "DOC-001",
    "type": "INVOICE",
    "fileName": "hoa-don.pdf",
    "fileUrl": "/documents/DOC-001/hoa-don.pdf",
    "ocrData": {
      "invoiceNumber": "HD-2024-001",
      "invoiceDate": "2024-06-10",
      "amount": 3500000,
      "hospital": "Bệnh viện Vinmec",
      "diagnosis": "Viêm họng cấp",
      "confidence": 0.94
    }
  }
}
```

---

## 6. Payments

### GET /payments

```
Query: ?customerId=U01&status=SUCCESS&page=0&size=20
```

### GET /payments/schedule

```
Query: ?customerId=U01

// Response 200
{
  "success": true,
  "data": [
    {
      "policyNumber": "IH-2024-ACC-00001",
      "productName": "BH Tai nạn 24/7",
      "premium": 1500000,
      "dueDate": "2025-02-01",
      "status": "UPCOMING",
      "daysUntil": 45
    },
    {
      "policyNumber": "IH-2024-PROP-00001",
      "productName": "BH Nhà ở An Cư",
      "premium": 4000000,
      "dueDate": "2024-06-15",
      "status": "OVERDUE",
      "daysUntil": -5
    }
  ]
}
```

### POST /payments/initiate

```json
// Request
{
  "policyId": "POL06",
  "amount": 4000000,
  "method": "E_WALLET_VNPAY",
  "returnUrl": "http://localhost:4200/payment/callback"
}

// Response 200
{
  "success": true,
  "data": {
    "transactionId": "TXN-20240610-002",
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TxnRef=...",
    "expireAt": "2024-06-10T15:00:00Z"
  }
}
```

### POST /payments/callback

```json
// Request (từ gateway callback)
{
  "transactionId": "TXN-20240610-002",
  "vnp_ResponseCode": "00",
  "vnp_TransactionNo": "14026245",
  "vnp_Amount": "400000000",
  "vnp_SecureHash": "abc..."
}

// Response 200
{
  "success": true,
  "data": {
    "transactionId": "TXN-20240610-002",
    "status": "SUCCESS",
    "paidAt": "2024-06-10T14:35:00Z"
  }
}
```

### POST /payments/:id/refund

```json
// Request
{
  "amount": 4000000,
  "reason": "Hủy hợp đồng trong thời gian cân nhắc"
}

// Response 200
{
  "success": true,
  "data": {
    "refundId": "REF-001",
    "status": "PROCESSING"
  }
}
```

---

## 7. Agents

### GET /agents

```
Query: ?branchName=HCM&level=SENIOR&page=0&size=20
```

### GET /agents/:id/commissions

```
Query: ?period=2024-06&type=FIRST_YEAR

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "COM01",
      "agentId": "A01",
      "policyNumber": "IH-2024-HEALTH-00001",
      "customerName": "Nguyễn Văn An",
      "productName": "BH Sức khỏe",
      "type": "FIRST_YEAR",
      "premium": 12000000,
      "rate": 20,
      "amount": 2400000,
      "status": "PAID",
      "period": "2024-03"
    }
  ]
}
```

### GET /agents/leads

```
Query: ?assignedTo=U02&status=NEW

// Response 200 — array of Lead objects
```

### GET /agents/leaderboard

```json
// Response 200
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "agentCode": "AG001",
      "fullName": "Trần Thị Bình",
      "totalPolicies": 45,
      "totalPremium": 580000000,
      "totalClients": 38,
      "achievement": 116
    }
  ]
}
```

---

## 8. Underwriting

### GET /underwriting/queue

```
Query: ?status=PENDING_REVIEW&assigneeId=U04

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "UW01",
      "applicationId": "APP-2024-00125",
      "customerName": "Lê Văn Hoàng",
      "productName": "BH Sức khỏe Toàn diện",
      "sumInsured": 500000000,
      "premium": 24000000,
      "riskLevel": "HIGH",
      "riskScore": 78,
      "status": "PENDING_REVIEW",
      "healthDeclaration": {
        "smoker": true,
        "bmi": 28.5,
        "preConditions": ["Huyết áp cao", "Tiểu đường type 2"]
      },
      "slaDeadline": "2024-06-12T17:00:00Z",
      "agentName": "Trần Thị Bình"
    }
  ]
}
```

### POST /underwriting/:id/approve

```json
// Request
{
  "decision": "APPROVED_WITH_LOADING",
  "loadingPercent": 25,
  "notes": "Phí tải thêm 25% do tiền sử bệnh."
}

// Response 200
{
  "success": true,
  "data": { "status": "APPROVED_WITH_LOADING" }
}
```

### POST /underwriting/:id/decline

```json
// Request
{
  "reason": "Rủi ro vượt ngưỡng chấp nhận"
}

// Response 200
{
  "success": true,
  "data": { "status": "DECLINED" }
}
```

---

## 9. Partners

### GET /partners

```
Query: ?type=HOSPITAL&directBilling=true
```

### POST /partners/:id/check-eligibility

```json
// Request
{
  "policyNumber": "IH-2024-HEALTH-00001",
  "customerIdNumber": "079123456789"
}

// Response 200
{
  "success": true,
  "data": {
    "eligible": true,
    "policyNumber": "IH-2024-HEALTH-00001",
    "customerName": "Nguyễn Văn An",
    "planName": "Silver",
    "sumInsured": 300000000,
    "status": "ACTIVE",
    "inpatientLimit": 300000000,
    "outpatientLimit": 30000000,
    "usedAmount": 2200000,
    "remainingAmount": 297800000
  }
}
```

---

## 10. Customers

### GET /customers/:id/360

```json
// Response 200
{
  "success": true,
  "data": {
    "customerId": "U01",
    "fullName": "Nguyễn Văn An",
    "segment": "GOLD",
    "lifetimeValue": 46850000,
    "score": 92,
    "summary": {
      "totalPolicies": 6,
      "activePolicies": 4,
      "totalPremium": 46850000,
      "totalClaims": 4
    },
    "riskProfile": {
      "healthRisk": "LOW",
      "claimsFrequency": "MEDIUM",
      "paymentHistory": "EXCELLENT",
      "fraudRisk": "LOW"
    },
    "crossSellOpportunities": [
      "BH Nhà ở (chưa có)",
      "Nâng cấp BH Xe lên Gold",
      "BH Du lịch cho chuyến sắp tới"
    ],
    "interactions": [
      { "type": "CALL", "date": "2024-06-01", "note": "Tư vấn gia hạn BH Xe", "agent": "Trần Thị Bình" },
      { "type": "CLAIM", "date": "2024-05-22", "note": "Nộp BT ngoại trú", "agent": "Hệ thống" }
    ]
  }
}
```

### POST /customers/:id/kyc

```
Content-Type: multipart/form-data
Fields: idFront=<binary>, idBack=<binary>, selfie=<binary>

// Response 200
{
  "success": true,
  "data": {
    "kycStatus": "VERIFIED",
    "idNumber": "079123456789",
    "fullName": "NGUYEN VAN AN",
    "matchScore": 0.97
  }
}
```

---

## 11. Notifications

### GET /notifications

```
Query: ?userId=U01&read=false

// Response 200 — array of Notification objects
```

### GET /notifications/unread-count

```json
// Response 200
{
  "success": true,
  "data": { "count": 4 }
}
```

### PUT /notifications/:id/mark-read

```
// Response 204
```

### WS /ws/notifications

```
WebSocket handshake: ws://localhost:8085/ws?token=<JWT>

// Server → Client (push)
{
  "type": "NOTIFICATION",
  "data": {
    "id": "N-NEW",
    "type": "SUCCESS",
    "title": "Bồi thường đã duyệt",
    "message": "Yêu cầu CLM-001 đã được duyệt 2,200,000₫",
    "link": "/claims/CLM01"
  }
}
```

---

## 12. Admin

### GET /admin/dashboard/stats

```json
// Response 200
{
  "success": true,
  "data": {
    "totalPolicies": 1250,
    "activePolicies": 980,
    "totalPremium": 15600000000,
    "totalClaims": 89,
    "pendingClaims": 12,
    "lossRatio": 42.5,
    "newPoliciesThisMonth": 45,
    "premiumGrowth": 12.5,
    "monthlyPremium": [
      { "label": "T1", "value": 1200000000 },
      { "label": "T2", "value": 1350000000 }
    ],
    "claimsByCategory": [
      { "label": "Sức khỏe", "value": 45, "color": "#4CAF50" },
      { "label": "Xe", "value": 23, "color": "#2196F3" }
    ]
  }
}
```

### GET /admin/users

```
Query: ?role=AGENT&enabled=true&page=0&size=20
```

### GET /admin/audit-logs

```
Query: ?username=admin@demo.com&entity=Policy&from=2024-01-01&to=2024-06-30&page=0&size=50
```

### GET /admin/reports/:type

```
Types: business, financial, claims, agents, products

// Response 200 — report data theo type
```

### POST /admin/reports/export

```json
// Request
{
  "type": "business",
  "from": "2024-01-01",
  "to": "2024-06-30",
  "format": "xlsx"
}

// Response 200
{
  "success": true,
  "data": {
    "downloadUrl": "/reports/export/RPT-20240610-001.xlsx",
    "expiresAt": "2024-06-11T14:30:00Z"
  }
}
```

---

## 13. System

### GET /health

```json
// Response 200
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "redis": { "status": "UP" },
    "kafka": { "status": "UP" }
  }
}
```

### GET /metrics

```
# Prometheus format
http_server_requests_seconds_count{method="GET",uri="/api/v1/products"} 1523
http_server_requests_seconds_sum{method="GET",uri="/api/v1/products"} 12.45
jvm_memory_used_bytes{area="heap"} 234567890
```
