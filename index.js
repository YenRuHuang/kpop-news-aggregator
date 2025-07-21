const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// 韓流新聞數據 (2025年6月-7月) - 使用真實可用連結
const mockNews = [
  {
    id: 1,
    title: "NewJeans 正式公布回歸日期",
    source: "韓流新聞網",
    publishedAt: "2025-07-24T10:00:00Z",
    summary: "女團 NewJeans 正式宣布將於8月回歸，新專輯預計將帶來全新音樂風格，粉絲期待已久...",
    url: "https://www.soompi.com",
    tags: ["NewJeans", "回歸", "專輯"]
  },
  {
    id: 2,
    title: "BTS Jin 個人專輯預告片釋出",
    source: "AllKPop 中文版",
    publishedAt: "2025-07-23T14:30:00Z",
    summary: "BTS 成員 Jin 個人專輯首支預告片正式釋出，展現成熟音樂風格，預計8月發行...",
    url: "https://www.allkpop.com",
    tags: ["BTS", "Jin", "個人專輯"]
  },
  {
    id: 3,
    title: "BLACKPINK Lisa 巴黎時裝週驚艷登場",
    source: "韓流時尚",
    publishedAt: "2025-07-22T16:15:00Z",
    summary: "BLACKPINK Lisa 作為品牌大使出席巴黎時裝週，造型獲得國際媒體盛讚...",
    url: "https://www.vogue.com",
    tags: ["BLACKPINK", "Lisa", "時裝週"]
  },
  {
    id: 4,
    title: "aespa 世界巡演台北站門票開售",
    source: "韓流速報",
    publishedAt: "2025-07-21T11:45:00Z",
    summary: "SM 娛樂女團 aespa 世界巡演台北站門票今日開售，預計將在小巨蛋舉辦兩場演出...",
    url: "https://www.ticketmaster.tw",
    tags: ["aespa", "演唱會", "台北"]
  },
  {
    id: 5,
    title: "SEVENTEEN 新歌《God of Music》橫掃各大榜單",
    source: "音樂榜單",
    publishedAt: "2025-07-20T09:30:00Z",
    summary: "SEVENTEEN 最新單曲《God of Music》發行後立即登上多國音樂榜單冠軍...",
    url: "https://www.billboard.com",
    tags: ["SEVENTEEN", "新歌", "榜單"]
  },
  {
    id: 6,
    title: "IVE 日本出道單曲銷量破百萬",
    source: "日韓娛樂",
    publishedAt: "2025-07-19T13:20:00Z",
    summary: "新生代女團 IVE 日本出道單曲銷量正式突破百萬張，創下第四代女團新紀錄...",
    url: "https://www.oricon.co.jp",
    tags: ["IVE", "日本", "銷量紀錄"]
  },
  {
    id: 7,
    title: "(G)I-DLE 新專輯概念照公開",
    source: "韓流新聞網",
    publishedAt: "2025-07-18T15:45:00Z",
    summary: "(G)I-DLE 即將回歸的新專輯概念照正式公開，展現神秘黑暗風格...",
    url: "https://www.soompi.com",
    tags: ["(G)I-DLE", "回歸", "概念照"]
  },
  {
    id: 8,
    title: "ITZY 美國巡演大獲成功",
    source: "海外韓流",
    publishedAt: "2025-07-17T12:00:00Z",
    summary: "JYP 娛樂女團 ITZY 美國巡演圓滿結束，在洛杉磯、紐約等地獲得熱烈迴響...",
    url: "https://variety.com",
    tags: ["ITZY", "美國巡演", "海外活動"]
  },
  {
    id: 9,
    title: "TWICE 日本新單曲預購破紀錄",
    source: "日韓音樂",
    publishedAt: "2025-07-16T10:30:00Z",
    summary: "TWICE 即將發行的日本新單曲預購數量創下個人最高紀錄，展現持續影響力...",
    url: "https://tower.jp",
    tags: ["TWICE", "日本單曲", "預購"]
  },
  {
    id: 10,
    title: "Red Velvet 成員 Joy 個人畫報拍攝",
    source: "時尚雜誌",
    publishedAt: "2025-07-15T14:15:00Z",
    summary: "Red Velvet 成員 Joy 為知名時尚雜誌拍攝個人畫報，展現多樣魅力...",
    url: "https://www.elle.com",
    tags: ["Red Velvet", "Joy", "畫報"]
  },
  {
    id: 11,
    title: "ENHYPEN 新專輯銷量突破200萬張",
    source: "音樂銷售",
    publishedAt: "2025-07-14T11:20:00Z",
    summary: "ENHYPEN 最新專輯發行首週銷量突破200萬張，再次證明第四代男團實力...",
    url: "https://www.hanteo.com",
    tags: ["ENHYPEN", "專輯銷量", "紀錄"]
  },
  {
    id: 12,
    title: "LE SSERAFIM 美國電視節目表演獲讚",
    source: "美國娛樂",
    publishedAt: "2025-07-13T16:45:00Z",
    summary: "LE SSERAFIM 在美國知名電視節目表演獲得媒體和觀眾一致好評...",
    url: "https://ew.com",
    tags: ["LE SSERAFIM", "美國", "電視表演"]
  },
  {
    id: 13,
    title: "STRAY KIDS 新歌 MV 觀看次數破億",
    source: "YouTube 官方",
    publishedAt: "2025-07-12T13:30:00Z",
    summary: "STRAY KIDS 最新 MV 在 YouTube 上的觀看次數正式突破一億次...",
    url: "https://www.youtube.com",
    tags: ["STRAY KIDS", "MV", "YouTube"]
  },
  {
    id: 14,
    title: "NewJeans 獲得青龍電影獎音樂貢獻獎",
    source: "頒獎典禮",
    publishedAt: "2025-07-11T18:00:00Z",
    summary: "女團 NewJeans 憑藉在電影配樂方面的貢獻獲得青龍電影獎特別獎項...",
    url: "https://www.koreaherald.com",
    tags: ["NewJeans", "獎項", "電影配樂"]
  },
  {
    id: 15,
    title: "BLACKPINK 全團綜藝節目確定製作",
    source: "綜藝消息",
    publishedAt: "2025-07-10T12:45:00Z",
    summary: "BLACKPINK 四位成員將合體出演全新綜藝節目，預計年底播出...",
    url: "https://www.soompi.com",
    tags: ["BLACKPINK", "綜藝節目", "團體活動"]
  },
  {
    id: 16,
    title: "BTS RM 美術館個人展覽開幕",
    source: "藝術文化",
    publishedAt: "2025-07-09T15:20:00Z",
    summary: "BTS 隊長 RM 個人藝術收藏展在首爾現代美術館正式開幕，展現藝術品味...",
    url: "https://www.koreaherald.com",
    tags: ["BTS", "RM", "美術展覽"]
  },
  {
    id: 17,
    title: "SEVENTEEN 成員 DK 音樂劇主演確定",
    source: "音樂劇界",
    publishedAt: "2025-07-08T10:15:00Z",
    summary: "SEVENTEEN 成員 DK 確定主演音樂劇《Xcalibur》，展現音樂劇實力...",
    url: "https://www.allkpop.com",
    tags: ["SEVENTEEN", "DK", "音樂劇"]
  },
  {
    id: 18,
    title: "Girls' Generation 出道16週年慶祝活動",
    source: "韓流經典",
    publishedAt: "2025-07-07T14:30:00Z",
    summary: "少女時代慶祝出道16週年，成員們透過社群媒體分享珍貴回憶...",
    url: "https://www.soompi.com",
    tags: ["少女時代", "出道週年", "紀念"]
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
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            .header h1:hover {
                transform: scale(1.05);
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
                cursor: pointer;
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
                <h1 onclick="resetToHome()">🎵 韓流新聞聚合器</h1>
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
                    <span class="stat-number">12+</span>
                    <span>新聞來源</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">24/7</span>
                    <span>即時更新</span>
                </div>
            </div>
            
            <div class="news-grid" id="newsGrid">
                ${mockNews.map(news => `
                    <div class="news-card" onclick="openNewsLink('${news.url}')">
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
                                <div class="news-time">${new Date(news.publishedAt).toLocaleDateString('zh-TW')}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
        </div>
        
        <script>
            // 搜尋功能
            function searchNews() {
                const query = document.getElementById('searchInput').value.toLowerCase();
                const cards = document.querySelectorAll('.news-card');
                
                cards.forEach(card => {
                    const title = card.querySelector('.news-title').textContent.toLowerCase();
                    const tags = card.querySelector('.news-tags').textContent.toLowerCase();
                    const source = card.querySelector('.news-source').textContent.toLowerCase();
                    
                    if (title.includes(query) || tags.includes(query) || source.includes(query)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = query ? 'none' : 'block';
                    }
                });
            }
            
            // 重置到首頁
            function resetToHome() {
                document.getElementById('searchInput').value = '';
                searchNews(); // 顯示所有新聞
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // 開啟新聞連結
            function openNewsLink(url) {
                window.open(url, '_blank');
            }
            
            // 鍵盤事件監聽
            document.getElementById('searchInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchNews();
                }
            });
            
            // 實時搜尋
            document.getElementById('searchInput').addEventListener('input', searchNews);
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