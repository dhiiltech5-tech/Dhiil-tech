import sequelize from '../config/db.js';
import { User, Role, Permission, Setting } from '../models/index.js';
import { hashPassword } from '../utils/security.js';

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected for seeding.');

    await sequelize.sync();

    // 1. Roles
    const rolesData = [
      { id: 1, name: 'Super Admin', slug: 'superadmin', description: 'Full system control', is_system: 1 },
      { id: 2, name: 'Admin', slug: 'admin', description: 'Administrative access', is_system: 1 },
      { id: 3, name: 'Editor', slug: 'editor', description: 'Content editor', is_system: 0 },
      { id: 4, name: 'Employee', slug: 'employee', description: 'Standard staff member', is_system: 0 },
      { id: 5, name: 'Viewer', slug: 'viewer', description: 'Read-only access', is_system: 0 }
    ];

    for (const r of rolesData) {
      await Role.upsert(r);
    }
    console.log('Roles seeded.');

    // 2. Permissions
    const permissionsData = [
      { name: 'Create Project', slug: 'create_project', module: 'projects' },
      { name: 'Edit Project', slug: 'edit_project', module: 'projects' },
      { name: 'Delete Project', slug: 'delete_project', module: 'projects' },

      { name: 'Create Service', slug: 'create_service', module: 'services' },
      { name: 'Edit Service', slug: 'edit_service', module: 'services' },
      { name: 'Delete Service', slug: 'delete_service', module: 'services' },

      { name: 'View Messages', slug: 'view_messages', module: 'contact' },
      { name: 'Edit Messages', slug: 'edit_messages', module: 'contact' },
      { name: 'Delete Messages', slug: 'delete_messages', module: 'contact' },

      { name: 'Create News', slug: 'create_news', module: 'news' },
      { name: 'Edit News', slug: 'edit_news', module: 'news' },
      { name: 'Delete News', slug: 'delete_news', module: 'news' },

      { name: 'View Subscribers', slug: 'view_subscribers', module: 'newsletter' },
      { name: 'Delete Subscribers', slug: 'delete_subscribers', module: 'newsletter' },

      { name: 'Create Team', slug: 'create_team', module: 'team' },
      { name: 'Edit Team', slug: 'edit_team', module: 'team' },
      { name: 'Delete Team', slug: 'delete_team', module: 'team' },

      { name: 'Create Testimonial', slug: 'create_testimonial', module: 'testimonials' },
      { name: 'Edit Testimonial', slug: 'edit_testimonial', module: 'testimonials' },
      { name: 'Delete Testimonial', slug: 'delete_testimonial', module: 'testimonials' },

      { name: 'View Users', slug: 'view_users', module: 'users' },
      { name: 'Create User', slug: 'create_user', module: 'users' },
      { name: 'Edit User', slug: 'edit_user', module: 'users' },
      { name: 'Delete User', slug: 'delete_user', module: 'users' },

      { name: 'View Dashboard', slug: 'view_dashboard', module: 'stats' },
      { name: 'View Analytics', slug: 'view_analytics', module: 'stats' },
      { name: 'Export Analytics', slug: 'export_analytics', module: 'stats' },

      { name: 'Edit Settings', slug: 'edit_settings', module: 'settings' }
    ];

    for (const p of permissionsData) {
      await Permission.upsert(p);
    }
    console.log('Permissions seeded.');

    // Associate permissions with Admin role
    const adminRole = await Role.findByPk(2);
    const allPermissions = await Permission.findAll();
    if (adminRole) {
      await adminRole.setPermissions(allPermissions);
    }

    // 3. Super Admin User
    const adminEmail = 'admin@onetap.com';
    let adminUser = await User.findOne({ where: { email: adminEmail } });

    if (!adminUser) {
      console.log(`Creating Super Admin user: ${adminEmail} / admin123`);
      const hashedPassword = await hashPassword('admin123');

      adminUser = await User.create({
        name: 'Dhiil Tech Admin',
        email: adminEmail,
        password_hash: hashedPassword,
        role_id: 1,
        status: 'Active'
      });
      console.log('Super Admin user created successfully!');
    } else {
      console.log(`Super Admin user already exists: ${adminEmail}`);
    }

    // 4. Initial Settings
    const existingSettings = await Setting.findOne();
    if (!existingSettings) {
      await Setting.create({
        company_email: 'info@dhiiltech.com',
        contact_phone: '+252 61 9586339',
        office_location: 'Mogadishu, Somalia',
        projects_done: 1,
        trusted_partners: 20,
        services_provided: 7,
        satisfaction_rate: 3
      });
      console.log('Initial settings created.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
