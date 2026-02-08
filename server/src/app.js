const express = require('express');
const cors = require('cors');
const path = require('path');
const { seedDatabase } = require('./services/seed.service');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from Vite build
app.use(express.static(path.join(__dirname, '../../client/dist')));

/**
 * API Routes
 */
app.use('/api/shops', require('./routes/shop.routes'));

/**
 * Utility Endpoints
 */

// Seed database with mock data for MVP
app.get('/seed', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json(result);
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: error.message });
  }
});

// System health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Error Handling
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

/**
 * Frontend Routing
 * Direct all non-API requests to the React index.html
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 BazaarScan MVP running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
  });
}

module.exports = app;
