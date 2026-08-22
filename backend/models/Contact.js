import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'contacts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Contact.prototype.toDict = function() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    subject: this.subject,
    message: this.message,
    is_read: Boolean(this.is_read),
    created_at: this.created_at ? this.created_at.toISOString() : null
  };
};

export default Contact;
