1. Project Title
IgniteX – AI-Powered Career Preparation Platform

3. Problem Statement
Many students and professionals struggle to build strong resumes, identify career paths, and
stay consistent with their learning goals.
IgniteX aims to solve this by providing an AI-powered career preparation platform where users
can create resumes,get industry analysis, receive weekly AI-generated learning plans, and
practice mock interview questionnaires tailored to their target roles — all in one place.

5. System Architecture
Flow:
Frontend (Next.js ) → Backend (Node.js + Express API) → Database (Postgres SQL)
Architecture Details
● Frontend: Next.js with TailwindCSS for styling add on Accertinity UI.
● Backend: Node.js with Express framework providing REST APIs.
● Database:Prisma with Postgres SQL(relational database) for storing user profiles,
resumes, plans, and mock questions.
● Authentication: JWT-based login/signup for secure access.
● Hosting:
○ Frontend → Vercel
○ Backend → Render / Railway
○ Database →Hosted on PostgreSQL (Cloud-based instance)

7. Key Features
Category Features
Authentication &
Authorization
User signup, login, logout using JWT tokens
CRUD Operations Manage resumes, AI learning plans, and mock interview questions
Pagination, Search &
Sorting
Implemented for resumes, plans, and questions (e.g.,
/api/resume?search=frontend&page=1&limit=10&sortB
y=date)
Resume Builder Users can create and edit resumes directly on the platform
AI-Generated Learning
Plan
GPT/Gemini-based generation of weekly personalized study plans
for chosen job roles
Mock Interview Module Practice AI-curated interview questions based on selected industry
Frontend Routing Pages: Home, Login, Dashboard, Resume Builder, Learning Plan,
Mock Interview
Hosting Fully deployed backend and frontend with the database connected
through Prisma ORM on a cloud-hosted PostgreSQL instance.

9. Tech Stack
Layer Technologies
Frontend Next.js / React, TailwindCSS, Accertinity UI
Backend Node.js, Express.js
Database Postgres SQL
Authentication JWT (JSON Web Token)
AI Integration OpenAI API (GPT models)/ Gemini for resume generation & learning
plan
Hosting Vercel (Frontend), Render / Railway (Backend), PostgreSQL
(Cloud-based instance)

11. API Overview
Endpoint Method Description Access
/api/auth/signup POST Register a new user Public
/api/auth/login POST Authenticate user and return
JWT token
Public
/api/resume POST Create a new resume Authenticated
/api/resume GET Get all resumes with
pagination, search, and sorting
Authenticated
/api/resume/:id GET Fetch a specific resume Authenticated
/api/resume/:id PUT Update existing resume Authenticated
/api/resume/:id DELETE Delete a resume Authenticated
/api/plan/generat
e
POST Generate a weekly AI learning
plan based on job role
Authenticated
/api/plan GET Fetch all learning plans with
pagination
Authenticated
/api/mock POST Add a new mock interview
question
Admin
/api/mock GET Fetch mock questions by
role/category (supports filters,
pagination)
Authenticated
