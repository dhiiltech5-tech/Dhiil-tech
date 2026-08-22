import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  linkedin: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  github: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  twitter: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'team',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Team.prototype.toDict = function() {
  return {
    id: this.id,
    name: this.name,
    role: this.position,
    image: this.image,
    bio: this.bio,
    linkedin: this.linkedin,
    github: this.github,
    twitter: this.twitter,
    created_at: this.created_at ? this.created_at.toISOString() : null
  };
};

export default Team;
