# TrustVault — Confidential Document Workspace

> **TrustVault** is a zero-trust confidential document management system built for high-security environments, featuring out-of-band Multi-Factor Authentication (MFA), granular per-document access control with instant revocation, cryptographic file integrity validation, and immutable audit logging.

---

## 📑 Core Documentation
* 🛡️ **[THREATS.md](THREATS.md):** Complete threat model (STRIDE / OWASP Top 10), mitigations, and automated test mapping.
* 🤖 **[PROMPTS.md](PROMPTS.md):** Dated AI engineering log detailing architectural interventions, security flaw remediation, and bug fixes.

---

## 🚀 Key Security & Functional Features

1. **Out-of-Band Multi-Factor Authentication (MFA / 2FA):**
   * Two-tier authentication requiring email-verified 6-digit OTP codes with 10-minute TTL.
   * Zero client-side leakage: verification codes are strictly delivered out-of-band and never exposed in API payloads or DOM.
   * Built-in 30-second rate-limiting cooldown against automated brute-force requests.

2. **Fine-Grained Per-Document Access Control & Instant Revocation:**
   * Dynamic ownership validation (`owner`) and per-document viewer permissions (`allowedViewers`).
   * **Instant Revocation:** When an owner revokes access from a viewer, subsequent download requests immediately fail with non-disclosing `404 Access Denied` errors.

3. **Multi-Stage File Upload & Storage Isolation:**
   * Strict extension whitelisting (`.pdf`, `.docx`, `.png`, `.jpg`).
   * Magic bytes and MIME verification via `file-type` and deep DOCX zip structure validation with `yauzl`.
   * Files stored outside the public web root in `private_uploads/` using cryptographically random UUIDs (`crypto.randomUUID()`), defeating path traversal attacks.

4. **Immutable Audit Trail:**
   * System actions (`UPLOAD`, `DOWNLOAD`, `SHARE`, `REVOKE`) are recorded in an append-only MongoDB collection.
   * Access to audit logs is strictly restricted to verified users with the `admin` role (non-admin attempts rejected with `403 Forbidden`).

5. **Cryptographically Secure Password Recovery:**
   * 32-byte cryptographically secure random tokens (`crypto.randomBytes(32)`) with SHA-256 database hashing and 15-minute expiration.

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** React 19, Vite 8, Vanilla CSS3 (Single-scroll responsive layout, accessible typography, SVG iconography).
* **Backend:** Node.js v22, Express.js 5, Helmet security headers, Multer storage engine, Yauzl.
* **Database:** MongoDB Atlas via Mongoose ODM.
* **Authentication:** JSON Web Tokens (JWT) with HMAC-SHA256, Bcrypt (12 salt rounds).
* **Email Delivery:** Resend REST API / Gmail SMTP with TLS.
* **Testing:** Vitest, Supertest.

---

## 🏃 Local Setup & Installation

### Prerequisites
* Node.js (v18 or higher)
* MongoDB database (MongoDB Atlas or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/trustvault.git
cd trustvault
```

### 2. Configure Backend Environment
Create a `.env` file in the `backend/` directory based on `backend/.env.example`:
```bash
cp backend/.env.example backend/.env
```
Populate the required credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_secret

# Email Dispatch (Resend API recommended)
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_api_key
```

### 3. Install Dependencies & Start Services
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Automated Security Test Suite

Execute the 21 automated threat model verification tests:

```bash
cd backend
npm test -- --run
```

All security suites will execute and verify access control, OTP secrecy, authorization invariants, and file boundary checks.

---

## 🎬 3-Minute Live Hackathon Demo Walkthrough

1. **MFA Login (0:00 - 0:45):** Log in as document owner. Demonstrate receipt of real 6-digit OTP code in email and zero code leakage on screen.
2. **Upload & Share (0:45 - 1:30):** Upload a confidential file. Share access with an auditor viewer email.
3. **The Proof of Revocation (1:30 - 2:15):** Switch to viewer session. Download the shared document. Switch back to owner and click **Revoke**. Show that viewer's subsequent download is immediately terminated with **Access Denied**.
4. **Audit Evidence (2:15 - 3:00):** Log in as admin and show the chronological audit trail capturing the Upload, Share, Download, and Revoke events.
