# LogVault Dashboard

> **LogVault** is a full‑stack logging dashboard that lets developers collect, view, and analyze application logs in real time. It consists of a **Node/Express** backend with a local **MongoDB** store, a **React + Vite** frontend, and a tiny **logvault‑sdk** for ingesting logs.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running locally](#running-locally)
- [Deployment](#deployment)
- [Links](#links)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **User authentication** with JWT (register / login).
- **Application management** – create, view, delete apps.
- **Log ingestion** – SDK that posts logs to `/api/applications/:name/logs`.
- **Rich UI** – glass‑morphism cards, animated filters, and metrics charts.
- **Real‑time filtering & sorting** of logs.
- **Error handling** with a global error middleware.

---

## Tech Stack
| Layer | Technology |
|-------|------------|
| Backend | Node.js (v24), Express, Mongoose, JWT, bcrypt |
| Database | MongoDB (local or Atlas free tier) |
| SDK | Vanilla fetch wrapper (published to npm) |
| Frontend | React 18, Vite, Tailwind‑CSS (custom design tokens), Lucide React |
| Deployment | Free‑tier providers (Vercel / Netlify for frontend, Render / Railway for backend) |

---

## Getting Started
### Prerequisites
- **Node.js** (>= v24) and **npm**
- **MongoDB** running locally (`net start MongoDB` on Windows) or an Atlas URI.

### Installation
```bash
# Clone the repo (replace with your own URL)
git clone https://github.com/your-username/logvault-dashboard.git
cd logvault-dashboard

# Backend setup
cd backend
npm ci
# Create a .env file based on .env.example
cp .env.example .env
# Adjust MONGODB_URI if needed

# Frontend setup
cd ../frontend
npm ci
cp .env.example .env   # optional – set REACT_APP_API_URL if you deploy backend elsewhere
```

### Running locally
```bash
# In two terminals:
# Terminal 1 – backend
cd backend
npm run dev

# Terminal 2 – frontend
cd frontend
npm run dev
```
Open `http://localhost:5173` to view the dashboard. The backend runs on `http://localhost:5000`.

---

## Deployment
You can deploy the frontend to **Vercel**, **Netlify**, or **Render** (free tier) and the backend to **Render**, **Railway**, or **Fly.io**.
1. Connect the GitHub repository to the provider.
2. Set environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.).
3. Enable automatic builds.

Live URLs (replace the placeholders once deployed):
- Frontend: `https://logvault-frontend.<provider>.com`
- Backend API: `https://logvault-backend.<provider>.com`
- API Docs: `https://logvault-backend.<provider>.com/api-docs`

---

## Links
- **GitHub – Backend**: https://github.com/your-username/logvault-backend
- **GitHub – Frontend**: https://github.com/your-username/logvault-frontend
- **GitHub – SDK**: https://github.com/your-username/logvault-sdk
- **npm – SDK**: https://www.npmjs.com/package/logvault-sdk
- **Live Frontend**: https://logvault-frontend.<provider>.com
- **Live Backend**: https://logvault-backend.<provider>.com

---

## Contributing
Contributions are welcome! Please fork the repo, create a feature branch, and submit a pull request. Follow the existing code style and run `npm run lint` before pushing.

