#!/usr/bin/env node

// Simple production server for Zeabur
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Kpop News Aggregator'
  });
});

// Mock API for now - we can add database later
app.get('/api/articles', (req, res) => {
  res.json({
    articles: [
      {
        id: 1,
        title: "Welcome to Kpop News Aggregator!",
        description: "Your one-stop destination for all K-pop news and updates.",
        url: "https://example.com",
        publishedAt: new Date().toISOString(),
        sourceName: "Kpop News Aggregator",
        category: "general",
        tags: ["welcome", "kpop"]
      }
    ],
    totalPages: 1,
    currentPage: 1,
    total: 1
  });
});

app.get('/api/sources', (req, res) => {
  res.json([
    { name: 'Soompi', id: 1 },
    { name: 'AllKPop', id: 2 }
  ]);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Kpop News Aggregator running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});

module.exports = app;