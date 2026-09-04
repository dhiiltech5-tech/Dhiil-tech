import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Project = sequelize.define('Project', {
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
    allowNull: true
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  github_link: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  demo_link: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  technologies: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  client: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'Development'
  },
  is_deleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: 'projects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Project.prototype.toDict = function() {
  let extra = {};
  if (this.description) {
    try {
      extra = JSON.parse(this.description);
    } catch (e) {
      extra = { description: this.description };
    }
  }

  return {
    id: this.id,
    name: this.title,
    client: this.client || '',
    status: this.status || 'Development',
    category: this.category || 'Web Development',
    image: this.image || '',
    deadline: extra.deadline || '',
    url: this.demo_link || '',
    progress: extra.progress || 0,
    icon: extra.icon || 'fas fa-code',
    description: extra.description || ''
  };
};

export default Project;
