import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import teamRoutes from './routes/teamRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import columnRoutes from './routes/columnRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/teams', teamRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Handler for Unknown Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    }
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server
async function start() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Scrum Board Backend API corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

export default app;
