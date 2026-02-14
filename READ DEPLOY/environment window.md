# Hướng dẫn cài đặt môi trường trên Windows
Chạy full project (Frontend + Backend + Infrastructure) trên Windows 10/11.

---

```
Lớp                 Phần mềm                        Mục đích
──────────────────  ──────────────────────────────  ────────────────────────────────────
Nền tảng            WSL 2 + Ubuntu                  Chạy Docker, Linux tools
                    Windows Terminal                 Terminal hiện đại
                    Git                             Source control

IDE                 Visual Studio Code              Code editor chính
                    IntelliJ IDEA                   Java/Spring Boot IDE

Frontend            Node.js 18 LTS                  Angular runtime
                    Angular CLI                     Build + serve frontend

Backend             JDK 17 (Temurin)                Java runtime
                    Apache Maven 3.9+               Build tool
                    Docker Desktop                  Container runtime

Infrastructure      Docker Desktop (đã kể trên)     PostgreSQL, Redis, Kafka, Keycloak,
                                                    ELK, Prometheus, Grafana, MinIO

API Testing         Postman                         Test REST API
                    DBeaver                         Quản lý database
```
---

## Phần 1 — Nền tảng
###  WSL 2 + Ubuntu
WSL 2 (Windows Subsystem for Linux) là bắt buộc để Docker Desktop hoạt động tốt trên Windows.
Mở **PowerShell (Administrator)**, chạy:

```powershell
wsl --install
```
Sau khi cài xong, **khởi động lại máy**.
Sau khi restart, Ubuntu sẽ tự mở và yêu cầu tạo username/password. 
Tạo xong thì chạy:

```bash
sudo apt update && sudo apt upgrade -y
```
Kiểm tra:

```powershell
wsl --version
```
Kết quả cần thấy `WSL version: 2.x.x`.

---

## Phần 2 — IDE
### IntelliJ IDEA (cho Backend)
Tải tại: https://www.jetbrains.com/idea/download/

- **Community Edition**: miễn phí, đủ cho Java + Spring Boot
- **Ultimate Edition**: có thêm Spring hỗ trợ nâng cao, database tools (30 ngày trial)

Khi cài, tick chọn:
- "Add launchers dir to the PATH"
- "Add 'Open Folder as Project'"
- ".java", ".groovy", ".kt" associations

---

## Phần 3 — Frontend
### Node.js 18 LTS
Tải tại: https://nodejs.org/en/download/
Chọn bản **LTS** (18.x hoặc 20.x), file `.msi`, 64-bit.
Khi cài, tick chọn:
- "Automatically install the necessary tools" (cài Chocolatey + build tools)

Kiểm tra sau khi cài:

```powershell
node --version       # v18.x.x hoặc v20.x.x
npm --version        # 9.x.x hoặc 10.x.x
```
### Angular CLI
Mở terminal, chạy:

```powershell
npm install -g @angular/cli@18
```
Kiểm tra:

```powershell
ng version
```
Kết quả cần thấy `Angular CLI: 18.x.x`.

### Chạy thử Frontend

```powershell
cd insurance-hub
npm install
npx ng serve
```
Mở trình duyệt: `http://localhost:4200`

---

## Backend
### JDK 17 (Eclipse Temurin)
Tải tại: https://adoptium.net/temurin/releases/?version=17
Chọn:
- **Operating System**: Windows
- **Architecture**: x64
- **Package Type**: `.msi`

Khi cài, tick chọn:
- "Set JAVA_HOME variable"
- "Add to PATH"

Kiểm tra:

```powershell
java --version       # openjdk 17.x.x
javac --version      # javac 17.x.x
echo %JAVA_HOME%     # C:\Program Files\Eclipse Adoptium\jdk-17.x.x
```
Nếu `JAVA_HOME` chưa được set, thêm thủ công:

```powershell
# PowerShell (Administrator)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot", "Machine")
```
### Apache Maven 3.9+
Tải tại: https://maven.apache.org/download.cgi
Chọn file `apache-maven-3.9.x-bin.zip`.
Giải nén vào `C:\Program Files\Apache\Maven`.
Thêm vào PATH:

```powershell
# PowerShell (Administrator)
$oldPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
[System.Environment]::SetEnvironmentVariable("Path", "$oldPath;C:\Program Files\Apache\Maven\apache-maven-3.9.9\bin", "Machine")
```
Mở terminal mới, kiểm tra:

```powershell
mvn --version        # Apache Maven 3.9.x
```
### Chạy thử Backend

```powershell
cd insurance-hub-backend
mvn clean package -DskipTests
java -jar api-gateway/target/api-gateway.jar
```
---

## Docker Desktop (Infrastructure)
### Cài Docker Desktop
Tải tại: https://www.docker.com/products/docker-desktop/
Khi cài, tick chọn:
- "Use WSL 2 instead of Hyper-V"

Sau khi cài, **khởi động lại máy**.
Mở Docker Desktop, vào Settings:
- General → tick "Use the WSL 2 based engine"
- Resources → WSL Integration → bật Ubuntu

Kiểm tra:

```powershell
docker --version           # Docker version 27.x.x
docker-compose --version   # Docker Compose version 2.x.x
```

### Cấp tài nguyên cho Docker
Vào Docker Desktop → Settings → Resources:

```
Tài nguyên tối thiểu cho full project:
├── CPUs:    4 cores
├── Memory:  8 GB (khuyến nghị 12-16 GB)
├── Swap:    2 GB
└── Disk:    40 GB
```
### Khởi động Infrastructure
Tạo file `docker-compose.yml` trong thư mục root backend (đã có sẵn trong project):

```powershell
cd insurance-hub-backend
docker-compose up -d
```
Lệnh này khởi động tất cả:

```
Container              Port      Kiểm tra
─────────────────────  ────────  ────────────────────────────────────
PostgreSQL             :5432     pgAdmin hoặc DBeaver → localhost:5432
Redis                  :6379     redis-cli ping → PONG
Kafka + Zookeeper      :9092     —
Keycloak               :8180     http://localhost:8180 (admin/admin)
MinIO                  :9000     http://localhost:9000
Elasticsearch          :9200     http://localhost:9200
Logstash               :5044     —
Kibana                 :5601     http://localhost:5601
Prometheus             :9090     http://localhost:9090
Grafana                :3000     http://localhost:3000 (admin/admin)
```
Kiểm tra tất cả đang chạy:

```powershell
docker ps
```
---

## API Testing & Database
### Postman
Tải tại: https://www.postman.com/downloads/
Sau khi cài, import collection API từ file `docs/api-specification.yaml` trong backend project.
### DBeaver (Database Client)
Tải tại: https://dbeaver.io/download/
Chọn bản **Community Edition**, file `.exe`.
Sau khi cài, tạo connection:

```
Driver:    PostgreSQL
Host:      localhost
Port:      5432
Database:  insurance_hub (hoặc từng service database)
Username:  postgres
Password:  postgres
```
---

## Kiểm tra sau khi cài xong
Mở PowerShell, chạy lần lượt:

```powershell
wsl --version                    # WSL 2.x.x
git --version                    # git 2.x.x
node --version                   # v18.x.x hoặc v20.x.x
npm --version                    # 9.x.x hoặc 10.x.x
ng version                       # Angular CLI 18.x.x
java --version                   # openjdk 17.x.x
mvn --version                    # Apache Maven 3.9.x
docker --version                 # Docker 27.x.x
docker-compose --version         # Docker Compose 2.x.x
```
Nếu tất cả lệnh trên đều ra đúng version, môi trường đã sẵn sàng.

---
## Thứ tự khởi động full project

```
Bước   Lệnh                                          Kết quả
─────  ────────────────────────────────────────────  ─────────────────────────────────
  1    docker-compose up -d                          Infrastructure chạy (PG, Redis,
                                                     Kafka, Keycloak, ELK, Grafana...)

  2    cd insurance-hub-backend                      —
       mvn clean package -DskipTests                 Build 13 jar files

  3    java -jar api-gateway/target/*.jar &          API Gateway       :8080
       java -jar product-service/target/*.jar &      Product Service   :8081
       java -jar customer-service/target/*.jar &     Customer Service  :8082
       java -jar sales-service/target/*.jar &        Sales Service     :8083
       java -jar policy-service/target/*.jar &       Policy Service    :8084
       java -jar claims-service/target/*.jar &       Claims Service    :8085
       java -jar payment-service/target/*.jar &      Payment Service   :8086
       java -jar underwriting-service/target/*.jar & Underwriting      :8087
       java -jar agent-service/target/*.jar &        Agent Service     :8088
       java -jar commission-service/target/*.jar &   Commission        :8089
       java -jar notification-service/target/*.jar & Notification      :8090
       java -jar document-service/target/*.jar &     Document          :8091
       java -jar reporting-service/target/*.jar &    Reporting         :8092

  4    cd insurance-hub                              —
       npm install                                   Cài dependencies frontend
       npx ng serve                                  Dev server        :4200

  5    Mở http://localhost:4200                      Trải nghiệm web
```
Lưu ý: Bước 3 có thể thay bằng `docker-compose -f docker-compose.services.yml up -d` nếu backend đã được containerize.

---
## Yêu cầu phần cứng tối thiểu

```
Thành phần     Tối thiểu         Khuyến nghị
─────────────  ────────────────  ────────────────
CPU            4 cores           8 cores
RAM            12 GB             16-32 GB
Ổ đĩa         40 GB trống SSD   100 GB SSD
OS             Windows 10 21H2   Windows 11 23H2
Mạng           Cần Internet để tải packages và Docker images
```
Riêng chỉ chạy **Frontend** (không backend), chỉ cần Node.js + 4 GB RAM là đủ.

---