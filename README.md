# BharatInvest

A Shark Tank-style investment platform where founders pitch their businesses, get AI-powered feedback, and connect with investors.

## Tech Stack

- **Backend**: Java 17 + Spring Boot 3 + Spring Security (JWT) + Spring Data JPA + WebSocket
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Database**: MySQL 8
- **AI**: Google Gemini API (free tier)
- **Video**: Cloudinary (free tier)

## Quick Start

### Prerequisites
- Java 17, Maven 3.9+
- Node.js 18+, npm
- MySQL 8

### Backend
```bash
cd backend
# Create MySQL database 'bharatinvest' (auto-created via JPA if createDatabaseIfNotExist=true)
# Copy .env.example to .env and fill values
mvn spring-boot:run
```
Server starts on `http://localhost:8080`

Default admin: `admin@bharatinvest.com` / `admin123`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App opens on `http://localhost:5173`

## Roles

| Role | Can Do |
|------|--------|
| **Admin** | Approve/reject businesses, manage users |
| **Founder** | Create business, upload pitch, get AI feedback, accept/reject offers |
| **Investor** | Browse businesses, watch pitches, make offers, chat with founders |
| **Visitor** | See landing page with locked business cards |

## Free Hosting

- Frontend → **Vercel** (connect repo, set `VITE_API_URL`)
- Backend → **Render** free web service (Dockerfile)
- Database → **Aiven** free MySQL or **TiDB Serverless**
- Video → **Cloudinary** free tier (25GB)
- AI → **Google Gemini** free tier

## Environment Variables

### Backend (`backend/.env`)
```
DB_URL=jdbc:mysql://localhost:3306/bharatinvest?...
DB_USERNAME=root
DB_PASSWORD=root
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GEMINI_API_KEY=
CORS_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:8080
```
