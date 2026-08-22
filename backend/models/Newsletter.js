import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Newsletter = sequelize.define('Newsletter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'newsletter_subscribers',
  timestamps: true,
  createdAt: 'subscribed_at',
  updatedAt: false
});

Newsletter.prototype.toDict = function() {
  return {
    id: this.id,
    email: this.email,
    subscribed_at: this.subscribed_at ? this.subscribed_at.toISOString() : null
  };
};

export default Newsletter;
