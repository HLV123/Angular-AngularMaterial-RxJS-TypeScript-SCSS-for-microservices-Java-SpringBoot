import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MockDataService } from './mock-data.service';
import { Product, ProductCategory, Policy, Claim, Payment, DashboardStats, Notification, Agent, Commission, Partner, AuditLog } from '../models';
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient, private mock: MockDataService) {}
  getProducts(c?: ProductCategory): Observable<Product[]> { const d = c ? this.mock.getProductsByCategory(c) : this.mock.getProducts(); return of(d).pipe(delay(200)); }
  getProductById(id: string): Observable<any> { return of(this.mock.getProductById(id)).pipe(delay(150)); }
  getFeaturedProducts(): Observable<Product[]> { return of(this.mock.getFeaturedProducts()).pipe(delay(200)); }
  getPolicies(cid?: string): Observable<Policy[]> { return of(this.mock.getPolicies(cid)).pipe(delay(200)); }
  getPolicyById(id: string): Observable<any> { return of(this.mock.getPolicyById(id)).pipe(delay(150)); }
  getClaims(cid?: string): Observable<Claim[]> { return of(this.mock.getClaims(cid)).pipe(delay(200)); }
  getClaimById(id: string): Observable<any> { return of(this.mock.getClaimById(id)).pipe(delay(150)); }
  getPayments(cid?: string): Observable<Payment[]> { return of(this.mock.getPayments(cid)).pipe(delay(200)); }
  getDashboardStats(): Observable<DashboardStats> { return of(this.mock.getDashboardStats()).pipe(delay(300)); }
  getNotifications(uid: string): Observable<Notification[]> { return of(this.mock.getNotifications(uid)).pipe(delay(100)); }
  getAgents(): Observable<Agent[]> { return of(this.mock.getAgents()).pipe(delay(200)); }
  getCommissions(aid?: string): Observable<Commission[]> { return of(this.mock.getCommissions(aid)).pipe(delay(200)); }
  getPartners(): Observable<Partner[]> { return of(this.mock.getPartners()).pipe(delay(200)); }
  getAuditLogs(): Observable<AuditLog[]> { return of(this.mock.getAuditLogs()).pipe(delay(200)); }
  getAllUsers(): Observable<any[]> { return of(this.mock.getAllUsers()).pipe(delay(200)); }
  getLeads(): Observable<any[]> { return of(this.mock.getLeads()).pipe(delay(200)); }
  getUWQueue(): Observable<any[]> { return of(this.mock.getUWQueue()).pipe(delay(200)); }
  getCustomer360(): Observable<any> { return of(this.mock.getCustomer360()).pipe(delay(200)); }
  getPaymentSchedule(): Observable<any[]> { return of(this.mock.getPaymentSchedule()).pipe(delay(200)); }
  createQuote(req: any): Observable<any> { return of({ id:'QT-'+Date.now(), quoteNumber:'IH-QT-'+Date.now(), totalPremium:9500000, premiumMonthly:855000, premiumAnnual:9500000, validUntil:'2024-07-10', breakdown:[{item:'Phí cơ bản',amount:10000000},{item:'Giảm giá online -5%',amount:-500000}] }).pipe(delay(800)); }
  submitClaim(c: any): Observable<any> { return of({ success:true, claimNumber:'IH-CLM-'+Date.now() }).pipe(delay(800)); }

  // === CRUD Operations ===
  // Policy CRUD
  createPolicy(data: any): Observable<any> { return of({ ...data, id:'POL-'+Date.now(), policyNumber:'IH-'+Date.now(), status:'PENDING_PAYMENT', createdAt:new Date().toISOString() }).pipe(delay(500)); }
  updatePolicy(id: string, data: any): Observable<any> { return of({ ...data, id, updatedAt:new Date().toISOString() }).pipe(delay(400)); }
  deletePolicy(id: string): Observable<void> { return of(undefined as void).pipe(delay(300)); }
  renewPolicy(id: string): Observable<any> { return of({ success:true, newPolicyId:'POL-REN-'+Date.now() }).pipe(delay(600)); }
  endorsePolicy(id: string, data: any): Observable<any> { return of({ success:true, endorsementId:'END-'+Date.now() }).pipe(delay(500)); }
  cancelPolicy(id: string, reason: string): Observable<any> { return of({ success:true, refundAmount:0 }).pipe(delay(500)); }

  // Claims CRUD
  approveClaim(id: string, decision: any): Observable<any> { return of({ success:true, status:'APPROVED', approvedAmount:decision.amount }).pipe(delay(600)); }
  rejectClaim(id: string, reason: string): Observable<any> { return of({ success:true, status:'REJECTED', reason }).pipe(delay(500)); }
  requestClaimInfo(id: string, message: string): Observable<any> { return of({ success:true, status:'ADDITIONAL_INFO_REQUIRED' }).pipe(delay(400)); }

  // Underwriting
  approveUnderwriting(id: string, decision: any): Observable<any> { return of({ success:true, status:'APPROVED', ...decision }).pipe(delay(600)); }
  declineUnderwriting(id: string, reason: string): Observable<any> { return of({ success:true, status:'DECLINED', reason }).pipe(delay(500)); }

  // Payment
  processPayment(data: any): Observable<any> { return of({ success:true, transactionId:'TXN-'+Date.now(), status:'SUCCESS', paidAt:new Date().toISOString() }).pipe(delay(800)); }
  refundPayment(id: string): Observable<any> { return of({ success:true, refundId:'REF-'+Date.now() }).pipe(delay(600)); }

  // Leads
  createLead(data: any): Observable<any> { return of({ ...data, id:'LD-'+Date.now(), status:'NEW', score:50, createdAt:new Date().toISOString() }).pipe(delay(400)); }
  updateLead(id: string, data: any): Observable<any> { return of({ ...data, id }).pipe(delay(300)); }

  // Users
  createUser(data: any): Observable<any> { return of({ ...data, id:'U-'+Date.now() }).pipe(delay(400)); }
  updateUser(id: string, data: any): Observable<any> { return of({ ...data, id }).pipe(delay(300)); }
  deleteUser(id: string): Observable<void> { return of(undefined as void).pipe(delay(300)); }

  // Notifications
  markAsRead(id: string): Observable<any> { return of({ success:true }).pipe(delay(100)); }
  markAllAsRead(userId: string): Observable<any> { return of({ success:true }).pipe(delay(200)); }

  // Customer
  updateCustomerProfile(id: string, data: any): Observable<any> { return of({ ...data, id }).pipe(delay(400)); }
  submitKYC(id: string, data: any): Observable<any> { return of({ success:true, kycStatus:'VERIFIED' }).pipe(delay(1000)); }
  exportCustomerData(id: string): Observable<any> { return of({ success:true, downloadUrl:'/mock-export.json' }).pipe(delay(600)); }
}
