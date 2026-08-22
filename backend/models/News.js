import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(220),
    allowNull: false,
    unique: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  excerpt: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tags: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Published', 'Draft', 'Archived'),
    defaultValue: 'Draft',
    allowNull: false
  },
  is_featured: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'news',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

News.prototype.toDict = function() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = this.created_at
    ? `${months[this.created_at.getMonth()]} ${String(this.created_at.getDate()).padStart(2, '0')}, ${this.created_at.getFullYear()}`
    : '';

  return {
    id: this.id,
    author_id: this.author_id,
    title: this.title,
    slug: this.slug,
    content: this.content,
    excerpt: this.excerpt,
    image: this.image,
    category: this.category,
    tags: this.tags,
    status: this.status,
    is_featured: this.is_featured,
    view_count: this.view_count,
    is_deleted: this.is_deleted,
    published_at: this.published_at ? this.published_at.toISOString() : null,
    created_at: this.created_at ? this.created_at.toISOString() : null,
    updated_at: this.updated_at ? this.updated_at.toISOString() : null,
    date: formattedDate
  };
};

export default News;
