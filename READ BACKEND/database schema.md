# Database Schema — Insurance Hub

## Tổng quan

Mỗi microservice sở hữu database riêng (Database-per-Service pattern). Tổng cộng **13 databases** trên PostgreSQL.

```
PostgreSQL Instance (:5432)
│
├── product_db
│   ├── products
│   ├── product_plans
│   ├── plan_benefits
│   └── product_riders
│
├── customer_db
│   ├── customers
│   ├── leads
│   ├── interactions
│   └── data_privacy_consents
│
├── sales_db
│   ├── quotes
│   ├── quote_breakdowns
│   └── applications
│
├── policy_db
│   ├── policies
│   ├── beneficiaries
│   └── endorsements
│
├── claims_db
│   ├── claims
│   ├── claim_documents
│   ├── claim_timeline
│   └── bank_accounts
│
├── payment_db
│   ├── payments
│   ├── payment_schedule
│   └── refunds
│
├── underwriting_db
│   ├── underwriting_cases
│   ├── health_declarations
│   └── risk_rules
│
├── agent_db
│   ├── agents
│   └── training_records
│
├── commission_db
│   ├── commissions
│   └── commission_rules
│
├── notification_db
│   ├── notifications
│   └── notification_templates
│
├── document_db
│   └── documents
│
├── reporting_db
│   ├── audit_logs
│   └── reports
│
└── keycloak_db          ← Keycloak tự quản lý
    └── (Keycloak internal tables)
```

---

## ERD — Quan hệ giữa các entity

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ customers │────<│   policies   │────<│ beneficiaries│
│           │     │              │     └──────────────┘
│  id (PK)  │     │  id (PK)     │
│  email    │     │  customer_id │────>│ customers.id │
│  phone    │     │  product_id  │────>│ products.id  │
│  ...      │     │  agent_id    │────>│ agents.id    │
└──────────┘     │  status      │     ┌──────────────┐
     │            │  ...         │────<│ endorsements │
     │            └──────────────┘     └──────────────┘
     │                   │
     │                   │
     ▼                   ▼
┌──────────┐     ┌──────────────┐     ┌──────────────────┐
│  leads   │     │    claims    │────<│ claim_documents   │
│          │     │              │     └──────────────────┘
│ score    │     │  policy_id   │────>│ policies.id      │
│ status   │     │  customer_id │     ┌──────────────────┐
│ agent_id │     │  handler_id  │────<│ claim_timeline    │
└──────────┘     │  fraud_score │     └──────────────────┘
                 │  bank_account│
                 └──────────────┘
                        │
                        ▼
                 ┌──────────────┐     ┌──────────────────┐
                 │   payments   │     │ payment_schedule  │
                 │              │     │                   │
                 │  policy_id   │     │  policy_id        │
                 │  customer_id │     │  due_date         │
                 │  method      │     │  status           │
                 │  gateway     │     └──────────────────┘
                 └──────────────┘

┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ products │────<│ product_plans│────<│plan_benefits │
│          │     │              │     └──────────────┘
│  code    │     │  tier        │
│  category│     │  sum_insured │     ┌──────────────┐
│  status  │     │  premium     │     │product_riders│
└──────────┘     └──────────────┘     └──────────────┘

┌──────────┐     ┌──────────────┐     ┌──────────────────────┐
│  agents  │────<│ commissions  │     │ underwriting_cases   │
│          │     │              │     │                      │
│ code     │     │  agent_id    │     │  application_id      │
│ level    │     │  policy_no   │     │  risk_score          │
│ branch   │     │  rate        │     │  status              │
│ target   │     │  amount      │     │  health_declaration  │
└──────────┘     └──────────────┘     └──────────────────────┘

┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ partners │     │notifications │     │  audit_logs  │
│          │     │              │     │              │
│ type     │     │  user_id     │     │  username    │
│ tier     │     │  type        │     │  action      │
│ direct_  │     │  read        │     │  entity      │
│ billing  │     │  link        │     │  ip_address  │
└──────────┘     └──────────────┘     └──────────────┘
```

---

## Chi tiết từng bảng

### product_db

```sql
-- products
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(20) UNIQUE NOT NULL,
    name            VARCHAR(200) NOT NULL,
    category        VARCHAR(20) NOT NULL CHECK (category IN ('HEALTH','LIFE','MOTOR','PROPERTY','TRAVEL','ACCIDENT')),
    short_description TEXT,
    description     TEXT,
    image           VARCHAR(500),
    icon            VARCHAR(50),
    status          VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','ACTIVE','INACTIVE','ARCHIVED')),
    exclusions      TEXT[],
    tags            TEXT[],
    featured        BOOLEAN DEFAULT FALSE,
    rating          DECIMAL(2,1) DEFAULT 0,
    review_count    INTEGER DEFAULT 0,
    min_premium     BIGINT,
    max_premium     BIGINT,
    currency        VARCHAR(3) DEFAULT 'VND',
    tax_rate        DECIMAL(5,2) DEFAULT 0,
    auto_renewal    BOOLEAN DEFAULT TRUE,
    renewal_grace_period INTEGER DEFAULT 30,
    min_age         INTEGER,
    max_age         INTEGER,
    min_term        INTEGER,
    max_term        INTEGER,
    commission_first_year  DECIMAL(5,2),
    commission_renewal     DECIMAL(5,2),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);

-- product_plans
CREATE TABLE product_plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    tier            VARCHAR(20) CHECK (tier IN ('BRONZE','SILVER','GOLD','PLATINUM')),
    sum_insured     BIGINT NOT NULL,
    premium         BIGINT NOT NULL,
    premium_monthly BIGINT,
    recommended     BOOLEAN DEFAULT FALSE,
    description     TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_plans_product ON product_plans(product_id);

-- plan_benefits
CREATE TABLE plan_benefits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id         UUID NOT NULL REFERENCES product_plans(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    limit_value     VARCHAR(100),
    description     TEXT,
    included        BOOLEAN DEFAULT TRUE
);

-- product_riders
CREATE TABLE product_riders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    premium         BIGINT,
    sum_insured     BIGINT
);
```

### customer_db

```sql
-- customers
CREATE TABLE customers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(100) UNIQUE NOT NULL,
    email           VARCHAR(200) UNIQUE NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    avatar          VARCHAR(500),
    date_of_birth   DATE,
    gender          VARCHAR(10),
    id_number       VARCHAR(20),
    address         TEXT,
    occupation      VARCHAR(100),
    segment         VARCHAR(20) DEFAULT 'STANDARD' CHECK (segment IN ('STANDARD','SILVER','GOLD','PLATINUM','VIP')),
    lifetime_value  BIGINT DEFAULT 0,
    score           INTEGER DEFAULT 50,
    kyc_status      VARCHAR(20) DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING','VERIFIED','REJECTED')),
    enabled         BOOLEAN DEFAULT TRUE,
    email_verified  BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW(),
    last_login      TIMESTAMP
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_segment ON customers(segment);

-- leads
CREATE TABLE leads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source          VARCHAR(50) NOT NULL,
    status          VARCHAR(20) DEFAULT 'NEW' CHECK (status IN ('NEW','CONTACTED','QUALIFIED','PROPOSAL_SENT','WON','LOST')),
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    email           VARCHAR(200),
    phone           VARCHAR(20),
    interested_products TEXT[],
    assigned_to     UUID,
    score           INTEGER DEFAULT 0,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);

-- interactions
CREATE TABLE interactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID NOT NULL,
    type            VARCHAR(20) CHECK (type IN ('CALL','EMAIL','CLAIM','PORTAL','PAYMENT','SMS','CHAT')),
    date            DATE NOT NULL,
    note            TEXT,
    agent           VARCHAR(100),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interactions_customer ON interactions(customer_id);

-- data_privacy_consents
CREATE TABLE data_privacy_consents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID NOT NULL,
    consent_type    VARCHAR(20) CHECK (consent_type IN ('MARKETING','DATA_PROCESSING','SHARING')),
    granted         BOOLEAN DEFAULT FALSE,
    granted_at      TIMESTAMP,
    revoked_at      TIMESTAMP,
    UNIQUE (customer_id, consent_type)
);
```

### policy_db

```sql
-- policies
CREATE TABLE policies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_number   VARCHAR(30) UNIQUE NOT NULL,
    product_id      UUID NOT NULL,
    product_name    VARCHAR(200),
    product_category VARCHAR(20),
    plan_name       VARCHAR(100),
    customer_id     UUID NOT NULL,
    customer_name   VARCHAR(200),
    agent_id        UUID,
    agent_name      VARCHAR(200),
    status          VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PENDING_PAYMENT','ACTIVE','LAPSED','SUSPENDED','CANCELLED','EXPIRED','RENEWED')),
    sum_insured     BIGINT NOT NULL,
    premium         BIGINT NOT NULL,
    payment_frequency VARCHAR(20) DEFAULT 'ANNUAL' CHECK (payment_frequency IN ('ANNUAL','SEMI_ANNUAL','QUARTERLY','MONTHLY')),
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    next_payment_date DATE,
    auto_renewal    BOOLEAN DEFAULT TRUE,
    issued_at       TIMESTAMP,
    renewal_date    DATE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_policies_customer ON policies(customer_id);
CREATE INDEX idx_policies_agent ON policies(agent_id);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_number ON policies(policy_number);

-- beneficiaries
CREATE TABLE beneficiaries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id       UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    relationship    VARCHAR(50),
    percentage      DECIMAL(5,2) CHECK (percentage > 0 AND percentage <= 100),
    id_number       VARCHAR(20),
    phone           VARCHAR(20)
);

-- endorsements
CREATE TABLE endorsements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id       UUID NOT NULL REFERENCES policies(id),
    type            VARCHAR(30) CHECK (type IN ('ADD_BENEFICIARY','CHANGE_ADDRESS','CHANGE_SUM_INSURED','CHANGE_PAYMENT','ADD_RIDER')),
    request_date    DATE NOT NULL,
    approved_date   DATE,
    effective_date  DATE,
    changes         JSONB,
    status          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### claims_db

```sql
-- claims
CREATE TABLE claims (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_number    VARCHAR(30) UNIQUE NOT NULL,
    policy_id       UUID NOT NULL,
    policy_number   VARCHAR(30),
    customer_id     UUID NOT NULL,
    customer_name   VARCHAR(200),
    product_category VARCHAR(20),
    type            VARCHAR(30),
    status          VARCHAR(30) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','SUBMITTED','UNDER_REVIEW','ADDITIONAL_INFO_REQUIRED','APPROVED','PARTIALLY_APPROVED','REJECTED','PAID','CLOSED')),
    description     TEXT,
    incident_date   DATE NOT NULL,
    submission_date DATE,
    claimed_amount  BIGINT NOT NULL,
    approved_amount BIGINT,
    deductible      BIGINT DEFAULT 0,
    handler_id      UUID,
    handler_name    VARCHAR(200),
    fraud_score     INTEGER DEFAULT 0,
    bank_name       VARCHAR(100),
    account_number  VARCHAR(30),
    account_holder  VARCHAR(200),
    bank_branch     VARCHAR(200),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_claims_customer ON claims(customer_id);
CREATE INDEX idx_claims_policy ON claims(policy_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_handler ON claims(handler_id);

-- claim_documents
CREATE TABLE claim_documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id        UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    type            VARCHAR(30),
    name            VARCHAR(200),
    file_name       VARCHAR(300),
    file_url        VARCHAR(500),
    uploaded_at     TIMESTAMP DEFAULT NOW(),
    ocr_data        JSONB,
    verified        BOOLEAN DEFAULT FALSE
);

-- claim_timeline
CREATE TABLE claim_timeline (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id        UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    status          VARCHAR(30),
    description     TEXT,
    timestamp       TIMESTAMP NOT NULL,
    actor           VARCHAR(200),
    notes           TEXT
);

CREATE INDEX idx_timeline_claim ON claim_timeline(claim_id);
```

### payment_db

```sql
-- payments
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  VARCHAR(50) UNIQUE NOT NULL,
    policy_id       UUID NOT NULL,
    policy_number   VARCHAR(30),
    customer_id     UUID NOT NULL,
    amount          BIGINT NOT NULL,
    currency        VARCHAR(3) DEFAULT 'VND',
    method          VARCHAR(20) CHECK (method IN ('BANK_TRANSFER','CREDIT_CARD','E_WALLET_MOMO','E_WALLET_VNPAY','E_WALLET_ZALOPAY','CASH')),
    gateway         VARCHAR(30),
    status          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','SUCCESS','FAILED','REFUNDED')),
    description     TEXT,
    paid_at         TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_policy ON payments(policy_id);
CREATE INDEX idx_payments_status ON payments(status);

-- payment_schedule
CREATE TABLE payment_schedule (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id       UUID NOT NULL,
    policy_number   VARCHAR(30),
    product_name    VARCHAR(200),
    premium         BIGINT NOT NULL,
    due_date        DATE NOT NULL,
    status          VARCHAR(20) DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING','PAID','OVERDUE','GRACE_PERIOD')),
    reminder_sent   BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_schedule_due ON payment_schedule(due_date);
CREATE INDEX idx_schedule_status ON payment_schedule(status);

-- refunds
CREATE TABLE refunds (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id      UUID NOT NULL REFERENCES payments(id),
    amount          BIGINT NOT NULL,
    reason          TEXT,
    status          VARCHAR(20) DEFAULT 'PENDING',
    processed_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### underwriting_db

```sql
-- underwriting_cases
CREATE TABLE underwriting_cases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  VARCHAR(30) UNIQUE NOT NULL,
    customer_name   VARCHAR(200),
    product_name    VARCHAR(200),
    plan_name       VARCHAR(100),
    sum_insured     BIGINT,
    premium         BIGINT,
    risk_level      VARCHAR(10) CHECK (risk_level IN ('LOW','MEDIUM','HIGH')),
    risk_score      INTEGER DEFAULT 0,
    status          VARCHAR(30) DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW','AUTO_APPROVED','APPROVED_WITH_LOADING','DECLINED','MEDICAL_REQUIRED')),
    assignee_id     UUID,
    sla_deadline    TIMESTAMP,
    notes           TEXT,
    submitted_at    TIMESTAMP,
    agent_name      VARCHAR(200),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_uw_status ON underwriting_cases(status);
CREATE INDEX idx_uw_assignee ON underwriting_cases(assignee_id);

-- health_declarations
CREATE TABLE health_declarations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id         UUID NOT NULL REFERENCES underwriting_cases(id) ON DELETE CASCADE,
    smoker          BOOLEAN DEFAULT FALSE,
    bmi             DECIMAL(4,1),
    pre_conditions  TEXT[],
    medical_history JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- risk_rules
CREATE TABLE risk_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_code       VARCHAR(30) UNIQUE NOT NULL,
    category        VARCHAR(20),
    condition_expr  TEXT NOT NULL,
    score_impact    INTEGER,
    action          VARCHAR(20) CHECK (action IN ('AUTO_APPROVE','MANUAL_REVIEW','SURCHARGE','DECLINE','EXCLUDE')),
    active          BOOLEAN DEFAULT TRUE
);
```

### agent_db / commission_db / notification_db / document_db / reporting_db

```sql
-- agents
CREATE TABLE agents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_code      VARCHAR(20) UNIQUE NOT NULL,
    full_name       VARCHAR(200) NOT NULL,
    email           VARCHAR(200),
    phone           VARCHAR(20),
    type            VARCHAR(30) CHECK (type IN ('EXCLUSIVE','BROKER','FINANCIAL_ADVISOR')),
    level           VARCHAR(20) CHECK (level IN ('NEWBIE','SENIOR','MANAGER','DIRECTOR')),
    branch_name     VARCHAR(100),
    status          VARCHAR(20) DEFAULT 'ACTIVE',
    total_policies  INTEGER DEFAULT 0,
    total_premium   BIGINT DEFAULT 0,
    total_commission BIGINT DEFAULT 0,
    monthly_target  BIGINT DEFAULT 0,
    monthly_achieved BIGINT DEFAULT 0,
    clients         INTEGER DEFAULT 0,
    upline_id       UUID REFERENCES agents(id),
    join_date       DATE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- commissions
CREATE TABLE commissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id        UUID NOT NULL,
    policy_number   VARCHAR(30),
    customer_name   VARCHAR(200),
    product_name    VARCHAR(200),
    type            VARCHAR(20) CHECK (type IN ('FIRST_YEAR','RENEWAL','BONUS')),
    premium         BIGINT,
    rate            DECIMAL(5,2),
    amount          BIGINT NOT NULL,
    status          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','PAID','CLAWBACK')),
    period          VARCHAR(7),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_commissions_agent ON commissions(agent_id);

-- partners
CREATE TABLE partners (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    type            VARCHAR(20) CHECK (type IN ('HOSPITAL','CLINIC','GARAGE','BANK','ECOMMERCE')),
    tier            VARCHAR(10) CHECK (tier IN ('TIER_1','TIER_2','TIER_3')),
    address         TEXT,
    phone           VARCHAR(20),
    email           VARCHAR(200),
    contact_person  VARCHAR(200),
    status          VARCHAR(20) DEFAULT 'ACTIVE',
    direct_billing  BOOLEAN DEFAULT FALSE,
    specialties     TEXT[],
    claims_handled  INTEGER DEFAULT 0,
    total_billing   BIGINT DEFAULT 0,
    fee_schedule    JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- notifications
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    type            VARCHAR(20) CHECK (type IN ('SUCCESS','WARNING','INFO','ERROR')),
    title           VARCHAR(200) NOT NULL,
    message         TEXT,
    link            VARCHAR(500),
    read            BOOLEAN DEFAULT FALSE,
    icon            VARCHAR(50),
    color           VARCHAR(7),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- audit_logs
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(100) NOT NULL,
    role            VARCHAR(30),
    action          VARCHAR(20) CHECK (action IN ('CREATE','UPDATE','DELETE','APPROVE','REJECT','SUBMIT','LOGIN','LOGOUT','PAYMENT','QUERY','CONFIG')),
    entity          VARCHAR(50),
    entity_id       VARCHAR(50),
    details         TEXT,
    ip_address      VARCHAR(45),
    status          VARCHAR(20) DEFAULT 'SUCCESS',
    timestamp       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_username ON audit_logs(username);
CREATE INDEX idx_audit_entity ON audit_logs(entity, entity_id);

-- documents
CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type     VARCHAR(30),
    entity_id       UUID,
    type            VARCHAR(50),
    name            VARCHAR(200),
    file_name       VARCHAR(300),
    file_path       VARCHAR(500),
    mime_type       VARCHAR(100),
    size_bytes      BIGINT,
    storage_bucket  VARCHAR(100) DEFAULT 'insurance-hub',
    ocr_data        JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

---

## Index Strategy

```
Bảng               Index                              Mục đích
─────────────────   ─────────────────────────────────  ──────────────────────
policies            (customer_id)                      Tra cứu HĐ theo KH
policies            (status)                           Filter theo trạng thái
policies            (policy_number)                    Tìm nhanh theo mã HĐ
claims              (customer_id)                      Tra cứu BT theo KH
claims              (status, handler_id)               Phân công xử lý
payments            (customer_id, status)              Lịch sử TT
payment_schedule    (due_date, status)                 Dunning process
notifications       (user_id, read)                    Badge count
audit_logs          (timestamp DESC)                   Xem gần nhất
audit_logs          (entity, entity_id)                Trace changes
commissions         (agent_id, period)                 Statement tháng
leads               (assigned_to, status)              Pipeline đại lý
```
