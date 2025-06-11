# Task Tracker App

A full-stack Kanban-style task tracker built with NestJS (backend) and React (frontend). Users can sign up, log in via JWT, and manage Boards ➔ Lists ➔ Cards with full CRUD, pagination, seeding, and Docker Compose support.

---

## 📦 Tech Stack

- **Backend**  
  - NestJS (TypeScript)  
  - Prisma ORM → PostgreSQL  
  - Passport JWT for authentication  
  - class-validator / class-transformer  
- **Frontend**  
  - React + Vite + TypeScript  
  - Tailwind CSS + shadcn/ui  
  - Zustand for state management  
  - React Router  
  - Axios for API calls  
- **DevOps**  
  - Docker Compose (Postgres service)  
  - ts-node seed scripts  
  - Jest for testing  

---

## 🚀 Prerequisites

- Node.js v16+ & npm  
- Docker Desktop (or Docker engine)  
- `npx prisma`, `ts-node` available (locally or globally)

---

## ⚙️ Environment

Copy `.env.example → .env` in **backend/** and fill in:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/task_tracker_db?schema=public"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="1h"