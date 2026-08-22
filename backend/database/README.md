# Database Schemas & Migrations

This folder contains ready-to-use SQL schema files and initial seed data for **Dhiil Tech**:

## 1. `schema_neon.sql` (PostgreSQL / Neon)
- **Target**: Neon PostgreSQL, Supabase, Amazon RDS PostgreSQL, local PostgreSQL.
- **Usage**: Copy and paste the entire contents into **Neon SQL Editor** and click **Run**.
- **Features**: Creates all 14 tables, sets primary key auto-increment sequences, maps relationships, and inserts default roles, permissions, and admin user (`admin@dhiiltech.com` / `admin123`).

## 2. `schema_mysql.sql` (MySQL / MariaDB)
- **Target**: MySQL, MariaDB, XAMPP, phpMyAdmin, MySQL Workbench.
- **Usage**: Import or execute in phpMyAdmin / MySQL Workbench. Creates `dhiiltech_db` schema and seeds default data.

## Automated Seeding with Node.js
Instead of running SQL manually, you can also seed the connected database automatically via:
```bash
cd backend
npm run seed
```
This script detects whether you are connected to PostgreSQL or MySQL and syncs models automatically.
