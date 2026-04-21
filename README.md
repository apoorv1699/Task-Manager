# Backend Developer (Intern) Assignment

This repository contains the full-stack solution for the Backend Developer Intern Assignment. The project features a robust Spring Boot backend (with Spring Security, JWT, and MySQL) and a responsive React frontend (built with Vite and Tailwind CSS).

## Features
- **Backend (Java / Spring Boot)**:
  - User registration & login with password hashing (BCrypt) and JWT authentication.
  - Role-based access control (USER vs ADMIN).
  - CRUD operations for the `Task` entity. Users can manage their own tasks; Admins can view and delete all tasks.
  - Global Exception Handling and input validation.
  - API Documentation using Swagger UI / OpenAPI.
- **Frontend (React / Vite / Tailwind CSS)**:
  - Responsive, modern UI.
  - Login and Registration pages with JWT storage.
  - Protected Dashboard to view, add, toggle, and delete tasks.
  - Toast notifications for error and success messages.

## Setup Instructions

### 1. Database Setup
Ensure you have MySQL installed and running. By default, the application is configured with:
- **URL**: `jdbc:mysql://localhost:3306/assignment_db`
- **Username**: `root`
- **Password**: `Apoorv@8806`

The application uses `spring.jpa.hibernate.ddl-auto=update`, which automatically creates the `users` and `tasks` tables upon startup.

### 2. Running the Backend
1. Navigate to the `backend` directory:
   ```bash
   cd project/backend
   ```
2. Start the Spring Boot application using Maven:
   ```bash
   mvnw spring-boot:run
   ```
The backend server will run on `http://localhost:8080`.

### 3. API Documentation
Once the backend is running, access the interactive Swagger UI at:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### 4. Running the Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd project/frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
The frontend application will be available at `http://localhost:5173`.

---

## Scalability & Deployment Note

To ensure the backend system is scalable and production-ready, the following architectural enhancements should be considered:

1. **Microservices Architecture**:
   As the application grows (e.g., adding billing, notification, or analytics modules), it can be decoupled from a monolithic structure into smaller, domain-specific microservices communicating via event-driven messaging (Kafka/RabbitMQ) or REST/gRPC.

2. **Caching Strategy (Redis)**:
   Frequent read-heavy operations, such as fetching all tasks for an admin dashboard or retrieving specific configuration data, can be cached using Redis. This significantly reduces the database load and improves response times.

3. **Load Balancing & Horizontal Scaling**:
   Deploying the application behind a load balancer (like NGINX or AWS ALB) allows us to run multiple instances of the backend service horizontally. Since JWT authentication is stateless, any instance can process any request without maintaining session affinity.

4. **Database Optimization & Replication**:
   - Introduce database indexing on frequently queried columns (e.g., `user_id` in the `tasks` table, or `email` in the `users` table).
   - Implement read-replicas for the MySQL database to distribute the load of read queries, keeping the master database dedicated to write operations.

5. **Containerization & Orchestration**:
   Dockerize the application components (Backend, Frontend, MySQL, Redis) using `Dockerfile` and `docker-compose.yml`. For production, orchestrate these containers using Kubernetes (K8s) to manage auto-scaling, self-healing, and zero-downtime rolling deployments.
