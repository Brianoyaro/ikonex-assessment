# Ikonex Student Management System

A web-based Student Management System for Ikonex Academy. Manage class streams, students, subjects, assessments, and scores — with ranked class reports and individual PDF report cards.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3, Spring Security (JWT), Hibernate/JPA |
| Database | MySQL |
| Frontend | React 19, Vite, Tailwind CSS, Axios |

---

## Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 20+ & npm
- MySQL 8+

---

## Setup

### 1. Database

Create the database in MySQL:

```sql
CREATE DATABASE ikonex;
```

### 2. Backend configuration

Edit `ikonex/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ikonex
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD

# Required in production — must be at least 256 bits (32 characters)
jwt.secret=YOUR_SECRET_KEY_MINIMUM_32_CHARACTERS_LONG
jwt.expiration=86400000
```

Hibernate will auto-create all tables on first run (`ddl-auto=update`).

### 3. Start the backend

```bash
cd ikonex
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080/api`.

### 4. Frontend configuration

Create `ikonex-frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 5. Start the frontend

```bash
cd ikonex-frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deployment

### Backend (JAR)

```bash
cd ikonex
./mvnw clean package -DskipTests
java -jar target/ikonex-0.0.1-SNAPSHOT.jar \
  --spring.datasource.url=jdbc:mysql://YOUR_HOST:3306/ikonex \
  --spring.datasource.username=YOUR_USER \
  --spring.datasource.password=YOUR_PASSWORD \
  --jwt.secret=YOUR_PRODUCTION_SECRET
```

### Frontend (static build)

```bash
cd ikonex-frontend
npm run build
```

Serve the `dist/` folder with any static host (Nginx, Apache, Netlify, Vercel, etc.).

For Nginx, point the server root to `dist/` and add a fallback for SPA routing:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Set `VITE_API_BASE_URL` in `.env` to your production API URL before building.

---

## System Usage

### Authentication

All routes require a JWT. Register a user at `/register`, then log in at `/login`. The token is stored in the browser and sent automatically with every request.

### Class Streams

Navigate to **Classes** → **Add Class** to create streams (e.g. Form 1A, Form 2B). Each stream has a name, form level (1–4), and description.

### Students

Navigate to **Students** → **Add Student**. Fill in the admission number, name, gender, date of birth, status, and select the class stream from the dropdown. Students can be edited or deleted from the table.

### Subjects

Navigate to **Subjects** → **Add Subject** to create subjects with a name and code (e.g. Mathematics / MTH001). Use the **Assign Subject To Class** panel on the same page to link a subject to a class stream, creating a *Class Subject*.

### Assessments

Navigate to **Assessments** → **Add Assessment** to create assessments with a name (e.g. Term 1 - CAT 1), type (CAT 1, CAT 2, Mid-Term, End-Term), total score, term, and date.

### Recording Scores

Navigate to **Scores**:

1. Select a **Class Stream**
2. Select a **Class Subject** (populated from the chosen stream)
3. Select an **Assessment**
4. Enter scores for each student in the table
5. Click **Save Scores**

Scores are validated (0–100) and saved one per student.

### Reports

Navigate to **Reports** and select a report type:

| Report | What it shows |
|---|---|
| **Class Performance** | All students in a class ranked by overall average, with total and position |
| **Subject Positions** | Each subject in a class ranked by class average score |
| **Student Report Card** | Individual student's scores, totals, averages, and grades per subject |

Click **Export as PDF** to download the displayed report.

---

## Grading Scale

| Grade | Range |
|---|---|
| A | 80–100 |
| B | 70–79 |
| C | 60–69 |
| D | 50–59 |
| E | 40–49 |
| F | 0–39 |

---

## API Overview

| Resource | Base path |
|---|---|
| Auth | `/api/auth` |
| Class Streams | `/api/class-streams` |
| Students | `/api/students` |
| Subjects | `/api/subjects` |
| Assessments | `/api/assessments` |
| Scores | `/api/scores` |

All endpoints (except `/auth/login` and `/auth/register`) require `Authorization: Bearer <token>`.
