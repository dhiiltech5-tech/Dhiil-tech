-- ============================================================
-- Dhiil Tech - SQL Insert Data for 6 Services & Admin Users
-- Works for Neon PostgreSQL SQL Editor
-- ============================================================

-- Ensure created_at has default value if table was already created
ALTER TABLE services ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

-- Insert 6 Professional Services (with explicit created_at timestamp)
INSERT INTO services (title, slug, description, icon, status, created_at) VALUES
('Web Development', 'web-development', 'Custom, scalable, and responsive web applications built with modern frameworks like React, Next.js, and Node.js for maximum performance.', 'fas fa-laptop-code', 'Active', CURRENT_TIMESTAMP),
('Mobile App Development', 'mobile-app-development', 'Native and cross-platform mobile apps for iOS and Android built with React Native and Flutter to deliver smooth user experiences.', 'fas fa-mobile-alt', 'Active', CURRENT_TIMESTAMP),
('UI/UX Design', 'ui-ux-design', 'User-centric interface design, wireframing, and interactive prototyping that turn complex ideas into beautiful, intuitive digital products.', 'fas fa-palette', 'Active', CURRENT_TIMESTAMP),
('Cloud & DevOps', 'cloud-devops', 'Secure cloud hosting, CI/CD pipeline automation, server configuration, and 24/7 infrastructure monitoring on AWS, Render, and Vercel.', 'fas fa-cloud', 'Active', CURRENT_TIMESTAMP),
('Digital Marketing & Branding', 'digital-marketing-branding', 'Data-driven SEO optimization, social media management, brand identity design, and digital advertising campaigns that drive growth.', 'fas fa-bullhorn', 'Active', CURRENT_TIMESTAMP),
('IT Consulting & Cybersecurity', 'it-consulting-cybersecurity', 'Strategic technology advisory, system audits, security compliance, data encryption, and vulnerability management for modern enterprises.', 'fas fa-shield-alt', 'Active', CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

-- Ensure users created_at & updated_at have defaults
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- Insert Users (Password for all accounts: admin123)
-- Role IDs: 1 = Super Admin, 2 = Admin, 3 = Editor, 4 = Employee/Support, 5 = Viewer
INSERT INTO users (name, email, password_hash, role_id, phone, status, created_at, updated_at) VALUES
('Dhiil Tech SuperAdmin', 'admin@dhiiltech.com', '$2a$10$e8w.x9T3.pU9N5L6j5G9d.V/o2Z1lW.E.R9d4eX1m5/O5GZ8U6k1s', 1, '+252 61 9586339', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('General Manager', 'manager@dhiiltech.com', '$2a$10$e8w.x9T3.pU9N5L6j5G9d.V/o2Z1lW.E.R9d4eX1m5/O5GZ8U6k1s', 2, '+252 61 9586338', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Content Editor', 'editor@dhiiltech.com', '$2a$10$e8w.x9T3.pU9N5L6j5G9d.V/o2Z1lW.E.R9d4eX1m5/O5GZ8U6k1s', 3, '+252 61 9586337', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Senior Developer', 'developer@dhiiltech.com', '$2a$10$e8w.x9T3.pU9N5L6j5G9d.V/o2Z1lW.E.R9d4eX1m5/O5GZ8U6k1s', 4, '+252 61 9586336', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Technical Support', 'support@dhiiltech.com', '$2a$10$e8w.x9T3.pU9N5L6j5G9d.V/o2Z1lW.E.R9d4eX1m5/O5GZ8U6k1s', 4, '+252 61 9586335', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('System Viewer', 'viewer@dhiiltech.com', '$2a$10$e8w.x9T3.pU9N5L6j5G9d.V/o2Z1lW.E.R9d4eX1m5/O5GZ8U6k1s', 5, '+252 61 9586334', 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;
