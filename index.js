const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// 模擬韓流新聞數據
const mockNews = [
  {
    id: 1,
    title: "NewJeans 正式公布回歸日期",
    source: "韓流新聞網",
    publishedAt: "2025-07-21T10:00:00Z",
    summary: "女團 NewJeans 正式宣布回歸日期，粉絲期待已久的新專輯即將發行...",
    url: "https://soompi.com",
    tags: ["NewJeans", "回歸"]
  },
  {
    id: 2,
    title: "BTS 再創新榜單紀錄",
    source: "AllKPop 中文版",
    publishedAt: "2025-07-21T09:30:00Z",
    summary: "BTS 持續在國際榜單上取得亮眼成績，再次證明韓流音樂的全球影響力...",
    url: "https://allkpop.com",
    tags: ["BTS", "榜單"]
  },
  {
    id: 3,
    title: "BLACKPINK Lisa 個人活動大獲成功",
    source: "韓流新聞網",
    publishedAt: "2025-07-21T08:15:00Z",
    summary: "Lisa 最新個人項目取得巨大成功，展現了 BLACKPINK 成員的個人魅力...",
    url: "https://soompi.com",
    tags: ["BLACKPINK", "Lisa", "個人活動"]
  },
  {
    id: 4,
    title: "aespa 新歌 MV 突破千萬觀看",
    source: "韓流速報",
    publishedAt: "2025-07-21T07:45:00Z",
    summary: "SM 娛樂旗下女團 aespa 新歌 MV 在 24 小時內突破千萬觀看次數...",
    url: "https://example.com",
    tags: ["aespa", "MV", "紀錄"]
  },
  {
    id: 5,
    title: "SEVENTEEN 演唱會門票秒殺",
    source: "娛樂週刊",
    publishedAt: "2025-07-21T06:30:00Z",
    summary: "SEVENTEEN 亞洲巡迴演唱會門票開售即秒殺，再次展現超高人氣...",
    url: "https://example.com",
    tags: ["SEVENTEEN", "演唱會", "門票"]
  },
  {
    id: 6,
    title: "IVE 獲得音樂節目三冠王",
    source: "韓流新聞網",
    publishedAt: "2025-07-21T05:15:00Z",
    summary: "新生代女團 IVE 憑藉最新單曲在音樂節目中獲得三冠王殊榮...",
    url: "https://example.com",
    tags: ["IVE", "音樂節目", "冠軍"]
  }
];

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎵 韓流新聞聚合器</title>
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
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎵 韓流新聞聚合器</h1>
                <p>您的韓流資訊一站式平台，掌握最新韓流動態</p>
            </div>
            
            <div class="search-bar">
                <input type="text" placeholder="搜尋藝人、團體或新聞..." id="searchInput">
                <button onclick="searchNews()">🔍 搜尋</button>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-number">${mockNews.length}</span>
                    <span>最新文章</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">15+</span>
                    <span>新聞來源</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">24/7</span>
                    <span>即時更新</span>
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
    status: '正常', 
    timestamp: new Date().toISOString(),
    service: '韓流新聞聚合器',
    version: '2.0.0'
  });
});

app.post('/api/aggregate', (req, res) => {
  res.json({ 
    message: '新聞聚合完成（展示模式）',
    articlesProcessed: mockNews.length,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 韓流新聞聚合器運行在端口 ${PORT}`);
  console.log('✅ 前端介面就緒');
  console.log('✅ API 端點可用'); 
  console.log('✅ 模擬數據已載入');
});