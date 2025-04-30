import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());



// Define route type


// Register routes


// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Beast11 Fantasy Sports API',
    status: 'Server is running',
    version: '1.0.0',
    documentation: 'API documentation coming soon'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Beast11 Backend Server is running on http://localhost:${port}`);
});
