const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('./config/database');
const RSSAggregator = require('./services/rssAggregator');

// 路由
const articlesRouter = require('./routes/articles');
const sourcesRouter = require('./routes/sources');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 靜態文件服務
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// API 路由
app.use('/api/articles', articlesRouter);
app.use('/api/sources', sourcesRouter);

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Kpop News Aggregator API'
  });
});

// RSS 聚合控制
app.post('/api/aggregate', async (req, res) => {
  try {
    const aggregator = new RSSAggregator();
    const count = await aggregator.aggregateNews();
    res.json({ 
      message: 'News aggregation completed',
      articlesProcessed: count 
    });
  } catch (error) {
    console.error('Manual aggregation error:', error);
    res.status(500).json({ error: 'Aggregation failed' });
  }
});

// 前端路由處理 (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// 全域錯誤處理
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 初始化應用
async function initializeApp() {
  try {
    // 初始化資料庫
    console.log('Initializing database...');
    const db = new Database();
    await db.initialize();

    // 初始化 RSS 聚合器
    console.log('Initializing RSS aggregator...');
    const aggregator = new RSSAggregator();
    await aggregator.initializeDefaultSources();
    
    // 開始定期聚合 (每 30 分鐘)
    aggregator.startPeriodicAggregation(30);

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// 啟動伺服器
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`🚀 Kpop News Aggregator API running on port ${PORT}`);
    await initializeApp();
  });
}

module.exports = app;