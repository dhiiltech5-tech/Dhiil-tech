import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Testimonial = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  client_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Published', 'Draft', 'Hidden'),
    defaultValue: 'Published',
    allowNull: false
  }
}, {
  tableName: 'testimonials',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Testimonial.prototype.toDict = function() {
  return {
    id: this.id,
    name: this.client_name,
    role: this.company || this.position || '',
    review: this.feedback,
    img: this.image,
    rating: this.rating,
    status: this.status,
    created_at: this.created_at ? this.created_at.toISOString() : null
  };
};

export default Testimonial;
