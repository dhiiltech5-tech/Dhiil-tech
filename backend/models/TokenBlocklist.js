import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const TokenBlocklist = sequelize.define('TokenBlocklist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  jti: {
    type: DataTypes.STRING(36),
    allowNull: false
  }
}, {
  tableName: 'token_blocklist',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default TokenBlocklist;
