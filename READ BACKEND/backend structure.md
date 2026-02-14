# Insurance Hub — Backend Structure

```
insurance-hub-backend/
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Makefile
├── .gitignore
├── .env.example
├── docs/
│   ├── architecture.md
│   ├── api-specification.yaml
│   ├── database-schema.sql
│   ├── kafka-events.md
│   └── deployment-guide.md
├── infrastructure/
│   ├── kubernetes/
│   │   ├── namespace.yaml
│   │   ├── configmap.yaml
│   │   ├── secrets.yaml
│   │   ├── ingress.yaml
│   │   ├── product-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── customer-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── sales-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── agent-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── policy-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── claims-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── payment-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── underwriting-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── commission-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── reporting-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── notification-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   ├── document-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml
│   │   └── api-gateway/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       └── hpa.yaml
│   ├── keycloak/
│   │   ├── Dockerfile
│   │   ├── realm-insurance-hub.json
│   │   ├── clients/
│   │   │   ├── insurance-hub-frontend.json
│   │   │   └── insurance-hub-backend.json
│   │   └── themes/
│   │       └── insurance-hub/
│   │           ├── login/
│   │           │   └── theme.properties
│   │           └── email/
│   │               └── theme.properties
│   ├── kafka/
│   │   ├── docker-compose.kafka.yml
│   │   └── topics/
│   │       ├── create-topics.sh
│   │       └── topic-config.json
│   ├── postgresql/
│   │   ├── init/
│   │   │   ├── 00-create-databases.sql
│   │   │   ├── 01-create-extensions.sql
│   │   │   └── 02-create-users.sql
│   │   ├── backup/
│   │   │   └── backup.sh
│   │   └── postgresql.conf
│   ├── redis/
│   │   └── redis.conf
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── ssl/
│   │       ├── insurance-hub.vn.crt
│   │       └── insurance-hub.vn.key
│   ├── elk/
│   │   ├── elasticsearch/
│   │   │   └── elasticsearch.yml
│   │   ├── logstash/
│   │   │   ├── logstash.conf
│   │   │   └── pipeline/
│   │   │       └── insurance-hub.conf
│   │   └── kibana/
│   │       └── kibana.yml
│   ├── prometheus/
│   │   ├── prometheus.yml
│   │   └── alert-rules.yml
│   ├── grafana/
│   │   ├── provisioning/
│   │   │   ├── dashboards/
│   │   │   │   ├── api-gateway.json
│   │   │   │   ├── microservices.json
│   │   │   │   └── business-kpi.json
│   │   │   └── datasources/
│   │   │       └── prometheus.yml
│   │   └── grafana.ini
│   └── minio/
│       └── minio.env
├── api-gateway/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── gateway/
│           │               ├── ApiGatewayApplication.java
│           │               ├── config/
│           │               │   ├── RouteConfig.java
│           │               │   ├── CorsConfig.java
│           │               │   ├── RateLimitConfig.java
│           │               │   ├── SecurityConfig.java
│           │               │   └── CircuitBreakerConfig.java
│           │               ├── filter/
│           │               │   ├── AuthenticationFilter.java
│           │               │   ├── LoggingFilter.java
│           │               │   └── RateLimitFilter.java
│           │               └── exception/
│           │                   └── GatewayExceptionHandler.java
│           └── resources/
│               ├── application.yml
│               ├── application-dev.yml
│               └── application-prod.yml
│
├── shared-lib/
│   ├── pom.xml
│   └── src/
│       └── main/
│           └── java/
│               └── vn/
│                   └── insurancehub/
│                       └── shared/
│                           ├── dto/
│                           │   ├── ApiResponse.java
│                           │   ├── PageResponse.java
│                           │   └── ErrorResponse.java
│                           ├── event/
│                           │   ├── BaseEvent.java
│                           │   ├── PolicyEvent.java
│                           │   ├── ClaimEvent.java
│                           │   ├── PaymentEvent.java
│                           │   └── NotificationEvent.java
│                           ├── enums/
│                           │   ├── UserRole.java
│                           │   ├── PolicyStatus.java
│                           │   ├── ClaimStatus.java
│                           │   ├── PaymentMethod.java
│                           │   ├── PaymentStatus.java
│                           │   ├── ProductCategory.java
│                           │   └── NotificationType.java
│                           ├── exception/
│                           │   ├── BusinessException.java
│                           │   ├── ResourceNotFoundException.java
│                           │   ├── UnauthorizedException.java
│                           │   └── ValidationException.java
│                           ├── security/
│                           │   ├── JwtTokenProvider.java
│                           │   ├── SecurityUtils.java
│                           │   └── AuditContext.java
│                           └── util/
│                               ├── DateUtils.java
│                               ├── NumberUtils.java
│                               ├── VndFormatter.java
│                               └── PolicyNumberGenerator.java
├── product-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── vn/
│       │   │       └── insurancehub/
│       │   │           └── product/
│       │   │               ├── ProductServiceApplication.java
│       │   │               ├── config/
│       │   │               │   ├── KafkaProducerConfig.java
│       │   │               │   ├── RedisConfig.java
│       │   │               │   └── SecurityConfig.java
│       │   │               ├── controller/
│       │   │               │   ├── ProductController.java
│       │   │               │   └── ProductPlanController.java
│       │   │               ├── service/
│       │   │               │   ├── ProductService.java
│       │   │               │   ├── ProductServiceImpl.java
│       │   │               │   ├── ProductPlanService.java
│       │   │               │   ├── PricingEngine.java
│       │   │               │   └── ProductCacheService.java
│       │   │               ├── repository/
│       │   │               │   ├── ProductRepository.java
│       │   │               │   └── ProductPlanRepository.java
│       │   │               ├── entity/
│       │   │               │   ├── ProductEntity.java
│       │   │               │   ├── ProductPlanEntity.java
│       │   │               │   ├── PlanBenefitEntity.java
│       │   │               │   └── ProductRiderEntity.java
│       │   │               ├── dto/
│       │   │               │   ├── ProductRequest.java
│       │   │               │   ├── ProductResponse.java
│       │   │               │   ├── ProductPlanResponse.java
│       │   │               │   └── PricingRequest.java
│       │   │               ├── mapper/
│       │   │               │   └── ProductMapper.java
│       │   │               └── exception/
│       │   │                   └── ProductNotFoundException.java
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-dev.yml
│       │       └── db/
│       │           └── migration/
│       │               ├── V1__create_products_table.sql
│       │               ├── V2__create_product_plans_table.sql
│       │               ├── V3__create_plan_benefits_table.sql
│       │               └── V4__seed_products.sql
│       └── test/
│           └── java/
│               └── vn/
│                   └── insurancehub/
│                       └── product/
│                           ├── controller/
│                           │   └── ProductControllerTest.java
│                           ├── service/
│                           │   └── ProductServiceTest.java
│                           └── repository/
│                               └── ProductRepositoryTest.java
│
├── customer-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── customer/
│           │               ├── CustomerServiceApplication.java
│           │               ├── config/
│           │               │   ├── KafkaProducerConfig.java
│           │               │   └── SecurityConfig.java
│           │               ├── controller/
│           │               │   ├── CustomerController.java
│           │               │   ├── LeadController.java
│           │               │   └── Customer360Controller.java
│           │               ├── service/
│           │               │   ├── CustomerService.java
│           │               │   ├── CustomerServiceImpl.java
│           │               │   ├── LeadService.java
│           │               │   ├── LeadScoringService.java
│           │               │   ├── Customer360Service.java
│           │               │   ├── SegmentationService.java
│           │               │   └── EKYCService.java
│           │               ├── repository/
│           │               │   ├── CustomerRepository.java
│           │               │   ├── LeadRepository.java
│           │               │   └── InteractionRepository.java
│           │               ├── entity/
│           │               │   ├── CustomerEntity.java
│           │               │   ├── LeadEntity.java
│           │               │   ├── InteractionEntity.java
│           │               │   └── DataPrivacyConsentEntity.java
│           │               ├── dto/
│           │               │   ├── CustomerRequest.java
│           │               │   ├── CustomerResponse.java
│           │               │   ├── Customer360Response.java
│           │               │   ├── LeadRequest.java
│           │               │   ├── LeadResponse.java
│           │               │   └── EKYCRequest.java
│           │               ├── mapper/
│           │               │   ├── CustomerMapper.java
│           │               │   └── LeadMapper.java
│           │               └── integration/
│           │                   ├── FPTEKYCClient.java
│           │                   └── VNPTEKYCClient.java
│           └── resources/
│               ├── application.yml
│               └── db/
│                   └── migration/
│                       ├── V1__create_customers_table.sql
│                       ├── V2__create_leads_table.sql
│                       └── V3__create_interactions_table.sql
│
├── sales-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── sales/
│           │               ├── SalesServiceApplication.java
│           │               ├── config/
│           │               │   ├── KafkaProducerConfig.java
│           │               │   └── SecurityConfig.java
│           │               ├── controller/
│           │               │   ├── QuoteController.java
│           │               │   └── ApplicationController.java
│           │               ├── service/
│           │               │   ├── QuoteService.java
│           │               │   ├── QuoteServiceImpl.java
│           │               │   ├── ApplicationService.java
│           │               │   ├── PremiumCalculator.java
│           │               │   └── ComparisonService.java
│           │               ├── repository/
│           │               │   ├── QuoteRepository.java
│           │               │   └── ApplicationRepository.java
│           │               ├── entity/
│           │               │   ├── QuoteEntity.java
│           │               │   ├── QuoteBreakdownEntity.java
│           │               │   └── ApplicationEntity.java
│           │               ├── dto/
│           │               │   ├── QuoteRequest.java
│           │               │   ├── QuoteResponse.java
│           │               │   ├── ApplicationRequest.java
│           │               │   └── ApplicationResponse.java
│           │               ├── mapper/
│           │               │   └── QuoteMapper.java
│           │               └── client/
│           │                   ├── ProductServiceClient.java
│           │                   └── CustomerServiceClient.java
│           └── resources/
│               ├── application.yml
│               └── db/
│                   └── migration/
│                       ├── V1__create_quotes_table.sql
│                       └── V2__create_applications_table.sql
│
├── policy-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── policy/
│           │               ├── PolicyServiceApplication.java
│           │               ├── config/
│           │               │   ├── KafkaConfig.java
│           │               │   ├── SecurityConfig.java
│           │               │   └── SchedulerConfig.java
│           │               ├── controller/
│           │               │   └── PolicyController.java
│           │               ├── service/
│           │               │   ├── PolicyService.java
│           │               │   ├── PolicyServiceImpl.java
│           │               │   ├── PolicyIssuanceService.java
│           │               │   ├── RenewalService.java
│           │               │   ├── EndorsementService.java
│           │               │   ├── CancellationService.java
│           │               │   ├── LapseService.java
│           │               │   └── BeneficiaryService.java
│           │               ├── repository/
│           │               │   ├── PolicyRepository.java
│           │               │   ├── BeneficiaryRepository.java
│           │               │   └── EndorsementRepository.java
│           │               ├── entity/
│           │               │   ├── PolicyEntity.java
│           │               │   ├── BeneficiaryEntity.java
│           │               │   └── EndorsementEntity.java
│           │               ├── dto/
│           │               │   ├── PolicyRequest.java
│           │               │   ├── PolicyResponse.java
│           │               │   ├── RenewalRequest.java
│           │               │   ├── EndorsementRequest.java
│           │               │   └── CancellationRequest.java
│           │               ├── mapper/
│           │               │   └── PolicyMapper.java
│           │               ├── scheduler/
│           │               │   ├── RenewalScheduler.java
│           │               │   ├── LapseCheckScheduler.java
│           │               │   └── GracePeriodScheduler.java
│           │               └── kafka/
│           │                   ├── PolicyEventProducer.java
│           │                   └── PaymentEventConsumer.java
│           └── resources/
│               ├── application.yml
│               └── db/
│                   └── migration/
│                       ├── V1__create_policies_table.sql
│                       ├── V2__create_beneficiaries_table.sql
│                       └── V3__create_endorsements_table.sql
│
├── claims-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── claims/
│           │               ├── ClaimsServiceApplication.java
│           │               ├── config/
│           │               │   ├── KafkaConfig.java
│           │               │   └── SecurityConfig.java
│           │               ├── controller/
│           │               │   ├── ClaimController.java
│           │               │   ├── ClaimDocumentController.java
│           │               │   └── DirectBillingController.java
│           │               ├── service/
│           │               │   ├── ClaimService.java
│           │               │   ├── ClaimServiceImpl.java
│           │               │   ├── ClaimAssessmentService.java
│           │               │   ├── ClaimApprovalService.java
│           │               │   ├── FraudDetectionService.java
│           │               │   ├── DirectBillingService.java
│           │               │   └── ClaimPaymentService.java
│           │               ├── repository/
│           │               │   ├── ClaimRepository.java
│           │               │   ├── ClaimDocumentRepository.java
│           │               │   └── ClaimTimelineRepository.java
│           │               ├── entity/
│           │               │   ├── ClaimEntity.java
│           │               │   ├── ClaimDocumentEntity.java
│           │               │   ├── ClaimTimelineEntity.java
│           │               │   └── BankAccountEntity.java
│           │               ├── dto/
│           │               │   ├── ClaimRequest.java
│           │               │   ├── ClaimResponse.java
│           │               │   ├── ClaimApprovalRequest.java
│           │               │   ├── DirectBillingRequest.java
│           │               │   └── FraudCheckResponse.java
│           │               ├── mapper/
│           │               │   └── ClaimMapper.java
│           │               ├── kafka/
│           │               │   ├── ClaimEventProducer.java
│           │               │   └── PolicyEventConsumer.java
│           │               └── integration/
│           │                   ├── OCRClient.java
│           │                   └── HospitalApiClient.java
│           └── resources/
│               ├── application.yml
│               └── db/
│                   └── migration/
│                       ├── V1__create_claims_table.sql
│                       ├── V2__create_claim_documents_table.sql
│                       └── V3__create_claim_timeline_table.sql
│
├── payment-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── payment/
│           │               ├── PaymentServiceApplication.java
│           │               ├── config/
│           │               │   ├── KafkaConfig.java
│           │               │   ├── SecurityConfig.java
│           │               │   └── SchedulerConfig.java
│           │               ├── controller/
│           │               │   ├── PaymentController.java
│           │               │   ├── PaymentCallbackController.java
│           │               │   └── RefundController.java
│           │               ├── service/
│           │               │   ├── PaymentService.java
│           │               │   ├── PaymentServiceImpl.java
│           │               │   ├── PaymentScheduleService.java
│           │               │   ├── DunningService.java
│           │               │   ├── RefundService.java
│           │               │   └── ReconciliationService.java
│           │               ├── repository/
│           │               │   ├── PaymentRepository.java
│           │               │   ├── PaymentScheduleRepository.java
│           │               │   └── RefundRepository.java
│           │               ├── entity/
│           │               │   ├── PaymentEntity.java
│           │               │   ├── PaymentScheduleEntity.java
│           │               │   └── RefundEntity.java
│           │               ├── dto/
│           │               │   ├── PaymentInitiateRequest.java
│           │               │   ├── PaymentResponse.java
│           │               │   ├── PaymentCallbackRequest.java
│           │               │   └── RefundRequest.java
│           │               ├── mapper/
│           │               │   └── PaymentMapper.java
│           │               ├── scheduler/
│           │               │   ├── DunningScheduler.java
│           │               │   └── ReconciliationScheduler.java
│           │               ├── kafka/
│           │               │   └── PaymentEventProducer.java
│           │               └── gateway/
│           │                   ├── PaymentGateway.java
│           │                   ├── VNPayGateway.java
│           │                   ├── MomoGateway.java
│           │                   ├── ZaloPayGateway.java
│           │                   └── OnePayGateway.java
│           └── resources/
│               ├── application.yml
│               └── db/
│                   └── migration/
│                       ├── V1__create_payments_table.sql
│                       ├── V2__create_payment_schedule_table.sql
│                       └── V3__create_refunds_table.sql
│
├── underwriting-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── underwriting/
│           │               ├── UnderwritingServiceApplication.java
│           │               ├── config/
│           │               │   ├── KafkaConfig.java
│           │               │   └── SecurityConfig.java
│           │               ├── controller/
│           │               │   └── UnderwritingController.java
│           │               ├── service/
│           │               │   ├── UnderwritingService.java
│           │               │   ├── UnderwritingServiceImpl.java
│           │               │   ├── RiskAssessmentService.java
│           │               │   ├── AutoDecisionEngine.java
│           │               │   ├── MedicalUnderwritingService.java
│           │               │   └── SLATrackingService.java
│           │               ├── repository/
│           │               │   ├── UnderwritingRepository.java
│           │               │   └── RiskRuleRepository.java
│           │               ├── entity/
│           │               │   ├── UnderwritingEntity.java
│           │               │   ├── HealthDeclarationEntity.java
│           │               │   └── RiskRuleEntity.java
│           │               ├── dto/
│           │               │   ├── UnderwritingRequest.java
│           │               │   ├── UnderwritingResponse.java
│           │               │   ├── RiskAssessmentResponse.java
│           │               │   └── DecisionRequest.java
│           │               ├── mapper/
│           │               │   └── UnderwritingMapper.java
│           │               └── kafka/
│           │                   ├── UnderwritingEventProducer.java
│           │                   └── SalesEventConsumer.java
│           └── resources/
│               ├── application.yml
│               └── db/
│                   └── migration/
│                       ├── V1__create_underwriting_table.sql
│                       ├── V2__create_health_declarations_table.sql
│                       └── V3__seed_risk_rules.sql
│
├── agent-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── agent/
│           │               ├── AgentServiceApplication.java
│           │               ├── config/
│           │               │   ├── KafkaConfig.java
│           │               │   └── SecurityConfig.java
│           │               ├── controller/
│           │               │   ├── AgentController.java
│           │               │   ├── AgentLeaderboardController.java
│           │               │   └── AgentTrainingController.java
│           │               ├── service/
│           │               │   ├── AgentService.java
│           │               │   ├── AgentServiceImpl.java
│           │               │   ├── AgentOnboardingService.java
│           │               │   ├── AgentHierarchyService.java
│           │               │   ├── PerformanceService.java
│           │               │   ├── LeaderboardService.java
│           │               │   └── TrainingService.java
│           │               ├── repository/
│           │               │   ├── AgentRepository.java
│           │               │   └── TrainingRepository.java
│           │               ├── entity/
│           │               │   ├── AgentEntity.java
│           │               │   └── TrainingRecordEntity.java
│           │               ├── dto/
│           │               │   ├── AgentRequest.java
│           │               │   ├── AgentResponse.java
│           │               │   └── LeaderboardResponse.java
│           │               └── mapper/
│           │                   └── AgentMapper.java
│           └── resources/
│               ├── application.yml
│               └── db/
│                   └── migration/
│                       ├── V1__create_agents_table.sql
│                       └── V2__create_training_records_table.sql
│
├── commission-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── commission/
│           │               ├── CommissionServiceApplication.java
│           │               ├── config/
│           │               │   ├── KafkaConfig.java
│           │               │   └── SchedulerConfig.java
│           │               ├── controller/
│           │               │   └── CommissionController.java
│           │               ├── service/
│           │               │   ├── CommissionService.java
│           │               │   ├── CommissionServiceImpl.java
│           │               │   ├── CommissionCalculator.java
│           │               │   ├── ClawbackService.java
│           │               │   └── CommissionPayoutService.java
│           │               ├── repository/
│           │               │   ├── CommissionRepository.java
│           │               │   └── CommissionRuleRepository.java
│           │               ├── entity/
│           │               │   ├── CommissionEntity.java
│           │               │   └── CommissionRuleEntity.java
│           │               ├── dto/
│           │               │   ├── CommissionResponse.java
│           │               │   └── CommissionStatementResponse.java
│           │               ├── mapper/
│           │               │   └── CommissionMapper.java
│           │               ├── scheduler/
│           │               │   └── CommissionCalculationScheduler.java
│           │               └── kafka/
│           │                   └── PolicyEventConsumer.java
│           └── resources/
│               ├── application.yml
│               └── db/
│                   └── migration/
│                       ├── V1__create_commissions_table.sql
│                       └── V2__create_commission_rules_table.sql
│
├── notification-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── notification/
│           │               ├── NotificationServiceApplication.java
│           │               ├── config/
│           │               │   ├── KafkaConsumerConfig.java
│           │               │   ├── WebSocketConfig.java
│           │               │   └── TemplateConfig.java
│           │               ├── controller/
│           │               │   ├── NotificationController.java
│           │               │   └── NotificationWebSocketHandler.java
│           │               ├── service/
│           │               │   ├── NotificationService.java
│           │               │   ├── NotificationServiceImpl.java
│           │               │   ├── EmailService.java
│           │               │   ├── SMSService.java
│           │               │   ├── PushNotificationService.java
│           │               │   └── TemplateService.java
│           │               ├── repository/
│           │               │   ├── NotificationRepository.java
│           │               │   └── TemplateRepository.java
│           │               ├── entity/
│           │               │   ├── NotificationEntity.java
│           │               │   └── NotificationTemplateEntity.java
│           │               ├── dto/
│           │               │   ├── NotificationResponse.java
│           │               │   └── SendNotificationRequest.java
│           │               ├── mapper/
│           │               │   └── NotificationMapper.java
│           │               ├── kafka/
│           │               │   └── NotificationEventConsumer.java
│           │               └── integration/
│           │                   ├── SendGridClient.java
│           │                   ├── ViettelSMSClient.java
│           │                   └── FirebasePushClient.java
│           └── resources/
│               ├── application.yml
│               ├── templates/
│               │   ├── email/
│               │   │   ├── policy-issued.html
│               │   │   ├── claim-approved.html
│               │   │   ├── payment-reminder.html
│               │   │   └── welcome.html
│               │   └── sms/
│               │       ├── otp.txt
│               │       ├── payment-due.txt
│               │       └── claim-status.txt
│               └── db/
│                   └── migration/
│                       ├── V1__create_notifications_table.sql
│                       └── V2__create_templates_table.sql
│
├── document-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── document/
│           │               ├── DocumentServiceApplication.java
│           │               ├── config/
│           │               │   ├── MinioConfig.java
│           │               │   └── KafkaConfig.java
│           │               ├── controller/
│           │               │   └── DocumentController.java
│           │               ├── service/
│           │               │   ├── DocumentService.java
│           │               │   ├── DocumentServiceImpl.java
│           │               │   ├── PolicyDocumentGenerator.java
│           │               │   ├── ClaimDocumentProcessor.java
│           │               │   ├── OCRService.java
│           │               │   └── StorageService.java
│           │               ├── repository/
│           │               │   └── DocumentRepository.java
│           │               ├── entity/
│           │               │   └── DocumentEntity.java
│           │               ├── dto/
│           │               │   ├── DocumentUploadRequest.java
│           │               │   ├── DocumentResponse.java
│           │               │   └── OCRResultResponse.java
│           │               ├── kafka/
│           │               │   └── DocumentEventConsumer.java
│           │               └── integration/
│           │                   ├── MinioStorageClient.java
│           │                   ├── GoogleVisionOCRClient.java
│           │                   └── FPTAIOCRClient.java
│           └── resources/
│               ├── application.yml
│               ├── templates/
│               │   ├── policy-certificate.jrxml
│               │   ├── claim-receipt.jrxml
│               │   └── commission-statement.jrxml
│               └── db/
│                   └── migration/
│                       └── V1__create_documents_table.sql
│
├── reporting-service/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/
│           │   └── vn/
│           │       └── insurancehub/
│           │           └── reporting/
│           │               ├── ReportingServiceApplication.java
│           │               ├── config/
│           │               │   ├── KafkaConfig.java
│           │               │   └── SecurityConfig.java
│           │               ├── controller/
│           │               │   ├── DashboardController.java
│           │               │   ├── ReportController.java
│           │               │   └── AuditLogController.java
│           │               ├── service/
│           │               │   ├── DashboardService.java
│           │               │   ├── DashboardServiceImpl.java
│           │               │   ├── ReportGeneratorService.java
│           │               │   ├── AuditLogService.java
│           │               │   ├── LossRatioService.java
│           │               │   └── ExportService.java
│           │               ├── repository/
│           │               │   ├── AuditLogRepository.java
│           │               │   └── ReportRepository.java
│           │               ├── entity/
│           │               │   ├── AuditLogEntity.java
│           │               │   └── ReportEntity.java
│           │               ├── dto/
│           │               │   ├── DashboardStatsResponse.java
│           │               │   ├── ReportRequest.java
│           │               │   └── AuditLogResponse.java
│           │               ├── mapper/
│           │               │   └── AuditLogMapper.java
│           │               └── kafka/
│           │                   └── AuditEventConsumer.java
│           └── resources/
│               ├── application.yml
│               └── db/
│                   └── migration/
│                       ├── V1__create_audit_logs_table.sql
│                       └── V2__create_reports_table.sql
│
└── pom.xml                      ← parent POM (multi-module Maven)
```

---

## Bảng tổng kết services

```
Service                  Port    Database             Kafka Topics (Produce)            Kafka Topics (Consume)
───────────────────────  ──────  ───────────────────  ────────────────────────────────  ─────────────────────────────
api-gateway              :8080   —                    —                                 —
product-service          :8081   product_db           product.created/updated           —
customer-service         :8082   customer_db          customer.created/updated          —
sales-service            :8083   sales_db             policy.quoted                     product.*, customer.*
policy-service           :8084   policy_db            policy.issued/activated/renewed   payment.success, policy.quoted
claims-service           :8085   claims_db            claim.submitted/approved/paid     policy.*
payment-service          :8086   payment_db           payment.initiated/success/failed  policy.issued, claim.approved
underwriting-service     :8087   underwriting_db      underwriting.approved/declined    policy.quoted
agent-service            :8088   agent_db             —                                 —
commission-service       :8089   commission_db        commission.calculated/paid        policy.issued/renewed
notification-service     :8090   notification_db      —                                 notification.*.send, policy.*, claim.*, payment.*
document-service         :8091   document_db          —                                 policy.issued, claim.submitted
reporting-service        :8092   reporting_db         —                                 audit.log, policy.*, claim.*, payment.*
```

---

## Chạy backend

```bash
# 1 — Khởi động infrastructure
docker-compose up -d postgresql redis kafka keycloak minio elasticsearch

# 2 — Build toàn bộ services
mvn clean package -DskipTests

# 3 — Chạy từng service (hoặc docker-compose up)
java -jar api-gateway/target/api-gateway.jar
java -jar product-service/target/product-service.jar
java -jar customer-service/target/customer-service.jar
java -jar sales-service/target/sales-service.jar
java -jar policy-service/target/policy-service.jar
java -jar claims-service/target/claims-service.jar
java -jar payment-service/target/payment-service.jar
java -jar underwriting-service/target/underwriting-service.jar
java -jar agent-service/target/agent-service.jar
java -jar commission-service/target/commission-service.jar
java -jar notification-service/target/notification-service.jar
java -jar document-service/target/document-service.jar
java -jar reporting-service/target/reporting-service.jar

# Hoặc chạy tất cả bằng Docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

---

## Kết nối Frontend ↔ Backend

Khi backend chạy xong, mở file frontend `src/environments/environment.ts`, đổi:

```typescript
useMockData: false
```

Frontend sẽ tự chuyển từ mock data sang gọi REST API qua `http://localhost:8080/api/v1`.