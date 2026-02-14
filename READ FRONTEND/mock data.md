# Mock Data Guide — Insurance Hub

## Tổng quan

Frontend chạy hoàn toàn bằng mock data khi `useMockData: true`. Toàn bộ data nằm trong file `src/app/core/services/mock-data.service.ts`.

---

## 1. Tài khoản Demo

```
Username                Password    Role                ID
──────────────────────  ──────────  ──────────────────  ────
customer@demo.com       Demo@123    CUSTOMER            U01
agent@demo.com          Demo@123    AGENT               U02
admin@demo.com          Demo@123    ADMIN+SUPER_ADMIN   U03
underwriter@demo.com    Demo@123    UNDERWRITER         U04
claims@demo.com         Demo@123    CLAIMS_HANDLER      U05
partner@demo.com        Demo@123    PARTNER             U06
sales@demo.com          Demo@123    SALES_STAFF         U07
cs@demo.com             Demo@123    CUSTOMER_SERVICE    U08
accountant@demo.com     Demo@123    ACCOUNTANT          U09
branch@demo.com         Demo@123    BRANCH_MANAGER      U10
regional@demo.com       Demo@123    REGIONAL_MANAGER    U11
pm@demo.com             Demo@123    PRODUCT_MANAGER     U12
compliance@demo.com     Demo@123    COMPLIANCE_OFFICER  U13
```

---

## 2. Sơ đồ quan hệ dữ liệu

Toàn bộ mock data xoay quanh khách hàng chính **Nguyễn Văn An (U01)** và đại lý **Trần Thị Bình (U02)**:

```
Nguyễn Văn An (U01 - CUSTOMER)
│
├── 6 Hợp đồng (Policies)
│   ├── POL01  BH Sức khỏe    ACTIVE          12,000,000₫/năm   Agent: U02
│   ├── POL02  BH Xe ô tô     ACTIVE           8,000,000₫/năm
│   ├── POL03  BH Nhân thọ    ACTIVE          25,000,000₫/năm   Agent: U02
│   ├── POL04  BH Du lịch     EXPIRED            350,000₫
│   ├── POL05  BH Tai nạn     ACTIVE           1,500,000₫/năm
│   └── POL06  BH Nhà ở       PENDING_PAYMENT  4,000,000₫/năm
│
├── 4 Bồi thường (Claims)
│   ├── CLM01  POL01 (Sức khỏe)  Ngoại trú     2,500,000₫  → PAID      Handler: U05
│   ├── CLM02  POL02 (Xe)        Va chạm        8,500,000₫  → UNDER_REVIEW
│   ├── CLM03  POL01 (Sức khỏe)  Nội trú       25,000,000₫ → APPROVED
│   └── CLM04  POL05 (Tai nạn)   Thể thao       3,500,000₫ → ADDITIONAL_INFO
│
├── 6 Thanh toán (Payments)
│   ├── PAY01  POL01  VNPay     12,000,000₫   SUCCESS
│   ├── PAY02  POL02  Napas      8,000,000₫   SUCCESS
│   ├── PAY03  POL03  OnePay    25,000,000₫   SUCCESS
│   ├── PAY04  POL04  Momo         350,000₫   SUCCESS
│   ├── PAY05  POL05  ZaloPay    1,500,000₫   SUCCESS
│   └── PAY06  POL06  Napas      4,000,000₫   PENDING
│
├── 4 Thông báo chưa đọc
│   ├── N01  "Thanh toán thành công BH Nhà ở"
│   ├── N02  "HĐ BH Xe sắp hết hạn"
│   ├── N03  "Thanh toán BH Sức khỏe thành công"
│   └── N04  "Yêu cầu BT cần bổ sung"
│
└── Customer 360
    ├── Segment: GOLD
    ├── Score: 92
    ├── Lifetime Value: 46,850,000₫
    └── Cross-sell: BH Nhà ở, Nâng cấp BH Xe, BH Du lịch


Trần Thị Bình (U02 - AGENT)
│
├── 5 Hoa hồng (Commissions)
│   ├── COM01  POL01  First Year  20%  2,400,000₫  PAID
│   ├── COM02  POL03  First Year  25%  6,250,000₫  PAID
│   ├── COM03         First Year  20%  4,400,000₫  APPROVED
│   ├── COM04         Renewal      7%  1,050,000₫  PENDING
│   └── COM05         First Year  15%  2,250,000₫  PAID
│
├── 6 Leads
│   ├── LD01  Phạm Thị Hoa     Website     Score:85  NEW
│   ├── LD02  Trần Minh Đức    Facebook    Score:60  CONTACTED
│   ├── LD03  Lê Văn Bình      Referral    Score:92  QUALIFIED
│   ├── LD04  Nguyễn Thúy An   Bancassur.  Score:75  PROPOSAL_SENT
│   ├── LD05  Hoàng Đức Minh   Walk-in     Score:100 WON
│   └── LD06  Vũ Thị Ngọc      Website     Score:40  LOST
│
└── 3 Thông báo chưa đọc
```

---

## 3. Products (6 sản phẩm)

```
ID     Tên                           Category   Plans                  Giá (năm)
─────  ────────────────────────────  ─────────  ─────────────────────  ──────────────────
PRD01  BH Sức khỏe Toàn diện        HEALTH     Bronze/Silver/Gold     6-36 triệu
PRD02  BH Nhân thọ An Phúc          LIFE       Hỗn hợp 10/15/20 năm  15-50 triệu
PRD03  BH Xe Ô tô Toàn diện        MOTOR      Cơ bản/Silver/Gold     4.5-15 triệu
PRD04  BH Nhà ở An Cư              PROPERTY   Homeowner B/S/G        2-10 triệu
PRD05  BH Du lịch Toàn Cầu         TRAVEL     Châu Á/QT/Premium      250k-2 triệu
PRD06  BH Tai nạn 24/7             ACCIDENT   Cơ bản/Nâng cao        800k-3 triệu
```

Mỗi plan có danh sách benefits chi tiết (limit, mô tả, included/excluded).

---

## 4. Agents (5 đại lý)

```
Code    Tên               Loại               Level      Chi nhánh    Target       Achieved
──────  ────────────────  ─────────────────  ─────────  ───────────  ───────────  ──────────
AG001   Trần Thị Bình     EXCLUSIVE          SENIOR     HCM          500 triệu    580 triệu
AG002   Phạm Quốc Anh     BROKER             MANAGER    Hà Nội       800 triệu    650 triệu
AG003   Lê Thanh Hùng     EXCLUSIVE          NEWBIE     Đà Nẵng      200 triệu    120 triệu
AG004   Nguyễn Thu Trang   FINANCIAL_ADVISOR  DIRECTOR   HCM          1 tỷ         1.2 tỷ
AG005   Hoàng Đức Mạnh    EXCLUSIVE          SENIOR     Hà Nội       400 triệu    380 triệu
```

---

## 5. Partners (6 đối tác)

```
ID     Tên                Loại       Tier    Direct Billing   Chuyên khoa
─────  ─────────────────  ─────────  ──────  ──────────────   ────────────────────────
PTR01  BV Vinmec          HOSPITAL   TIER_1  ✅               Tim mạch, Nhi, Sản, UB
PTR02  BV FV Hospital     HOSPITAL   TIER_1  ✅               Ngoại, Nội, Chẩn đoán hình ảnh
PTR03  BV Hồng Ngọc       HOSPITAL   TIER_2  ✅               Nội tổng hợp, Nhi, Da liễu
PTR04  Gara Thành Công    GARAGE     TIER_2  ❌               —
PTR05  Gara Auto King     GARAGE     TIER_2  ❌               —
PTR06  Vietcombank         BANK       TIER_1  ❌               —
```

---

## 6. Underwriting Queue (5 hồ sơ)

```
ID     Application         Khách hàng       Sản phẩm           Risk    Score  Status
─────  ──────────────────  ───────────────  ─────────────────  ──────  ─────  ──────────────────
UW01   APP-2024-00125      Lê Văn Hoàng     BH Sức khỏe        HIGH    78     PENDING_REVIEW
UW02   APP-2024-00126      Phạm Thị Mai     BH Nhân thọ        MEDIUM  45     PENDING_REVIEW
UW03   APP-2024-00127      Trần Đức Anh     BH Tai nạn         LOW     15     AUTO_APPROVED
UW04   APP-2024-00128      Nguyễn Thị Lan   BH Sức khỏe        MEDIUM  52     APPROVED_WITH_LOADING
UW05   APP-2024-00129      Võ Minh Tuấn     BH Nhân thọ        HIGH    92     DECLINED
```

UW01 có health declaration: smoker=true, BMI=28.5, pre-conditions: Huyết áp cao + Tiểu đường type 2.

---

## 7. Notifications (21 thông báo, 6 roles)

```
User    Unread  Nội dung chính
──────  ──────  ────────────────────────────────────────────────
U01      4      BT thanh toán, HĐ sắp hết hạn, thanh toán OK, cần bổ sung
U02      3      Hoa hồng duyệt, lead mới, cảnh báo target
U03      2      Fraud alert, auto-renewals, DB backup
U04      3      3 hồ sơ chờ duyệt, SLA warning, auto-approvals
U05      2      Claim mới, cần duyệt, kiểm tra gian lận
U06      1      Yêu cầu bảo lãnh viện phí
```

---

## 8. Audit Logs (10 records)

```
ID     User               Action    Entity          Mô tả
─────  ─────────────────  ────────  ──────────────  ──────────────────────────────────
AL01   customer@demo.com  CREATE    Quote           Tạo báo giá BH Sức khỏe
AL02   customer@demo.com  CREATE    Policy          Mua BH Sức khỏe Silver
AL03   agent@demo.com     CREATE    Policy          Tư vấn BH Nhân thọ cho KH An
AL04   customer@demo.com  SUBMIT    Claim           Nộp BT ngoại trú CLM01
AL05   claims@demo.com    APPROVE   Claim           Duyệt BT CLM01 2,200,000₫
AL06   admin@demo.com     UPDATE    Product         Cập nhật BH Sức khỏe premium
AL07   underwriter@       APPROVE   Underwriting    Duyệt hồ sơ UW thẩm định
AL08   partner@demo.com   QUERY     Eligibility     BV Vinmec tra cứu quyền lợi
AL09   admin@demo.com     CONFIG    System          Cập nhật config email
AL10   customer@demo.com  LOGIN     Auth            Đăng nhập thành công
```

---

## 9. Hướng dẫn test theo luồng nghiệp vụ

### Luồng 1: Mua bảo hiểm (Customer)

```
1. Đăng nhập: customer@demo.com / Demo@123
2. Trang chủ → xem 6 sản phẩm nổi bật
3. Click "BH Sức khỏe" → xem chi tiết 3 plans (Bronze/Silver/Gold)
4. Click "Tạo báo giá" → nhập thông tin → nhận quote
5. Menu "Hợp đồng" → thấy 6 HĐ (4 Active, 1 Expired, 1 Pending)
6. Click POL01 → xem chi tiết, beneficiaries, endorsements
7. Menu "Thanh toán" → thấy 6 giao dịch (5 Success, 1 Pending)
8. Lịch thanh toán → thấy HĐ sắp đến hạn + quá hạn
```

### Luồng 2: Bồi thường (Customer → Claims Handler)

```
1. Đăng nhập: customer@demo.com
2. Menu "Bồi thường" → "Nộp yêu cầu mới"
3. Chọn HĐ, mô tả sự kiện, upload hồ sơ → Submit
4. Menu "Danh sách BT" → thấy 4 claims (PAID, UNDER_REVIEW, APPROVED, ADDITIONAL_INFO)
5. Click CLM01 → xem timeline 4 bước, documents, approved amount

6. Đăng xuất → Đăng nhập: claims@demo.com
7. Dashboard Claims → 4 claims, 1 đang xét, 1 fraud alert
8. Xem CLM02 → fraud score 12, action buttons: Approve/Reject/Request Info
```

### Luồng 3: Đại lý (Agent)

```
1. Đăng nhập: agent@demo.com
2. Dashboard → KPI cards (policies, premium, commission, target)
3. Tab "Khách hàng" → danh sách KH được quản lý
4. Tab "Leads" → 6 leads, pipeline từ NEW → WON/LOST
5. Tab "Hoa hồng" → 5 records (PAID, APPROVED, PENDING)
6. Tab "Leaderboard" → 5 agents xếp hạng theo premium
```

### Luồng 4: Thẩm định (Underwriter)

```
1. Đăng nhập: underwriter@demo.com
2. Dashboard → 5 hồ sơ thẩm định
3. UW01 (HIGH risk, score 78) → xem health declaration: smoker, BMI 28.5
4. Action: Approve, Approve+Loading, Request Medical, Decline
5. UW03 (LOW risk) → đã AUTO_APPROVED
```

### Luồng 5: Đối tác (Partner)

```
1. Đăng nhập: partner@demo.com
2. Dashboard → thông tin BV Vinmec, thống kê
3. Direct Billing → tra cứu eligibility bằng mã HĐ
4. Kết quả: hiện thông tin KH, plan, limits, số đã dùng
```

### Luồng 6: Admin

```
1. Đăng nhập: admin@demo.com
2. Admin Dashboard → 8 KPI cards, 3 biểu đồ, bảng hoạt động gần đây
3. Sidebar 10 menu: Users, Products, Policies, Claims, Agents, Partners, Reports, Audit, Config, Monitoring
4. Audit Log → 10 records, filter theo user/entity/action
5. Monitoring → 6 services (API Gateway, PostgreSQL, Redis, Kafka, Keycloak, ELK)
```

---

## 10. Lưu ý khi thêm mock data

Khi thêm data mới vào `mock-data.service.ts`, đảm bảo:

- **ID duy nhất**: POL07, CLM05, PAY07...
- **Foreign keys nhất quán**: `customerId` phải trỏ đúng user, `policyId` trong claim phải là policy tồn tại
- **Timeline logic**: timestamp phải theo thứ tự thời gian SUBMITTED → UNDER_REVIEW → APPROVED → PAID
- **Số liệu khớp**: `approvedAmount + deductible ≈ claimedAmount`
- **Notifications**: thêm vào mảng `notificationsAll`, đặt `userId` đúng
