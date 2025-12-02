# IgniteX – AI-Powered Career Preparation Platform

## Project Overview
IgniteX is an AI-driven career preparation platform that helps students and professionals build strong resumes, discover personalized career paths, and stay consistent with their learning goals. Users can create and improve resumes, receive weekly AI-generated learning plans, and practice mock interview questions tailored to their target roles.

---

## Problem Statement
Many students and professionals struggle to:  
- Build impactful resumes  
- Identify the right career paths  
- Stay consistent with structured learning  
- Prepare for industry-specific interviews  

**IgniteX** addresses these challenges by integrating AI-powered tools to guide users through every step of career preparation.

---

## System Architecture
**Flow:** Frontend (Next.js) → Backend (Node.js + Express API) → Database (PostgreSQL via Prisma ORM)

**Details:**  
- **Frontend:** Next.js with TailwindCSS + Accertinity UI  
- **Backend:** Node.js with Express.js providing REST APIs  
- **Database:** PostgreSQL (Relational) using Prisma ORM  
- **Authentication:** JWT-based login/signup  
- **Hosting:**  
  - Frontend → Vercel  
  - Backend → Render / Railway  
  - Database → Cloud-hosted PostgreSQL  

---

## Key Features
- **Authentication & Authorization:** User signup, login, and logout using JWT tokens  
- **CRUD Operations:** Manage resumes, AI learning plans, and mock interview questions  
- **Pagination, Search & Sorting:** Implemented for resumes, plans, and mock questions  
- **Resume Builder:** Users can create and edit resumes directly on the platform  
- **AI-Generated Learning Plan:** GPT/Gemini-based personalized weekly study plans for selected job roles  
- **Mock Interview Module:** Practice AI-curated interview questions based on industry and role  
- **Frontend Routing:** Home, Login, Dashboard, Resume Builder, Learning Plan, Mock Interview  
- **Deployment:** Fully deployed with cloud-hosted PostgreSQL connected via Prisma ORM  

---

## Tech Stack
- **Frontend:** Next.js / React, TailwindCSS, Accertinity UI  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL with Prisma ORM  
- **Authentication:** JWT (JSON Web Token)  
- **AI Integration:** OpenAI GPT / Gemini for resume improvement and learning plan generation  
- **Hosting:** Vercel (Frontend), Render / Railway (Backend), PostgreSQL (Cloud)  

---

## API Overview

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| /api/auth/signup | POST | Register a new user | Public |
| /api/auth/login | POST | Authenticate user and return JWT token | Public |
| /api/resume | POST | Create a new resume | Authenticated |
| /api/resume | GET | Get all resumes with pagination, search, sorting | Authenticated |
| /api/resume/:id | GET | Fetch a specific resume | Authenticated |
| /api/resume/:id | PUT | Update an existing resume | Authenticated |
| /api/resume/:id | DELETE | Delete a resume | Authenticated |
| /api/resume/improve | POST | AI-assisted resume improvement | Authenticated |
| /api/plan/generate | POST | Generate weekly AI learning plan based on job role | Authenticated |
| /api/plan | GET | Fetch all learning plans with pagination | Authenticated |
| /api/mock | POST | Add a new mock interview question (Admin) | Admin |
| /api/mock | GET | Fetch mock questions by role/category with filters | Authenticated |
| /api/contact | POST | Submit contact form queries | Public |
| /api/onboarding/update | POST | Update onboarding status | Authenticated |
| /api/onboarding/status | GET | Fetch onboarding status | Authenticated |
| /api/assessments | POST | Create assessment | Authenticated |
| /api/assessments | GET | Get all assessments | Authenticated |
| /api/assessments/:id | GET | Fetch assessment by ID | Authenticated |
| /api/assessments/:id | PUT | Update assessment | Authenticated |
| /api/assessments/:id | DELETE | Delete assessment | Authenticated |
| /api/assessments/:id/attempt | POST | Attempt assessment | Authenticated |

---

## Deployment & Hosting
- **Frontend:** Vercel  
- **Backend:** Render / Railway  
- **Database:** PostgreSQL Cloud instance via Prisma ORM  

**Live App:** [ignite-x-five.vercel.app](https://ignite-x-five.vercel.app)  

---

## Contributors
- **Lead Developer:** Anwesha Adhikari  
- **Frontend:** React & Next.js  
- **Backend:** Node.js, Express, Prisma  
- **AI Integration:** GPT / Gemini APIs  
- **UI/UX:** TailwindCSS & Accertinity UI  

---

## License
MIT License
