# InternTrack

InternTrack is a full-stack internship and OJT application tracking system designed to help students organize and monitor their internship applications in one place.

The system allows users to register, log in, manage internship applications, track application statuses, monitor deadlines, and view dashboard statistics.

## Live Demo

Frontend:
https://intern-track-beige.vercel.app

Backend API:
https://interntrack-production-63c7.up.railway.app

Health Check:
https://interntrack-production-63c7.up.railway.app/api/health

---

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Create internship applications
- View application details
- Edit applications
- Delete applications
- Track application status
- Search applications
- Filter applications by status
- Sort applications
- Dashboard statistics
- Upcoming deadline tracking
- Responsive design for desktop, tablet, and mobile
- REST API integration
- PostgreSQL database

---

## Application Statuses

InternTrack supports the following application statuses:

- TO_APPLY
- APPLIED
- INTERVIEW
- OFFER
- REJECTED
- WITHDRAWN

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- React Icons

### Backend

- Node.js
- Express.js
- REST API
- JWT
- bcryptjs

### Database

- PostgreSQL
- Supabase

### Deployment

- Vercel — Frontend
- Railway — Backend
- Supabase — PostgreSQL Database
- GitHub — Version Control

---

## System Architecture

```text
React + Vite Frontend
        |
        v
Node.js + Express REST API
        |
        v
Supabase PostgreSQL
