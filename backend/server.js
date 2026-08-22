import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import sequelize from './config/db.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

// Import Route modules
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import userRoutes from './routes/userRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const frontendUrl = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: frontendUrl === '*' ? '*' : [frontendUrl, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ extended: true, limit: '16mb' }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend is running flawlessly.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Database Sync and Server Startup
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync models without dropping existing data
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
