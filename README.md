# Tawtheeq (توثيق)

## 🎓 Project Overview
**Tawtheeq** is a comprehensive, secure, and centralized academic credential issuance and verification platform. It is designed to bridge the gap between universities, the Ministry of Higher Education (MOHE), staff, and students by providing a unified ecosystem for managing academic certificates. 

The primary goal of Tawtheeq is to prevent credential fraud, streamline the certificate issuance process, and provide a fast, reliable method for third parties (such as employers) to verify academic achievements.

### Key Stakeholders:
- **MOHE (Ministry of Higher Education)**: Administrative oversight, system-wide auditing, and global certificate management.
- **University Administrators & Staff**: Certificate issuance, revocation, and student management.
- **Students**: Secure access to their academic credentials, tracking, and easy sharing of verified certificates.

## 🚀 Technology Stack
A full-stack application built using the MERN stack with enterprise blockchain integration:
- **Blockchain**: Hyperledger Fabric (Chaincode written in Node.js, deployed on Kaleido)
- **Frontend**: React (Vite), TailwindCSS
- **Backend**: Node.js (Express)
- **Database**: MongoDB (Mongoose)
- **Decentralized Storage**: IPFS (InterPlanetary File System)

## 📝 Key Features
- **Role-Based Dashboards**: Tailored interfaces for MOHE, University Admins, Staff, and Students.
- **Certificate Lifecycle Management**: Issue, revoke, and manage academic certificates securely.
- **Verification System**: Instant validation of certificates to ensure authenticity.
- **Audit Logs**: Comprehensive tracking of all administrative actions for transparency.
- **Secure Authentication**: OTP-based password recovery, robust session management.
- **Responsive UI/UX**: Modern, accessible, and fast interface with dark/light mode support.

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Kaleido](https://www.kaleido.io/) account for Hyperledger Fabric & IPFS (optional for local dev)

### 1. Clone the Repository
```bash
git clone https://github.com/ROBINMASH1/Tawtheeq.git
cd Tawtheeq
```

### 2. Configure Environment Variables

**Backend:**
```bash
cp server-backend/.env.example server-backend/.env
# Edit server-backend/.env and fill in all required values
```

**Frontend:**
```bash
cp client-frontend/.env.example client-frontend/.env
# Edit client-frontend/.env and set VITE_API_URL to your backend URL
```

### 3. Install Dependencies
```bash
npm run install:backend
npm run install:frontend
```

### 4. Seed the Database (Optional)
Populates the database with demo users and a sample certificate:
```bash
npm run seed
```
> ⚠️ This will clear all existing data. Demo credentials are printed to console after seeding.

### 5. Run Locally

**Backend** (runs on `http://localhost:5000`):
```bash
npm run dev:backend
```

**Frontend** (runs on `http://localhost:5173`):
```bash
npm run dev:frontend
```

### 6. API Documentation
Once the backend is running, visit `http://localhost:5000/api-docs` for the Swagger UI.
> Access requires the `SWAGGER_USER` / `SWAGGER_PASSWORD` credentials from your `.env`.

## 📄 License
This project is licensed under the [MIT License](LICENSE).
