<div align="center">
  <img src="./public/assets/images/logo.png" alt="Dhiil Tech Logo" width="180" />
  
  <h1>Dhiil Tech 🚀</h1>
  <p><b>Smart Digital Solutions & Enterprise Portfolio Platform</b></p>
  
  <p>
    <img src="https://img.shields.io/badge/License-MIT-04C244?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/Version-1.0.0-04C244?style=for-the-badge" alt="Version" />
    <img src="https://img.shields.io/badge/React-19.0-04C244?style=for-the-badge&logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-04C244?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-04C244?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  </p>
  <br>
</div>

**Dhiil Tech** is a premium, high-performance digital solutions platform built for modern technology services. It combines a sleek, glassmorphic public portfolio with a robust, enterprise-ready Administrative Dashboard (CMS) for real-time management of content, projects, team members, services, client messages, and analytics.

---

## 🌟 Key Features

### 🌐 Public Frontend
- **Modern Dark-Mode Aesthetic**: High-fidelity glassmorphic design system using Tailwind CSS, Framer Motion, and responsive layouts.
- **Dynamic Services & Portfolio**: Real-time rendering of active Services, Projects, Testimonials, Team Members, and News articles fetched from the backend API.
- **Interactive Contact & Newsletter**: Integrated forms for client consultations and newsletter subscriptions.
- **PDF & Document Tools**: Native report and invoice generation using `jsPDF` and `html2canvas`.
- **Mobile Experience**: Tailored mobile navigation and mobile-optimized home views.

### 🔐 Administrative Dashboard (`/admin`)
- **Content Management System (CMS)**: Full CRUD operations for Projects, Services, News, Testimonials, Team Members, and System Settings.
- **Role-Based Access Control (RBAC)**: Fine-grained permission system supporting Admin, Editor, and Viewer roles.
- **Secure Authentication**: JWT token authentication with bcrypt password hashing and token blocklisting.
- **Analytics & Messaging**: Real-time visitor traffic analytics and client inquiry message inbox.
- **System Settings**: Instant updates to company contact details, phone numbers, and office locations.

---

## 🛠 Tech Stack

### Frontend Architecture
- **Framework**: React 19 (Bootstrapped with Vite 8)
- **Styling**: Tailwind CSS v4 & Lucide React icons
- **Animations**: Framer Motion
- **Routing**: React Router DOM v7
- **Exports & Utilities**: jsPDF, jspdf-autotable, html2canvas

### Backend Architecture
- **Server Runtime**: Node.js & Express.js (ES Modules)
- **ORM & Database**: Sequelize ORM supporting **PostgreSQL** (Neon/Supabase) & **MySQL** (MariaDB)
- **Security & Authentication**: JSON Web Token (JWT), `bcryptjs` password hashing, and token blocklisting
- **File Uploads**: Multer middleware for media management

---

## 📂 Project Structure

```
Dhiil tech/
├── backend/                  # Node.js Express REST API
│   ├── config/               # Database connection (Sequelize)
│   ├── controllers/          # Business logic & route handlers
│   ├── database/             # SQL schema files (MySQL & Neon PostgreSQL)
│   ├── middleware/           # Auth (JWT) & error handling middleware
│   ├── models/               # Sequelize models (User, Role, Project, etc.)
│   ├── routes/               # Express API endpoints
│   ├── scripts/              # Automated database seeder (seed.js)
│   ├── server.js             # API entry point
│   └── package.json
├── public/                   # Static assets & branding images
├── src/                      # React Frontend Application
│   ├── admin/                # Admin Panel pages, components, & guards
│   ├── components/           # Reusable UI components (Hero, Services, etc.)
│   ├── layouts/              # Main layout wrappers
│   ├── pages/                # Public page views (Home, About, Services, etc.)
│   ├── services/             # API service layer (api.js)
│   ├── App.jsx               # Main App component & routes
│   └── main.jsx
├── index.html                # Entry HTML document
├── render.yaml               # Render Cloud deployment config
├── vercel.json               # Vercel static deployment config
├── vite.config.js            # Vite build setup
└── README.md
```

---

## ⚙️ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+`
- **Database**: PostgreSQL (e.g. Neon.tech / local PostgreSQL) OR MySQL / MariaDB

---

### 2. Backend Setup (`backend/`)

1. Navigate into the backend directory:
   ```bash
   cd backend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key
   
   # Choose database connection string (PostgreSQL or MySQL)
   DATABASE_URL=postgresql://user:password@localhost:5432/dhiiltech_db
   # OR for MySQL:
   # DATABASE_URL=mysql://root:password@localhost:3306/dhiiltech_db
   ```

4. Run Database Seeding (creates default tables, permissions, and Super Admin user):
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run at `http://localhost:5000`.*

---

### 3. Frontend Setup (Root)

1. Open a new terminal in the project root:
   ```bash
   cd "d:\Projects\OTS\Dhiil tech"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Access the public site at `http://localhost:5173` and the Admin Portal at `http://localhost:5173/admin`.*

---

## 🔐 Administrative Access

Default administrative credentials generated during database seeding:

- **Admin Portal URL**: `/admin`
- **Email**: `admin@dhiiltech.com`
- **Password**: `admin123`

*> **Security Notice**: Please log into the Admin Dashboard (`/admin`) and change your password immediately after initial setup.*

---

## 🚀 Deployment Guide

### Render Deployment (`render.yaml`)
This repository includes a pre-configured [`render.yaml`](render.yaml) file for automated multi-service deployment:
- **Backend Service**: Node.js Web Service running `npm start` in `backend/`.
- **Frontend Service**: Static Site built with `npm run build`.

### Vercel Deployment (`vercel.json`)
The frontend is optimized for deployment on Vercel with client-side rewrite rules pre-configured in [`vercel.json`](vercel.json).

---

## 🛡 Security Protocols

- **Token Blocklisting**: Immediate JWT revocation upon admin logout.
- **Password Hashing**: Cryptographic password security using `bcryptjs` with salt rounds.
- **CORS Rules**: Cross-Origin Resource Sharing restrictions configured per environment.
- **Protected Routes**: React router guards (`AuthGuard.jsx` & `RoleGuard.jsx`) preventing unauthorized access to admin views.

---

## 🤝 Contributing

We welcome contributions to Dhiil Tech!
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<br>

<div align="center">
  <b>Developed with 💚 & ☕ by the <strong>Dhiil Tech Team</strong></b>
  <br>
  <i>Empowering businesses through modern digital innovation.</i>
</div>