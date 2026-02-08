const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { seedDatabase } = require('./services/seed.service');

const app = express();

// CORS: allow frontend origin in production when set (e.g. Vercel URL)
const frontendOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL;
const corsOptions = frontendOrigin
  ? { origin: frontendOrigin.split(',').map((o) => o.trim()), credentials: true }
  : {};
app.use(cors(corsOptions));
app.use(express.json());

// Serve static frontend only when deployed together (e.g. Docker); skip when backend-only (e.g. Railway)
const clientDist = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

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
 * Frontend Routing (only when client dist is present, e.g. monolith deploy)
 */
if (fs.existsSync(clientDist)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 BazaarScan MVP running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
  });
}

module.exports = app;
