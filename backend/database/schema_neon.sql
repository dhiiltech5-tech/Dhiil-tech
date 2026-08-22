-- ============================================================
-- Dhiil Tech - Neon PostgreSQL Database Schema & Initial Data
-- Copy and paste ALL lines into Neon SQL Editor and click Run!
-- ============================================================

BEGIN;

-- Drop tables if they exist
DROP TABLE IF EXISTS token_blocklist CASCADE;
DROP TABLE IF EXISTS visits CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS team CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 1. Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_system INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Permissions Table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(60) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Role Permissions Pivot Table
CREATE TABLE role_permissions (
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 4. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(id) DEFAULT 2,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    phone VARCHAR(30),
    status VARCHAR(20) DEFAULT 'Active',
    email_verified INT DEFAULT 0,
    two_fa_secret VARCHAR(64),
    two_fa_enabled INT DEFAULT 0,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip VARCHAR(45),
    password_changed_at TIMESTAMP WITH TIME ZONE,
    is_deleted INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(170) NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    github_link VARCHAR(255),
    demo_link VARCHAR(255),
    technologies VARCHAR(255),
    client VARCHAR(100),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Development',
    is_deleted INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Services Table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(170) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(100) DEFAULT 'fas fa-laptop-code',
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. Contacts Table
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    subject VARCHAR(150),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. News Table
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    image TEXT,
    category VARCHAR(100),
    tags VARCHAR(500),
    status VARCHAR(20) DEFAULT 'Draft' NOT NULL,
    is_featured INT DEFAULT 0 NOT NULL,
    view_count INT DEFAULT 0 NOT NULL,
    is_deleted INT DEFAULT 0 NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Team Table
CREATE TABLE team (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    bio TEXT,
    linkedin VARCHAR(255),
    github VARCHAR(255),
    twitter VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Testimonials Table
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    position VARCHAR(100),
    feedback TEXT NOT NULL,
    rating INT DEFAULT 5 NOT NULL,
    image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Published' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Settings Table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    company_email VARCHAR(120) DEFAULT 'info@dhiiltech.com' NOT NULL,
    contact_phone VARCHAR(30) DEFAULT '+252 61 9586339' NOT NULL,
    office_location VARCHAR(255) DEFAULT 'Mogadishu, Somalia' NOT NULL,
    projects_done INT DEFAULT 1 NOT NULL,
    trusted_partners INT DEFAULT 20 NOT NULL,
    services_provided INT DEFAULT 7 NOT NULL,
    satisfaction_rate INT DEFAULT 3 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 13. Visits Table
CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 14. Token Blocklist Table
CREATE TABLE token_blocklist (
    id SERIAL PRIMARY KEY,
    jti VARCHAR(36) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

INSERT INTO roles (id, name, slug, description, is_system) VALUES (1, 'Super Admin', 'superadmin', 'Full system control', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name, slug, description, is_system) VALUES (2, 'Admin', 'admin', 'Administrative access', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name, slug, description, is_system) VALUES (3, 'Editor', 'editor', 'Content editor', 0) ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name, slug, description, is_system) VALUES (4, 'Employee', 'employee', 'Standard staff member', 0) ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name, slug, description, is_system) VALUES (5, 'Viewer', 'viewer', 'Read-only access', 0) ON CONFLICT (id) DO NOTHING;

INSERT INTO permissions (name, slug, module) VALUES ('Create Project', 'create_project', 'projects') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Edit Project', 'edit_project', 'projects') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Delete Project', 'delete_project', 'projects') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Create Service', 'create_service', 'services') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Edit Service', 'edit_service', 'services') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Delete Service', 'delete_service', 'services') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('View Messages', 'view_messages', 'contact') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Edit Messages', 'edit_messages', 'contact') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Delete Messages', 'delete_messages', 'contact') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Create News', 'create_news', 'news') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Edit News', 'edit_news', 'news') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Delete News', 'delete_news', 'news') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('View Subscribers', 'view_subscribers', 'newsletter') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Delete Subscribers', 'delete_subscribers', 'newsletter') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Create Team', 'create_team', 'team') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Edit Team', 'edit_team', 'team') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Delete Team', 'delete_team', 'team') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Create Testimonial', 'create_testimonial', 'testimonials') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Edit Testimonial', 'edit_testimonial', 'testimonials') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Delete Testimonial', 'delete_testimonial', 'testimonials') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('View Users', 'view_users', 'users') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Create User', 'create_user', 'users') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Edit User', 'edit_user', 'users') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Delete User', 'delete_user', 'users') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('View Dashboard', 'view_dashboard', 'stats') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('View Analytics', 'view_analytics', 'stats') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Export Analytics', 'export_analytics', 'stats') ON CONFLICT (slug) DO NOTHING;
INSERT INTO permissions (name, slug, module) VALUES ('Edit Settings', 'edit_settings', 'settings') ON CONFLICT (slug) DO NOTHING;

-- Assign all permissions to Admin role (role_id = 2)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions
ON CONFLICT DO NOTHING;

-- Insert Default Super Admin User (email: admin@dhiiltech.com, password: admin123)
INSERT INTO users (name, email, password_hash, role_id, status) VALUES
('Dhiil Tech Admin', 'admin@dhiiltech.com', '$2a$10$e8w.x9T3.pU9N5L6j5G9d.V/o2Z1lW.E.R9d4eX1m5/O5GZ8U6k1s', 1, 'Active')
ON CONFLICT (email) DO NOTHING;

-- Insert Default Settings
INSERT INTO settings (company_email, contact_phone, office_location, projects_done, trusted_partners, services_provided, satisfaction_rate) VALUES
('info@dhiiltech.com', '+252 61 9586339', 'Mogadishu, Somalia', 1, 20, 7, 3)
ON CONFLICT (id) DO NOTHING;

-- Fix sequence counters for auto-increment IDs
SELECT setval('roles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM roles));
SELECT setval('permissions_id_seq', (SELECT COALESCE(MAX(id), 1) FROM permissions));
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('settings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM settings));

COMMIT;
