# Tawtheeq — DigitalOcean App Platform Deployment Guide

---

## Backend (Node.js / Express API)

| Setting               | Value                          |
|-----------------------|--------------------------------|
| **Source Directory**  | `server-backend`               |
| **Build Command**     | `npm install`                  |
| **Run Command**       | `npm start`                    |
| **HTTP Port**         | `${PORT}` (set by App Platform)|

### Environment Variables

Set these in the DigitalOcean App Platform **Environment Variables** panel for the backend component:

| Variable       | Description                                      | Example                                      |
|----------------|--------------------------------------------------|----------------------------------------------|
| `PORT`         | Automatically provided by App Platform           | *(leave blank — auto-injected)*              |
| `MONGO_URI`    | MongoDB connection string                        | `mongodb+srv://user:pass@cluster.mongodb.net/tawtheeq` |
| `JWT_SECRET`   | Secret key for signing JWTs                      | `s3cureR@ndomStr1ng!`                        |
| `CLIENT_URL`   | Deployed frontend URL (for CORS)                 | `https://your-frontend.ondigitalocean.app`   |
| `EMAIL_HOST`   | SMTP server hostname                             | `smtp.titan.email`                           |
| `EMAIL_PORT`   | SMTP port                                        | `465`                                        |
| `EMAIL_USER`   | SMTP username / sender email                     | `no-reply@tawtheeq.tech`                    |
| `EMAIL_PASS`   | SMTP password                                    | *(your SMTP password)*                       |
| `EMAIL_FROM`   | Display name in outgoing emails                  | `Tawtheeq System`                            |

> **Tip:** Use a managed MongoDB provider (e.g. DigitalOcean Managed Database or MongoDB Atlas) and paste the connection string into `MONGO_URI`.

---

## Frontend (Vite + React)

| Setting                | Value                              |
|------------------------|------------------------------------|
| **Source Directory**   | `client-frontend`                  |
| **Build Command**      | `npm install && npm run build`     |
| **Output Directory**   | `dist`                             |
| **Component Type**     | Static Site                        |

### Environment Variables

Set these at **build time** (they are baked into the static bundle):

| Variable        | Description                              | Example                                         |
|-----------------|------------------------------------------|-------------------------------------------------|
| `VITE_API_URL`  | Backend API base URL (no trailing slash) | `https://your-backend.ondigitalocean.app`       |

> **Note:** Vite requires the `VITE_` prefix to expose variables to client code. The variable is accessed via `import.meta.env.VITE_API_URL`.

---

## Quick Setup Steps

1. **Create a new App** on DigitalOcean App Platform and connect your GitHub/GitLab repo.

2. **Add two components:**
   - **Web Service** → source dir `server-backend`, run command `npm start`
   - **Static Site** → source dir `client-frontend`, output dir `dist`

3. **Configure environment variables** for each component as listed above.

4. **Set `CLIENT_URL`** on the backend to the static site's URL once assigned.

5. **Set `VITE_API_URL`** on the frontend to the web service's URL once assigned.

6. **Deploy** — App Platform will run the build/run commands automatically.

---

## File Reference

| File                                          | Purpose                                          |
|-----------------------------------------------|--------------------------------------------------|
| `server-backend/.env.example`                 | Lists all required backend env vars              |
| `client-frontend/.env.example`                | Lists all required frontend env vars             |
| `client-frontend/src/config/api.js`           | Centralized API base URL config                  |
| `server-backend/src/server.js`                | Entry point — reads `PORT`, `CLIENT_URL`         |
| `server-backend/src/config/db.js`             | Reads `MONGO_URI`                                |
| `server-backend/src/utils/auth.helpers.js`    | Reads `JWT_SECRET`, `EMAIL_*` variables          |
