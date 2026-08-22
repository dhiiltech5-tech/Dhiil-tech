import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(170),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'fas fa-laptop-code'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'Active'
  }
}, {
  tableName: 'services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Service.prototype.toDict = function() {
  return {
    id: this.id,
    name: this.title,
    slug: this.slug,
    desc: this.description,
    icon: this.icon,
    status: this.status,
    created_at: this.created_at ? this.created_at.toISOString() : null
  };
};

export default Service;
