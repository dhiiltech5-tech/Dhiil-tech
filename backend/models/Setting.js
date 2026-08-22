import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_email: {
    type: DataTypes.STRING(120),
    allowNull: false,
    defaultValue: 'info@dhiiltech.com'
  },
  contact_phone: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: '+252 61 9586339'
  },
  office_location: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Mogadishu, Somalia'
  },
  projects_done: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  trusted_partners: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 20
  },
  services_provided: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 7
  },
  satisfaction_rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3
  }
}, {
  tableName: 'settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Setting.prototype.toDict = function() {
  return {
    id: this.id,
    company_email: this.company_email,
    contact_phone: this.contact_phone,
    office_location: this.office_location,
    projects_done: this.projects_done,
    trusted_partners: this.trusted_partners,
    services_provided: this.services_provided,
    satisfaction_rate: this.satisfaction_rate,
    created_at: this.created_at ? this.created_at.toISOString() : null,
    updated_at: this.updated_at ? this.updated_at.toISOString() : null
  };
};

export default Setting;
