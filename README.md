# Backend Developer (Intern) Assignment

This repository contains the full-stack solution for the Backend Developer Intern Assignment. The project features a robust Spring Boot backend (with Spring Security, JWT, and MySQL) and a responsive React frontend (built with Vite and Tailwind CSS).

## 🚀 Tech Stack

**Backend:**
- Java 17
- Spring Boot 3
- Spring Security & JWT (JSON Web Tokens)
- Spring Data JPA / Hibernate
- MySQL Database
- Swagger UI / OpenAPI for documentation

**Frontend:**
- React.js (via Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Toastify (Notifications)

---

## ✨ Features

- **Authentication & Authorization**: Secure User registration & login with password hashing (BCrypt) and JWT generation.
- **Role-Based Access Control (RBAC)**: Supports `USER` and `ADMIN` roles.
- **CRUD Operations**: Complete management for the `Task` entity. Users manage their own tasks; Admins have elevated access to view and delete all tasks.
- **Global Exception Handling**: Structured and unified API error responses.
- **API Documentation**: Auto-generated OpenAPI specification available via Swagger UI.
- **Modern Dashboard UI**: A protected React frontend that seamlessly integrates with the REST APIs.

---

## 🛠️ Setup Instructions

### 1. Database Setup
Ensure you have MySQL installed and running locally. Update your `project/backend/src/main/resources/application.properties` file with your specific database credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/assignment_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```
*(Note: `createDatabaseIfNotExist=true` will automatically create the `assignment_db` database. Hibernate will auto-generate the `users` and `tasks` tables).*

### 2. Running the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd project/backend
   ```
2. Start the Spring Boot application using the Maven wrapper:
   ```bash
   # On Windows
   mvnw.cmd spring-boot:run
   
   # On macOS/Linux
   ./mvnw spring-boot:run
   ```
   The backend server will start on `http://localhost:8080`.

### 3. API Documentation
Once the backend is running, you can access the interactive API documentation and test endpoints directly from your browser:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### 4. Running the Frontend
1. Open a new terminal instance and navigate to the frontend directory:
   ```bash
   cd project/frontend
   ```
2. Install the necessary Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will be available at `http://localhost:5173`.

---

## 📈 Scalability & Deployment Note

To ensure the backend system is scalable and production-ready for thousands of concurrent users, the following architectural enhancements should be considered:

1. **Microservices Architecture**:
   As the application grows (e.g., adding billing, notification, or analytics modules), it can be decoupled from a monolithic structure into smaller, domain-specific microservices communicating via event-driven messaging (Kafka/RabbitMQ) or REST/gRPC.

2. **Caching Strategy (Redis)**:
   Frequent read-heavy operations, such as fetching all tasks for an admin dashboard or retrieving specific configuration data, can be cached using Redis. This significantly reduces the database load and improves response times.

3. **Load Balancing & Horizontal Scaling**:
   Deploying the application behind a load balancer (like NGINX or AWS ALB) allows us to run multiple instances of the backend service horizontally. Since JWT authentication is stateless, any instance can seamlessly process any request without maintaining session affinity.

4. **Database Optimization & Replication**:
   - Introduce database indexing on frequently queried columns (e.g., `user_id` in the `tasks` table, or `email` in the `users` table).
   - Implement read-replicas for the MySQL database to distribute the load of read queries, keeping the master database dedicated to write operations.

5. **Containerization & Orchestration**:
   Dockerize the application components (Backend, Frontend, MySQL, Redis) using `Dockerfile` and `docker-compose.yml`. For production, orchestrate these containers using Kubernetes (K8s) to manage auto-scaling, self-healing, and zero-downtime rolling deployments.
