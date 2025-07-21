const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// Mock RSS data for demo
const mockNews = [
  {
    id: 1,
    title: "NewJeans Announces Comeback Date",
    source: "Soompi",
    publishedAt: "2025-07-21T10:00:00Z",
    summary: "Girl group NewJeans has officially announced their comeback date...",
    url: "https://soompi.com",
    tags: ["NewJeans", "Comeback"]
  },
  {
    id: 2,
    title: "BTS Breaks New Chart Record",
    source: "AllKPop",
    publishedAt: "2025-07-21T09:30:00Z",
    summary: "BTS continues to dominate international charts...",
    url: "https://allkpop.com",
    tags: ["BTS", "Chart"]
  },
  {
    id: 3,
    title: "BLACKPINK Lisa's Solo Success",
    source: "Soompi",
    publishedAt: "2025-07-21T08:15:00Z",
    summary: "Lisa's latest solo project achieves massive success...",
    url: "https://soompi.com",
    tags: ["BLACKPINK", "Lisa", "Solo"]
  }
];

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎵 Kpop News Aggregator</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Arial', sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: #333;
            }
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                padding: 20px;
            }
            .header {
                text-align: center;
                color: white;
                margin-bottom: 40px;
            }
            .header h1 {
                font-size: 3rem;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .search-bar {
                background: white;
                border-radius: 25px;
                padding: 15px 20px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                margin-bottom: 30px;
                display: flex;
                align-items: center;
            }
            .search-bar input {
                border: none;
                outline: none;
                flex: 1;
                font-size: 16px;
                padding: 5px 15px;
            }
            .search-bar button {
                background: #667eea;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
            }
            .news-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 25px;
            }
            .news-card {
                background: white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .news-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            }
            .news-header {
                background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
                color: white;
                padding: 20px;
            }
            .news-source {
                font-size: 0.9rem;
                opacity: 0.9;
                margin-bottom: 5px;
            }
            .news-title {
                font-size: 1.3rem;
                font-weight: bold;
                line-height: 1.4;
            }
            .news-content {
                padding: 20px;
            }
            .news-summary {
                color: #666;
                line-height: 1.6;
                margin-bottom: 15px;
            }
            .news-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.9rem;
                color: #999;
            }
            .news-tags {
                display: flex;
                gap: 8px;
            }
            .tag {
                background: #f0f0f0;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
                color: #667eea;
            }
            .stats {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin: 40px 0;
                color: white;
            }
            .stat-item {
                text-align: center;
            }
            .stat-number {
                font-size: 2rem;
                font-weight: bold;
                display: block;
            }
            .api-demo {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 20px;
                margin-top: 40px;
                color: white;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎵 Kpop News Aggregator</h1>
                <p>Your one-stop destination for all K-pop news and updates</p>
            </div>
            
            <div class="search-bar">
                <input type="text" placeholder="Search for artists, groups, or news..." id="searchInput">
                <button onclick="searchNews()">🔍 Search</button>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-number">${mockNews.length}</span>
                    <span>Latest Articles</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">15+</span>
                    <span>News Sources</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">24/7</span>
                    <span>Live Updates</span>
                </div>
            </div>
            
            <div class="news-grid" id="newsGrid">
                ${mockNews.map(news => `
                    <div class="news-card">
                        <div class="news-header">
                            <div class="news-source">${news.source}</div>
                            <div class="news-title">${news.title}</div>
                        </div>
                        <div class="news-content">
                            <div class="news-summary">${news.summary}</div>
                            <div class="news-meta">
                                <div class="news-tags">
                                    ${news.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                                <div class="news-time">${new Date(news.publishedAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="api-demo">
                <h3>🚀 API Endpoints Available:</h3>
                <p><strong>GET /api/articles</strong> - Get all news articles</p>
                <p><strong>GET /api/health</strong> - Health check</p>
                <p><strong>POST /api/aggregate</strong> - Trigger news aggregation</p>
            </div>
        </div>
        
        <script>
            function searchNews() {
                const query = document.getElementById('searchInput').value.toLowerCase();
                const cards = document.querySelectorAll('.news-card');
                
                cards.forEach(card => {
                    const title = card.querySelector('.news-title').textContent.toLowerCase();
                    const tags = card.querySelector('.news-tags').textContent.toLowerCase();
                    
                    if (title.includes(query) || tags.includes(query)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = query ? 'none' : 'block';
                    }
                });
            }
            
            document.getElementById('searchInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchNews();
                }
            });
        </script>
    </body>
    </html>
  `);
});

// API endpoints
app.get('/api/articles', (req, res) => {
  res.json({ 
    success: true, 
    data: mockNews,
    total: mockNews.length 
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Kpop News Aggregator',
    version: '2.0.0'
  });
});

app.post('/api/aggregate', (req, res) => {
  res.json({ 
    message: 'News aggregation completed (demo mode)',
    articlesProcessed: mockNews.length,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Kpop News Aggregator running on port ${PORT}`);
  console.log('✅ Frontend UI ready');
  console.log('✅ API endpoints available'); 
  console.log('✅ Mock data loaded');
});