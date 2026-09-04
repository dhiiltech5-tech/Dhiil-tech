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

// Mount API routes with and without /api prefix for complete reverse-proxy resilience
const apiEndpoints = [
  ['/auth', authRoutes],
  ['/projects', projectRoutes],
  ['/services', serviceRoutes],
  ['/contact', contactRoutes],
  ['/news', newsRoutes],
  ['/newsletter', newsletterRoutes],
  ['/team', teamRoutes],
  ['/testimonials', testimonialRoutes],
  ['/users', userRoutes],
  ['/stats', statsRoutes],
  ['/settings', settingRoutes]
];

// Health check endpoints
app.get(['/api/health', '/health', '/api', '/'], (req, res) => {
  res.status(200).json({ success: true, message: 'Backend is running flawlessly.' });
});

apiEndpoints.forEach(([endpoint, router]) => {
  app.use(`/api${endpoint}`, router);
  app.use(endpoint, router);
});

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Database Sync and Server Startup
async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync models without dropping existing data
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized.');
  } catch (error) {
    console.error('Database connection error (continuing to run, will retry):', error.message || error);
  }

  return server;
}

startServer();

export default app;
