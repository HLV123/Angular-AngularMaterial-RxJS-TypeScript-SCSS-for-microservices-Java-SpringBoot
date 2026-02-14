// === USER & AUTH ===
export interface User {
  id: string; username: string; email: string; firstName: string; lastName: string;
  phone?: string; avatar?: string; roles: UserRole[]; permissions: string[];
  enabled: boolean; emailVerified: boolean; createdAt: string; lastLogin?: string;
}
export enum UserRole {
  CUSTOMER='CUSTOMER', AGENT='AGENT', SALES_STAFF='SALES_STAFF', UNDERWRITER='UNDERWRITER',
  CLAIMS_HANDLER='CLAIMS_HANDLER', CUSTOMER_SERVICE='CUSTOMER_SERVICE', ACCOUNTANT='ACCOUNTANT',
  BRANCH_MANAGER='BRANCH_MANAGER', REGIONAL_MANAGER='REGIONAL_MANAGER', PRODUCT_MANAGER='PRODUCT_MANAGER',
  COMPLIANCE_OFFICER='COMPLIANCE_OFFICER', PARTNER='PARTNER', ADMIN='ADMIN', SUPER_ADMIN='SUPER_ADMIN'
}
export interface LoginRequest { username: string; password: string; rememberMe?: boolean; }
export interface LoginResponse { accessToken: string; refreshToken: string; tokenType: string; expiresIn: number; user: User; }
export interface RegisterRequest { username: string; email: string; password: string; firstName: string; lastName: string; phone: string; userType: string; agreeTerms: boolean; }

// === PRODUCT ===
export enum ProductCategory { HEALTH='HEALTH', LIFE='LIFE', MOTOR='MOTOR', PROPERTY='PROPERTY', TRAVEL='TRAVEL', ACCIDENT='ACCIDENT' }
export interface PlanBenefit { name: string; limit: string; description: string; included: boolean; }
export interface ProductRider { id: string; name: string; description: string; premium: number; sumInsured: number; }
export interface ProductPlan { id: string; name: string; tier: string; sumInsured: number; premium: number; premiumMonthly: number; benefits: PlanBenefit[]; recommended: boolean; description: string; }
export interface ProductEligibility { minAge: number; maxAge: number; minTerm: number; maxTerm: number; occupationExclusions?: string[]; }
export interface Product {
  id: string; code: string; name: string; category: ProductCategory; shortDescription: string; description: string;
  image: string; icon: string; status: string; plans: ProductPlan[]; exclusions: string[];
  eligibility: ProductEligibility; tags: string[]; featured: boolean; rating: number; reviewCount: number;
  minPremium: number; maxPremium: number; currency: string;
  riders?: ProductRider[]; taxRate?: number; autoRenewal?: boolean; renewalGracePeriod?: number;
  underwritingRules?: any; commissionStructure?: { firstYear: number; renewal: number; };
  createdAt: string; updatedAt: string;
}

// === QUOTE ===
export interface QuoteBreakdown { item: string; amount: number; }
export interface Quote {
  id: string; quoteNumber: string; productId: string; productName: string; planId: string; planName: string;
  status: string; sumInsured: number; totalPremium: number; premiumMonthly: number; premiumAnnual: number;
  validUntil: string; breakdown: QuoteBreakdown[]; createdAt: string;
}

// === POLICY ===
export enum PolicyStatus { DRAFT='DRAFT', PENDING_PAYMENT='PENDING_PAYMENT', ACTIVE='ACTIVE', LAPSED='LAPSED', SUSPENDED='SUSPENDED', CANCELLED='CANCELLED', EXPIRED='EXPIRED', RENEWED='RENEWED' }
export interface Beneficiary { name: string; relationship: string; percentage: number; idNumber?: string; phone?: string; }
export interface Endorsement { id: string; type: 'ADD_BENEFICIARY'|'CHANGE_ADDRESS'|'CHANGE_SUM_INSURED'|'CHANGE_PAYMENT'|'ADD_RIDER'; requestDate: string; approvedDate?: string; effectiveDate?: string; changes: any; status: string; }
export interface Policy {
  id: string; policyNumber: string; productId: string; productName: string; productCategory: ProductCategory;
  planName: string; customerId: string; customerName: string; agentId?: string; agentName?: string;
  status: PolicyStatus; sumInsured: number; premium: number; paymentFrequency: string;
  startDate: string; endDate: string; nextPaymentDate: string;
  beneficiaries: Beneficiary[]; endorsements: Endorsement[];
  autoRenewal?: boolean; issuedAt: string; renewalDate?: string; createdAt: string; updatedAt: string;
}

// === CLAIMS ===
export enum ClaimStatus { DRAFT='DRAFT', SUBMITTED='SUBMITTED', UNDER_REVIEW='UNDER_REVIEW', ADDITIONAL_INFO_REQUIRED='ADDITIONAL_INFO_REQUIRED', APPROVED='APPROVED', PARTIALLY_APPROVED='PARTIALLY_APPROVED', REJECTED='REJECTED', PAID='PAID', CLOSED='CLOSED' }
export interface ClaimDocument { id: string; type: string; name: string; fileName: string; fileUrl?: string; uploadedAt: string; ocrData?: OCRData; verified: boolean; }
export interface OCRData { invoiceNumber?: string; invoiceDate?: string; amount?: number; hospital?: string; diagnosis?: string; rawText?: string; confidence?: number; }
export interface ClaimTimeline { status: ClaimStatus|string; description: string; timestamp: string; actor: string; notes?: string; }
export interface BankAccount { bankName: string; accountNumber: string; accountHolder: string; branch?: string; }
export interface Claim {
  id: string; claimNumber: string; policyId: string; policyNumber: string; customerId: string; customerName: string;
  productCategory: ProductCategory; type: string; status: ClaimStatus; description: string;
  incidentDate: string; submissionDate: string; claimedAmount: number; approvedAmount?: number; deductible: number;
  documents: ClaimDocument[]; handler?: string; handlerName?: string; notes: any[];
  fraudScore?: number; timeline: ClaimTimeline[]; bankAccount?: BankAccount;
  createdAt: string; updatedAt: string;
}

// === PAYMENT ===
export enum PaymentMethod { BANK_TRANSFER='BANK_TRANSFER', CREDIT_CARD='CREDIT_CARD', E_WALLET_MOMO='E_WALLET_MOMO', E_WALLET_VNPAY='E_WALLET_VNPAY', E_WALLET_ZALOPAY='E_WALLET_ZALOPAY', CASH='CASH' }
export interface Payment { id: string; transactionId: string; policyId: string; policyNumber: string; customerId: string; amount: number; currency: string; method: PaymentMethod; gateway: string; status: string; description: string; paidAt?: string; createdAt: string; }

// === AGENT ===
export interface Agent { id: string; agentCode: string; fullName: string; email: string; phone: string; type: string; level: string; branchName: string; status: string; totalPolicies: number; totalPremium: number; totalCommission: number; monthlyTarget: number; monthlyAchieved: number; joinDate: string; clients: number; uplineId?: string; downlineIds?: string[]; }
export interface Commission { id: string; agentId: string; policyNumber: string; customerName: string; productName: string; type: string; premium: number; rate: number; amount: number; status: string; period: string; createdAt: string; }

// === PARTNER ===
export interface Partner { id: string; name: string; type: string; tier: string; address: string; phone: string; email: string; contactPerson: string; status: string; directBilling: boolean; specialties?: string[]; claimsHandled: number; totalBilling: number; feeSchedule?: any; }

// === NOTIFICATION ===
export interface Notification { id: string; userId: string; type: string; title: string; message: string; link?: string; read: boolean; createdAt: string; icon?: string; color?: string; }

// === DASHBOARD ===
export interface ChartData { label: string; value: number; color?: string; }
export interface DashboardStats { totalPolicies: number; activePolicies: number; totalPremium: number; totalClaims: number; pendingClaims: number; lossRatio: number; newPoliciesThisMonth: number; premiumGrowth: number; monthlyPremium: ChartData[]; claimsByCategory: ChartData[]; policyByStatus: ChartData[]; recentActivities: any[]; topAgents: any[]; topProducts: any[]; }

// === AUDIT ===
export interface AuditLog { id: string; username: string; role: string; action: string; entity: string; entityId: string; details: string; ipAddress: string; timestamp: string; status: string; }

// === DATA PRIVACY ===
export interface DataPrivacyConsent { customerId: string; consentType: 'MARKETING'|'DATA_PROCESSING'|'SHARING'; granted: boolean; grantedAt: string; revokedAt?: string; }
