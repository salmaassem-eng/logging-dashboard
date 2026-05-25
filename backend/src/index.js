import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/user.js';
import appRouter from './routes/application.js';
import errorHandler from './middleware/error.js';

// Load environmental variables
dotenv.config();

// Connect to local MongoDB instance
connectDB();

const app = express();

// Configure CORS to support credential cookies from the React dev port
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Standard Middlewares
app.use(express.json());
app.use(cookieParser());

// Mount API routes
app.use('/api/users', userRouter);
app.use('/api/applications', appRouter);

// Home test route
app.get('/', (req, res) => {
  res.send('📡 LogVault API Server is running. Ingestion endpoints active.');
});

// Catch-all 404 Route handler
// Catch‑all 404 Route handler (using app.use to avoid path‑to‑regexp issues)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}. Route not found.`,
  });
});

// Register Global Error Handler (must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g., failed DB connection without catch blocks)
process.on('unhandledRejection', (err, promise) => {
  console.log(`🚨 Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
