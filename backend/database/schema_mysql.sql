-- ============================================================
-- Dhiil Tech - MySQL / MariaDB Database Schema & Initial Data
-- Copy and paste this file into phpMyAdmin / MySQL Workbench
-- ============================================================

CREATE DATABASE IF NOT EXISTS `dhiiltech_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dhiiltech_db`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `token_blocklist`;
DROP TABLE IF EXISTS `visits`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `testimonials`;
DROP TABLE IF EXISTS `team`;
DROP TABLE IF EXISTS `newsletter_subscribers`;
DROP TABLE IF EXISTS `news`;
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Roles
CREATE TABLE `roles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255),
    `is_system` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Permissions
CREATE TABLE `permissions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `module` VARCHAR(60) NOT NULL,
    `description` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Role Permissions
CREATE TABLE `role_permissions` (
    `role_id` INT NOT NULL,
    `permission_id` INT NOT NULL,
    PRIMARY KEY (`role_id`, `permission_id`),
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Users
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_id` INT NOT NULL DEFAULT 2,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(255),
    `phone` VARCHAR(30),
    `status` VARCHAR(20) DEFAULT 'Active',
    `email_verified` INT DEFAULT 0,
    `two_fa_secret` VARCHAR(64),
    `two_fa_enabled` INT DEFAULT 0,
    `last_login_at` DATETIME,
    `last_login_ip` VARCHAR(45),
    `password_changed_at` DATETIME,
    `is_deleted` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Projects
CREATE TABLE `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(170) NOT NULL UNIQUE,
    `description` TEXT,
    `image` TEXT,
    `github_link` VARCHAR(255),
    `demo_link` VARCHAR(255),
    `technologies` VARCHAR(255),
    `client` VARCHAR(100),
    `category` VARCHAR(100),
    `status` VARCHAR(50) DEFAULT 'Development',
    `is_deleted` INT DEFAULT 0 NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Services
CREATE TABLE `services` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(170) NOT NULL UNIQUE,
    `description` TEXT NOT NULL,
    `icon` VARCHAR(100) DEFAULT 'fas fa-laptop-code',
    `status` VARCHAR(50) DEFAULT 'Active',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Contacts
CREATE TABLE `contacts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `subject` VARCHAR(150),
    `message` TEXT NOT NULL,
    `is_read` TINYINT(1) DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. News
CREATE TABLE `news` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `author_id` INT NULL,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL UNIQUE,
    `content` TEXT NOT NULL,
    `excerpt` VARCHAR(500),
    `image` TEXT,
    `category` VARCHAR(100),
    `tags` VARCHAR(500),
    `status` ENUM('Published', 'Draft', 'Archived') DEFAULT 'Draft' NOT NULL,
    `is_featured` INT DEFAULT 0 NOT NULL,
    `view_count` INT DEFAULT 0 NOT NULL,
    `is_deleted` INT DEFAULT 0 NOT NULL,
    `published_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Newsletter Subscribers
CREATE TABLE `newsletter_subscribers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `subscribed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Team
CREATE TABLE `team` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `position` VARCHAR(100) NOT NULL,
    `image` VARCHAR(255),
    `bio` TEXT,
    `linkedin` VARCHAR(255),
    `github` VARCHAR(255),
    `twitter` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Testimonials
CREATE TABLE `testimonials` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `client_name` VARCHAR(100) NOT NULL,
    `company` VARCHAR(100),
    `position` VARCHAR(100),
    `feedback` TEXT NOT NULL,
    `rating` INT DEFAULT 5 NOT NULL,
    `image` VARCHAR(255),
    `status` ENUM('Published', 'Draft', 'Hidden') DEFAULT 'Published' NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Settings
CREATE TABLE `settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `company_email` VARCHAR(120) DEFAULT 'info@dhiiltech.com' NOT NULL,
    `contact_phone` VARCHAR(30) DEFAULT '+252 61 9586339' NOT NULL,
    `office_location` VARCHAR(255) DEFAULT 'Mogadishu, Somalia' NOT NULL,
    `projects_done` INT DEFAULT 1 NOT NULL,
    `trusted_partners` INT DEFAULT 20 NOT NULL,
    `services_provided` INT DEFAULT 7 NOT NULL,
    `satisfaction_rate` INT DEFAULT 3 NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Visits
CREATE TABLE `visits` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ip_address` VARCHAR(45),
    `user_agent` VARCHAR(500),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Token Blocklist
CREATE TABLE `token_blocklist` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `jti` VARCHAR(36) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX `idx_jti` (`jti`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Seed Data
INSERT IGNORE INTO `roles` (`id`, `name`, `slug`, `description`, `is_system`) VALUES
(1, 'Super Admin', 'superadmin', 'Full system control', 1),
(2, 'Admin', 'admin', 'Administrative access', 1),
(3, 'Editor', 'editor', 'Content editor', 0),
(4, 'Employee', 'employee', 'Standard staff member', 0),
(5, 'Viewer', 'viewer', 'Read-only access', 0);

INSERT IGNORE INTO `permissions` (`name`, `slug`, `module`) VALUES
('Create Project', 'create_project', 'projects'),
('Edit Project', 'edit_project', 'projects'),
('Delete Project', 'delete_project', 'projects'),
('Create Service', 'create_service', 'services'),
('Edit Service', 'edit_service', 'services'),
('Delete Service', 'delete_service', 'services'),
('View Messages', 'view_messages', 'contact'),
('Edit Messages', 'edit_messages', 'contact'),
('Delete Messages', 'delete_messages', 'contact'),
('Create News', 'create_news', 'news'),
('Edit News', 'edit_news', 'news'),
('Delete News', 'delete_news', 'news'),
('View Subscribers', 'view_subscribers', 'newsletter'),
('Delete Subscribers', 'delete_subscribers', 'newsletter'),
('Create Team', 'create_team', 'team'),
('Edit Team', 'edit_team', 'team'),
('Delete Team', 'delete_team', 'team'),
('Create Testimonial', 'create_testimonial', 'testimonials'),
('Edit Testimonial', 'edit_testimonial', 'testimonials'),
('Delete Testimonial', 'delete_testimonial', 'testimonials'),
('View Users', 'view_users', 'users'),
('Create User', 'create_user', 'users'),
('Edit User', 'edit_user', 'users'),
('Delete User', 'delete_user', 'users'),
('View Dashboard', 'view_dashboard', 'stats'),
('View Analytics', 'view_analytics', 'stats'),
('Export Analytics', 'export_analytics', 'stats'),
('Edit Settings', 'edit_settings', 'settings');

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 2, `id` FROM `permissions`;

INSERT IGNORE INTO `users` (`name`, `email`, `password_hash`, `role_id`, `status`) VALUES
('Dhiil Tech Admin', 'admin@dhiiltech.com', '$2a$10$e8w.x9T3.pU9N5L6j5G9d.V/o2Z1lW.E.R9d4eX1m5/O5GZ8U6k1s', 1, 'Active');

INSERT IGNORE INTO `settings` (`company_email`, `contact_phone`, `office_location`, `projects_done`, `trusted_partners`, `services_provided`, `satisfaction_rate`) VALUES
('info@dhiiltech.com', '+252 61 9586339', 'Mogadishu, Somalia', 1, 20, 7, 3);
