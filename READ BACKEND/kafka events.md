# Kafka Events — Insurance Hub

## Tổng quan

Kafka là backbone giao tiếp bất đồng bộ giữa 13 microservices. Tất cả events sử dụng JSON format với schema thống nhất.

```
Kafka Cluster (:9092)
├── Zookeeper (:2181)
├── 16 Topics
├── Replication Factor: 3
└── Retention: 7 ngày
```

---

## Event Schema chung

```json
{
  "eventId": "evt-550e8400-e29b-41d4-...",
  "eventType": "policy.issued",
  "timestamp": "2024-06-10T14:30:00Z",
  "source": "policy-service",
  "correlationId": "req-abc123",
  "userId": "U01",
  "data": { ... }
}
```

| Field | Kiểu | Mô tả |
|---|---|---|
| eventId | UUID | ID duy nhất của event |
| eventType | string | Tên event (topic.action) |
| timestamp | ISO 8601 | Thời điểm phát sinh |
| source | string | Service phát ra event |
| correlationId | string | Trace xuyên suốt 1 flow |
| userId | string | Người thực hiện hành động |
| data | object | Payload tuỳ theo event type |

---

## Danh sách Topics & Events

### 1. product.events

```
Producer:   product-service
Consumers:  sales-service, reporting-service
Partitions: 3
```

```json
// product.created
{
  "eventType": "product.created",
  "source": "product-service",
  "data": {
    "productId": "PRD07",
    "code": "PET-001",
    "name": "BH Thú cưng",
    "category": "ACCIDENT",
    "status": "DRAFT",
    "plans": 2
  }
}

// product.updated
{
  "eventType": "product.updated",
  "data": {
    "productId": "PRD01",
    "changes": ["premium", "benefits"],
    "newPremium": 13000000
  }
}

// product.activated
{
  "eventType": "product.activated",
  "data": {
    "productId": "PRD07",
    "activatedBy": "U12"
  }
}
```

### 2. policy.events

```
Producer:   policy-service, sales-service
Consumers:  commission-service, notification-service, document-service, reporting-service
Partitions: 6
```

```json
// policy.quoted
{
  "eventType": "policy.quoted",
  "source": "sales-service",
  "data": {
    "quoteId": "QT-001",
    "customerId": "U01",
    "productId": "PRD01",
    "planId": "PH2",
    "totalPremium": 12000000,
    "validUntil": "2024-07-10"
  }
}

// policy.issued
{
  "eventType": "policy.issued",
  "source": "policy-service",
  "data": {
    "policyId": "POL01",
    "policyNumber": "IH-2024-HEALTH-00001",
    "customerId": "U01",
    "customerName": "Nguyễn Văn An",
    "productId": "PRD01",
    "productName": "BH Sức khỏe Toàn diện",
    "agentId": "U02",
    "premium": 12000000,
    "sumInsured": 300000000,
    "startDate": "2024-03-01",
    "endDate": "2025-03-01"
  }
}

// policy.activated
{
  "eventType": "policy.activated",
  "data": {
    "policyId": "POL01",
    "policyNumber": "IH-2024-HEALTH-00001",
    "activatedAt": "2024-03-01T14:30:00Z"
  }
}

// policy.renewed
{
  "eventType": "policy.renewed",
  "data": {
    "oldPolicyId": "POL01",
    "newPolicyId": "POL01-REN",
    "newPolicyNumber": "IH-2025-HEALTH-00001",
    "premium": 12600000,
    "startDate": "2025-03-01",
    "endDate": "2026-03-01"
  }
}

// policy.cancelled
{
  "eventType": "policy.cancelled",
  "data": {
    "policyId": "POL01",
    "reason": "Yêu cầu của khách hàng",
    "refundAmount": 6000000,
    "effectiveDate": "2024-07-01"
  }
}

// policy.lapsed
{
  "eventType": "policy.lapsed",
  "data": {
    "policyId": "POL04",
    "policyNumber": "IH-2024-TRAVEL-00001",
    "lapsedAt": "2024-05-15",
    "reason": "Hết hạn không gia hạn"
  }
}
```

### 3. claim.events

```
Producer:   claims-service
Consumers:  policy-service, notification-service, reporting-service, document-service
Partitions: 4
```

```json
// claim.submitted
{
  "eventType": "claim.submitted",
  "source": "claims-service",
  "data": {
    "claimId": "CLM01",
    "claimNumber": "IH-CLM-2024-00001",
    "policyId": "POL01",
    "policyNumber": "IH-2024-HEALTH-00001",
    "customerId": "U01",
    "type": "OUTPATIENT",
    "claimedAmount": 2500000,
    "documentsCount": 2
  }
}

// claim.approved
{
  "eventType": "claim.approved",
  "data": {
    "claimId": "CLM01",
    "claimNumber": "IH-CLM-2024-00001",
    "customerId": "U01",
    "approvedAmount": 2200000,
    "deductible": 300000,
    "handlerId": "U05",
    "handlerName": "Hoàng Văn Em"
  }
}

// claim.rejected
{
  "eventType": "claim.rejected",
  "data": {
    "claimId": "CLM04",
    "reason": "Sự kiện không thuộc phạm vi bảo hiểm",
    "handlerId": "U05"
  }
}

// claim.paid
{
  "eventType": "claim.paid",
  "data": {
    "claimId": "CLM01",
    "paidAmount": 2200000,
    "bankName": "Vietcombank",
    "accountNumber": "****7890",
    "paidAt": "2024-05-24T10:00:00Z"
  }
}

// claim.fraud_detected
{
  "eventType": "claim.fraud_detected",
  "data": {
    "claimId": "CLM02",
    "fraudScore": 85,
    "reasons": ["Duplicate claim pattern", "Suspicious amount"],
    "recommendedAction": "MANUAL_REVIEW"
  }
}
```

### 4. payment.events

```
Producer:   payment-service
Consumers:  policy-service, notification-service, reporting-service
Partitions: 4
```

```json
// payment.initiated
{
  "eventType": "payment.initiated",
  "source": "payment-service",
  "data": {
    "transactionId": "TXN-20240301-001",
    "policyId": "POL01",
    "customerId": "U01",
    "amount": 12000000,
    "method": "E_WALLET_VNPAY",
    "gateway": "VNPay"
  }
}

// payment.success
{
  "eventType": "payment.success",
  "data": {
    "transactionId": "TXN-20240301-001",
    "policyId": "POL01",
    "amount": 12000000,
    "paidAt": "2024-03-01T14:30:00Z",
    "gatewayRef": "14026245"
  }
}

// payment.failed
{
  "eventType": "payment.failed",
  "data": {
    "transactionId": "TXN-20240610-002",
    "policyId": "POL06",
    "reason": "Insufficient funds",
    "gatewayCode": "51"
  }
}

// payment.refunded
{
  "eventType": "payment.refunded",
  "data": {
    "refundId": "REF-001",
    "originalTransactionId": "TXN-20240301-001",
    "amount": 6000000,
    "reason": "Policy cancellation"
  }
}

// payment.overdue
{
  "eventType": "payment.overdue",
  "data": {
    "policyId": "POL06",
    "policyNumber": "IH-2024-PROP-00001",
    "customerId": "U01",
    "amount": 4000000,
    "dueDate": "2024-06-15",
    "daysOverdue": 5,
    "dunningLevel": 1
  }
}
```

### 5. notification.events

```
Producer:   tất cả services (qua event chain)
Consumers:  notification-service
Partitions: 3
```

```json
// notification.email.send
{
  "eventType": "notification.email.send",
  "data": {
    "to": "customer@demo.com",
    "template": "policy-issued",
    "variables": {
      "customerName": "Nguyễn Văn An",
      "policyNumber": "IH-2024-HEALTH-00001",
      "productName": "BH Sức khỏe Toàn diện"
    }
  }
}

// notification.sms.send
{
  "eventType": "notification.sms.send",
  "data": {
    "to": "0901234567",
    "template": "payment-due",
    "variables": {
      "amount": "4,000,000₫",
      "dueDate": "15/06/2024"
    }
  }
}

// notification.push.send
{
  "eventType": "notification.push.send",
  "data": {
    "userId": "U01",
    "title": "Bồi thường đã duyệt",
    "message": "Yêu cầu CLM-001 đã được duyệt 2,200,000₫",
    "link": "/claims/CLM01",
    "type": "SUCCESS"
  }
}
```

### 6. audit.events

```
Producer:   tất cả services
Consumers:  reporting-service
Partitions: 3
```

```json
// audit.log
{
  "eventType": "audit.log",
  "data": {
    "username": "admin@demo.com",
    "role": "ADMIN",
    "action": "APPROVE",
    "entity": "Claim",
    "entityId": "CLM01",
    "details": "Phê duyệt BT 2,200,000₫",
    "ipAddress": "192.168.1.100",
    "status": "SUCCESS"
  }
}
```

### 7. underwriting.events

```
Producer:   underwriting-service
Consumers:  policy-service, notification-service
Partitions: 2
```

```json
// underwriting.approved
{
  "eventType": "underwriting.approved",
  "data": {
    "caseId": "UW01",
    "applicationId": "APP-2024-00125",
    "decision": "APPROVED_WITH_LOADING",
    "loadingPercent": 25,
    "finalPremium": 15000000,
    "assessor": "U04"
  }
}

// underwriting.declined
{
  "eventType": "underwriting.declined",
  "data": {
    "caseId": "UW05",
    "applicationId": "APP-2024-00129",
    "reason": "Rủi ro vượt ngưỡng",
    "riskScore": 92
  }
}
```

### 8. commission.events

```
Producer:   commission-service
Consumers:  notification-service, reporting-service
Partitions: 2
```

```json
// commission.calculated
{
  "eventType": "commission.calculated",
  "data": {
    "commissionId": "COM01",
    "agentId": "A01",
    "policyNumber": "IH-2024-HEALTH-00001",
    "type": "FIRST_YEAR",
    "premium": 12000000,
    "rate": 20,
    "amount": 2400000
  }
}

// commission.paid
{
  "eventType": "commission.paid",
  "data": {
    "agentId": "A01",
    "period": "2024-06",
    "totalAmount": 16350000,
    "items": 5,
    "paidAt": "2024-07-05"
  }
}
```

---

## Topic → Consumer Mapping

```
Topic                   Consumers
──────────────────────  ──────────────────────────────────────────────────
product.events          sales-service, reporting-service
policy.events           commission-service, notification-service,
                        document-service, reporting-service
claim.events            policy-service, notification-service,
                        reporting-service, document-service
payment.events          policy-service, notification-service,
                        reporting-service
notification.events     notification-service
audit.events            reporting-service
underwriting.events     policy-service, notification-service
commission.events       notification-service, reporting-service
```

---

## Tạo Topics

```bash
#!/bin/bash
# infrastructure/kafka/topics/create-topics.sh

KAFKA_HOST=localhost:9092

kafka-topics.sh --create --bootstrap-server $KAFKA_HOST --topic product.events      --partitions 3 --replication-factor 1
kafka-topics.sh --create --bootstrap-server $KAFKA_HOST --topic policy.events       --partitions 6 --replication-factor 1
kafka-topics.sh --create --bootstrap-server $KAFKA_HOST --topic claim.events        --partitions 4 --replication-factor 1
kafka-topics.sh --create --bootstrap-server $KAFKA_HOST --topic payment.events      --partitions 4 --replication-factor 1
kafka-topics.sh --create --bootstrap-server $KAFKA_HOST --topic notification.events --partitions 3 --replication-factor 1
kafka-topics.sh --create --bootstrap-server $KAFKA_HOST --topic audit.events        --partitions 3 --replication-factor 1
kafka-topics.sh --create --bootstrap-server $KAFKA_HOST --topic underwriting.events --partitions 2 --replication-factor 1
kafka-topics.sh --create --bootstrap-server $KAFKA_HOST --topic commission.events   --partitions 2 --replication-factor 1
```

---

## Flow ví dụ: Mua bảo hiểm online

```
Customer click "Mua ngay"
       │
       ▼
  sales-service
  ├── Tạo quote
  └── Publish: policy.quoted
              │
              ▼
       underwriting-service (consume policy.quoted)
       ├── Tính risk score
       ├── Auto-approve (score < 50)
       └── Publish: underwriting.approved
                    │
                    ▼
             policy-service (consume underwriting.approved)
             ├── Tạo policy (PENDING_PAYMENT)
             └── Publish: policy.issued
                          │
                          ├──▶ commission-service → Tính hoa hồng → Publish: commission.calculated
                          ├──▶ document-service → Tạo PDF hợp đồng
                          ├──▶ notification-service → Gửi email + SMS
                          └──▶ reporting-service → Cập nhật dashboard
       │
       ▼
  Customer thanh toán
       │
       ▼
  payment-service
  └── Publish: payment.success
               │
               ▼
        policy-service (consume payment.success)
        ├── Cập nhật status → ACTIVE
        └── Publish: policy.activated
                     │
                     └──▶ notification-service → Gửi giấy chứng nhận
```
