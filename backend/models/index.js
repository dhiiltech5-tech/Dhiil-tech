import sequelize from '../config/db.js';
import User from './User.js';
import Role from './Role.js';
import Permission from './Permission.js';
import Project from './Project.js';
import Service from './Service.js';
import Contact from './Contact.js';
import News from './News.js';
import Newsletter from './Newsletter.js';
import Team from './Team.js';
import Testimonial from './Testimonial.js';
import Setting from './Setting.js';
import Visit from './Visit.js';
import TokenBlocklist from './TokenBlocklist.js';

// Setup Many-to-Many between Role and Permission
Role.belongsToMany(Permission, {
  through: 'role_permissions',
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions',
  timestamps: false
});

Permission.belongsToMany(Role, {
  through: 'role_permissions',
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles',
  timestamps: false
});

// Setup One-to-Many between Role and User
User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role_obj'
});

Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users'
});

// Helper method on User for dictionary representation matching Flask
User.prototype.toDict = function() {
  const roleObj = this.role_obj;
  const roleName = roleObj ? roleObj.name : 'Unknown';
  const roleSlug = roleObj ? roleObj.slug : '';
  const permissions = (roleObj && roleObj.permissions) ? roleObj.permissions.map(p => p.slug) : [];

  return {
    id: this.id,
    name: this.name,
    email: this.email,
    role: roleName,
    role_id: this.role_id,
    role_slug: roleSlug,
    permissions: permissions,
    avatar: this.avatar || null,
    phone: this.phone || null,
    status: this.status || 'Active',
    is_deleted: this.is_deleted || 0,
    created_at: this.created_at ? this.created_at.toISOString() : null
  };
};

User.prototype.hasPermission = function(permissionSlug) {
  const roleObj = this.role_obj;
  if (!roleObj) return false;
  if (roleObj.slug === 'superadmin') return true;
  if (!roleObj.permissions) return false;
  return roleObj.permissions.some(p => p.slug === permissionSlug);
};

User.prototype.isAdmin = function() {
  const roleObj = this.role_obj;
  if (!roleObj) return false;
  return ['superadmin', 'admin'].includes(roleObj.slug);
};

export {
  sequelize,
  User,
  Role,
  Permission,
  Project,
  Service,
  Contact,
  News,
  Newsletter,
  Team,
  Testimonial,
  Setting,
  Visit,
  TokenBlocklist
};
