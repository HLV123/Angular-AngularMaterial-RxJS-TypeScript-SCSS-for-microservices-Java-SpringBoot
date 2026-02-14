# Docker Compose — Insurance Hub

## Tổng quan

```
Tổng containers:     23
├── Infrastructure:  10 (PostgreSQL, Redis, Kafka, Zookeeper, Keycloak, MinIO,
│                        Elasticsearch, Logstash, Kibana, Grafana, Prometheus)
└── Services:        13 (API Gateway + 12 microservices)
```

---

## File docker-compose.yml — Infrastructure

```yaml
version: '3.8'

services:

  # ═══════════════════════════════════════════════
  # DATABASE
  # ═══════════════════════════════════════════════

  postgresql:
    image: postgres:16-alpine
    container_name: ih-postgresql
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_MULTIPLE_DATABASES: >
        product_db,customer_db,sales_db,policy_db,claims_db,
        payment_db,underwriting_db,agent_db,commission_db,
        notification_db,document_db,reporting_db,keycloak_db
    volumes:
      - pg_data:/var/lib/postgresql/data
      - ./infrastructure/postgresql/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: ih-redis
    ports:
      - "6379:6379"
    command: redis-server --requirepass redis123 --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "redis123", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # ═══════════════════════════════════════════════
  # MESSAGE QUEUE
  # ═══════════════════════════════════════════════

  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.0
    container_name: ih-zookeeper
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    restart: unless-stopped

  kafka:
    image: confluentinc/cp-kafka:7.6.0
    container_name: ih-kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
      - "29092:29092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
    healthcheck:
      test: ["CMD", "kafka-topics", "--bootstrap-server", "localhost:9092", "--list"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: ih-kafka-ui
    depends_on:
      - kafka
    ports:
      - "8086:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: insurance-hub
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:29092
    restart: unless-stopped

  # ═══════════════════════════════════════════════
  # AUTHENTICATION
  # ═══════════════════════════════════════════════

  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    container_name: ih-keycloak
    depends_on:
      postgresql:
        condition: service_healthy
    ports:
      - "8180:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgresql:5432/keycloak_db
      KC_DB_USERNAME: postgres
      KC_DB_PASSWORD: postgres
      KC_HEALTH_ENABLED: "true"
    command: start-dev --import-realm
    volumes:
      - ./infrastructure/keycloak/realm-insurance-hub.json:/opt/keycloak/data/import/realm-insurance-hub.json
    restart: unless-stopped

  # ═══════════════════════════════════════════════
  # FILE STORAGE
  # ═══════════════════════════════════════════════

  minio:
    image: minio/minio:latest
    container_name: ih-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "mc", "ready", "local"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # ═══════════════════════════════════════════════
  # LOGGING (ELK Stack)
  # ═══════════════════════════════════════════════

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.0
    container_name: ih-elasticsearch
    ports:
      - "9200:9200"
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    healthcheck:
      test: ["CMD-SHELL", "curl -s http://localhost:9200/_cluster/health | grep -q '\"status\":\"green\\|yellow\"'"]
      interval: 30s
      timeout: 10s
      retries: 5
    restart: unless-stopped

  logstash:
    image: docker.elastic.co/logstash/logstash:8.12.0
    container_name: ih-logstash
    depends_on:
      elasticsearch:
        condition: service_healthy
    ports:
      - "5044:5044"
    volumes:
      - ./infrastructure/elk/logstash/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    restart: unless-stopped

  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.0
    container_name: ih-kibana
    depends_on:
      elasticsearch:
        condition: service_healthy
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    restart: unless-stopped

  # ═══════════════════════════════════════════════
  # MONITORING
  # ═══════════════════════════════════════════════

  prometheus:
    image: prom/prometheus:v2.49.0
    container_name: ih-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./infrastructure/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    restart: unless-stopped

  grafana:
    image: grafana/grafana:10.3.0
    container_name: ih-grafana
    depends_on:
      - prometheus
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./infrastructure/grafana/provisioning:/etc/grafana/provisioning
    restart: unless-stopped

volumes:
  pg_data:
  redis_data:
  minio_data:
  es_data:
  prometheus_data:
  grafana_data:
```

---

## File docker-compose.services.yml — Microservices

```yaml
version: '3.8'

services:

  api-gateway:
    build: ./api-gateway
    container_name: ih-api-gateway
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      KEYCLOAK_URL: http://keycloak:8080
    depends_on:
      - keycloak
      - redis
    restart: unless-stopped

  product-service:
    build: ./product-service
    container_name: ih-product-service
    ports:
      - "8081:8081"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/product_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
      SPRING_REDIS_HOST: redis
      SPRING_REDIS_PASSWORD: redis123
    depends_on:
      - postgresql
      - kafka
      - redis
    restart: unless-stopped

  customer-service:
    build: ./customer-service
    container_name: ih-customer-service
    ports:
      - "8082:8082"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/customer_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      - postgresql
      - kafka
    restart: unless-stopped

  sales-service:
    build: ./sales-service
    container_name: ih-sales-service
    ports:
      - "8083:8083"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/sales_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      - postgresql
      - kafka
    restart: unless-stopped

  policy-service:
    build: ./policy-service
    container_name: ih-policy-service
    ports:
      - "8084:8084"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/policy_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      - postgresql
      - kafka
    restart: unless-stopped

  claims-service:
    build: ./claims-service
    container_name: ih-claims-service
    ports:
      - "8085:8085"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/claims_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      - postgresql
      - kafka
    restart: unless-stopped

  payment-service:
    build: ./payment-service
    container_name: ih-payment-service
    ports:
      - "8086:8086"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/payment_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      - postgresql
      - kafka
    restart: unless-stopped

  underwriting-service:
    build: ./underwriting-service
    container_name: ih-underwriting-service
    ports:
      - "8087:8087"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/underwriting_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      - postgresql
      - kafka
    restart: unless-stopped

  agent-service:
    build: ./agent-service
    container_name: ih-agent-service
    ports:
      - "8088:8088"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/agent_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      - postgresql
      - kafka
    restart: unless-stopped

  commission-service:
    build: ./commission-service
    container_name: ih-commission-service
    ports:
      - "8089:8089"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/commission_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      - postgresql
      - kafka
    restart: unless-stopped

  notification-service:
    build: ./notification-service
    container_name: ih-notification-service
    ports:
      - "8090:8090"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/notification_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      - postgresql
      - kafka
    restart: unless-stopped

  document-service:
    build: ./document-service
    container_name: ih-document-service
    ports:
      - "8091:8091"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/document_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
      MINIO_URL: http://minio:9000
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin123
    depends_on:
      - postgresql
      - kafka
      - minio
    restart: unless-stopped

  reporting-service:
    build: ./reporting-service
    container_name: ih-reporting-service
    ports:
      - "8092:8092"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgresql:5432/reporting_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      - postgresql
      - kafka
    restart: unless-stopped
```

---

## Lệnh chạy

### Khởi động infrastructure

```bash
docker-compose up -d
```

### Khởi động services (sau khi build)

```bash
docker-compose -f docker-compose.services.yml up -d
```

### Khởi động tất cả

```bash
docker-compose -f docker-compose.yml -f docker-compose.services.yml up -d
```

### Kiểm tra trạng thái

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Xem logs

```bash
# Tất cả
docker-compose logs -f

# 1 service
docker logs -f ih-policy-service

# Lọc errors
docker logs ih-claims-service 2>&1 | grep ERROR
```

### Dừng tất cả

```bash
docker-compose -f docker-compose.yml -f docker-compose.services.yml down
```

### Xóa toàn bộ data (reset)

```bash
docker-compose down -v
```

---

## Bảng ports

```
Port    Container              URL kiểm tra
──────  ─────────────────────  ──────────────────────────────────
4200    Frontend (ng serve)    http://localhost:4200
8080    API Gateway            http://localhost:8080/actuator/health
8081    Product Service        http://localhost:8081/actuator/health
8082    Customer Service       http://localhost:8082/actuator/health
8083    Sales Service          http://localhost:8083/actuator/health
8084    Policy Service         http://localhost:8084/actuator/health
8085    Claims Service         http://localhost:8085/actuator/health
8086    Payment Service        http://localhost:8086/actuator/health
8087    Underwriting Service   http://localhost:8087/actuator/health
8088    Agent Service          http://localhost:8088/actuator/health
8089    Commission Service     http://localhost:8089/actuator/health
8090    Notification Service   http://localhost:8090/actuator/health
8091    Document Service       http://localhost:8091/actuator/health
8092    Reporting Service      http://localhost:8092/actuator/health
8180    Keycloak               http://localhost:8180     (admin/admin)
8086    Kafka UI               http://localhost:8086
9000    MinIO API              http://localhost:9000
9001    MinIO Console          http://localhost:9001     (minioadmin/minioadmin123)
9090    Prometheus             http://localhost:9090
9200    Elasticsearch          http://localhost:9200
5601    Kibana                 http://localhost:5601
3000    Grafana                http://localhost:3000     (admin/admin)
5432    PostgreSQL             localhost:5432             (postgres/postgres)
6379    Redis                  localhost:6379             (password: redis123)
9092    Kafka                  localhost:9092
```

---

## Script tạo nhiều databases PostgreSQL

File `infrastructure/postgresql/init/00-create-databases.sql`:

```sql
-- Script tự động tạo databases cho mỗi microservice
CREATE DATABASE product_db;
CREATE DATABASE customer_db;
CREATE DATABASE sales_db;
CREATE DATABASE policy_db;
CREATE DATABASE claims_db;
CREATE DATABASE payment_db;
CREATE DATABASE underwriting_db;
CREATE DATABASE agent_db;
CREATE DATABASE commission_db;
CREATE DATABASE notification_db;
CREATE DATABASE document_db;
CREATE DATABASE reporting_db;
-- keycloak_db đã tự tạo qua env POSTGRES_MULTIPLE_DATABASES
```

---

## Yêu cầu tài nguyên

```
Chỉ Infrastructure:    ~4 GB RAM,  4 CPU cores
Infrastructure + All:   ~12 GB RAM, 8 CPU cores
Disk (images + data):   ~15 GB
```
