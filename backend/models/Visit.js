import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Visit = sequelize.define('Visit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'visits',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Visit.prototype.toDict = function() {
  return {
    id: this.id,
    ip_address: this.ip_address,
    user_agent: this.user_agent,
    created_at: this.created_at ? this.created_at.toISOString() : null
  };
};

export default Visit;
