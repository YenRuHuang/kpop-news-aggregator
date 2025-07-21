const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// K-pop 資訊分類
const categories = [
  { id: 'all', name: '全部資訊', icon: '🎵' },
  { id: 'groups', name: '團體資訊', icon: '👥' },
  { id: 'albums', name: '最新專輯', icon: '💿' },
  { id: 'achievements', name: '成就記錄', icon: '🏆' },
  { id: 'variety', name: '綜藝節目', icon: '📺' },
  { id: 'collaborations', name: '合作作品', icon: '🤝' }
];

// K-pop 真實資訊數據
const kpopData = [
  // 人氣團體資訊
  {
    id: 1,
    title: "NewJeans",
    subtitle: "女團 | ADOR (原 HYBE)",
    debut: "2022年7月",
    members: "Minji, Hanni, Danielle, Haerin, Hyein",
    latestWork: "最新單曲: 'How Sweet' (2024.05)",
    achievement: "Billboard Hot 100 首位韓國女團",
    description: "2022年出道的新生代女團，以Y2K風格和清新音樂風格受到全球關注。代表作品《Attention》、《Hype Boy》、《Super Shy》在各大音樂榜單獲得優異成績。",
    category: "groups",
    featured: true,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  
  {
    id: 2,
    title: "SEVENTEEN",
    subtitle: "男團 | PLEDIS Entertainment",
    debut: "2015年5月",
    members: "13人: 音樂組、表演組、Hip-hop組",
    latestWork: "最新專輯: 'SEVENTEENTH HEAVEN' (2023.10)",
    achievement: "Billboard 200 #2, 多國音樂榜冠軍",
    description: "2015年出道的男團，以自製偶像聞名。由13名成員組成，分為三個小組。代表作品《Very Nice》、《Don't Wanna Cry》、《Left & Right》在亞洲各地取得巨大成功。",
    category: "groups",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  
  {
    id: 3,
    title: "IVE - I'VE IVE",
    subtitle: "最新專輯 | 2023年10月發行",
    debut: "發行日期",
    members: "2023年10月13日",
    latestWork: "主打歌: 'Baddie', 'Off The Record'",
    achievement: "韓國 Hanteo Chart 週榜冠軍",
    description: "IVE的首張正規專輯，展現成員們多元的音樂風格。包含了強勁的主打歌'Baddie'和情歌'Off The Record'，充分展現了IVE的音樂才華和成熟的一面。",
    category: "albums",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  
  {
    id: 4,
    title: "BTS - Proof",
    subtitle: "精選集 | 2022年6月發行",
    debut: "發行日期",
    members: "2022年6月10日",
    latestWork: "主打歌: 'Yet To Come (The Most Beautiful Moment)'",
    achievement: "Billboard 200 #1, 全球销量突破300萬張",
    description: "BTS的第二張精選集，收錄了團體自2013年出道以來的代表作品和全新歌曲。包含了三CD的豐富內容，展現了BTS的音樂歷程和成長軌跡。",
    category: "albums",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  
  {
    id: 5,
    title: "aespa",
    subtitle: "女團 | SM Entertainment",
    debut: "2020年11月",
    members: "Karina, Giselle, Winter, Ningning",
    latestWork: "最新單曲: 'Supernova' (2024.05)",
    achievement: "Coachella 2022 首組參演K-pop女團",
    description: "SM娛樂推出的第四代女團，以'AI+偶像'概念和獨特的世界觀'展現全新的K-pop風格。代表作品《Black Mamba》、《Next Level》、《Savage》在全球獲得巨大迴響。",
    category: "groups",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
  },
  
  {
    id: 6,
    title: "(G)I-DLE - I Never Die",
    subtitle: "正規一輯 | 2022年3月發行",
    debut: "發行日期",
    members: "2022年3月14日",
    latestWork: "主打歌: 'TOMBOY', 'MY BAG'",
    achievement: "韓國 Circle Chart 週榜冠軍",
    description: "(G)I-DLE的第一張正規專輯，由隊長韶雨晶參與大部分歌曲的制作。主打歌'TOMBOY'展現了團體的自信和個性，成為2022年最受歡迎的K-pop歌曲之一。",
    category: "albums",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
  },
  
  {
    id: 7,
    title: "TWICE 'READY TO BE' 快閃咖啡廳",
    artist: "TWICE",
    date: "2025-08-01",
    time: "10:00",
    venue: "信義區快閃店",
    location: "台北市信義區",
    price: "免費入場",
    description: "TWICE 主題快閃咖啡廳，限定商品販售和拍照區域，為期兩週。",
    status: "進行中",
    category: "popup",
    gradient: "linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)"
  },
  
  {
    id: 8,
    title: "STRAY KIDS 'CIRCUS' 展覽",
    artist: "STRAY KIDS",
    date: "2025-08-15",
    time: "09:00",
    venue: "華山1914創意文化園區",
    location: "台北市中正區",
    price: "NT$350",
    description: "STRAY KIDS 互動式展覽，展示MV製作過程、服裝和周邊商品。",
    status: "預售中",
    category: "exhibition",
    gradient: "linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)"
  }
];

// 熱門K-pop標籤
const trendingTags = ["NewJeans", "SEVENTEEN", "IVE", "BTS", "aespa", "(G)I-DLE"];

// 熱門藝人標籤
const trendingArtists = ["NewJeans", "BLACKPINK", "SEVENTEEN", "aespa", "IVE", "TWICE"];

app.get('/', (req, res) => {
  const featuredInfo = kpopData.filter(info => info.featured)[0];
  const allInfo = kpopData.filter(info => !info.featured);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>K-pop Info | 韓流資訊展示</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', 'Noto Sans TC', sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #ffffff;
            }
            
            /* Header */
            .header {
                background: #ffffff;
                padding: 1rem 0;
                border-bottom: 1px solid #e5e7eb;
                position: sticky;
                top: 0;
                z-index: 1000;
            }
            
            .header-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .logo {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.5rem;
                font-weight: 700;
                color: #1f2937;
                cursor: pointer;
                transition: opacity 0.3s ease;
            }
            
            .logo:hover {
                opacity: 0.8;
            }
            
            .nav-links {
                display: flex;
                gap: 2rem;
                align-items: center;
            }
            
            .nav-link {
                color: #6b7280;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.3s ease;
            }
            
            .nav-link:hover,
            .nav-link.active {
                color: #1f2937;
            }
            
            /* Categories */
            .categories-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 1.5rem 2rem;
            }
            
            .categories {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .category-tag {
                padding: 0.5rem 1rem;
                background: #f3f4f6;
                border: 1px solid #e5e7eb;
                border-radius: 20px;
                color: #6b7280;
                text-decoration: none;
                font-size: 0.9rem;
                font-weight: 500;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .category-tag:hover,
            .category-tag.active {
                background: #3b82f6;
                color: white;
                border-color: #3b82f6;
            }
            
            /* Main Content */
            .main-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 2rem 4rem 2rem;
            }
            
            /* Featured Event */
            .featured-event {
                margin-bottom: 4rem;
            }
            
            .section-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .event-showcase {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                transition: transform 0.3s ease;
                cursor: pointer;
                border: 1px solid #f3f4f6;
            }
            
            .event-showcase:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            }
            
            .event-image {
                width: 100%;
                height: 300px;
                background-size: cover;
                background-position: center;
                position: relative;
            }
            
            .event-badge {
                position: absolute;
                top: 1rem;
                left: 1rem;
                background: rgba(255,255,255,0.9);
                color: #1f2937;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .event-content {
                padding: 2rem;
            }
            
            .event-meta {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                color: #6b7280;
            }
            
            .event-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 1rem;
                line-height: 1.4;
            }
            
            .event-description {
                color: #6b7280;
                line-height: 1.6;
                margin-bottom: 1rem;
            }
            
            .event-details {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .detail-item {
                background: #f9fafb;
                padding: 0.75rem;
                border-radius: 8px;
            }
            
            .detail-label {
                font-size: 0.8rem;
                color: #6b7280;
                margin-bottom: 0.25rem;
            }
            
            .detail-value {
                font-weight: 600;
                color: #1f2937;
            }
            
            /* Event Grid */
            .events-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 1.5rem;
            }
            
            .event-card {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                transition: all 0.3s ease;
                border: 1px solid #f3f4f6;
                position: relative;
            }
            
            .event-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            
            .card-header {
                height: 120px;
                background: #4facfe;
                background: var(--gradient);
                position: relative;
                border-radius: 12px 12px 0 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .card-header-content {
                text-align: center;
            }
            
            .card-date {
                font-size: 2rem;
                font-weight: 700;
                line-height: 1;
                margin-bottom: 0.25rem;
            }
            
            .card-month {
                font-size: 0.9rem;
                opacity: 0.9;
            }
            
            .card-badge {
                position: absolute;
                top: 1rem;
                left: 1rem;
                background: rgba(255,255,255,0.2);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
                backdrop-filter: blur(10px);
            }
            
            .status-badge {
                position: absolute;
                top: 1rem;
                right: 1rem;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
                background: rgba(255,255,255,0.2);
                color: white;
                backdrop-filter: blur(10px);
            }
            
            .card-content {
                padding: 1.5rem;
            }
            
            .card-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 0.75rem;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .card-artist {
                color: #3b82f6;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .card-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
                margin-bottom: 1rem;
                font-size: 0.85rem;
                color: #6b7280;
            }
            
            .card-price {
                background: #dbeafe;
                color: #1d4ed8;
                padding: 0.5rem;
                border-radius: 8px;
                text-align: center;
                font-weight: 600;
                margin-bottom: 1rem;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.75rem;
                margin-top: 1rem;
            }
            
            .info-item {
                background: #f8fafc;
                padding: 0.75rem;
                border-radius: 8px;
                text-align: center;
            }
            
            .info-label {
                font-size: 0.75rem;
                color: #6b7280;
                margin-bottom: 0.25rem;
            }
            
            .info-value {
                font-weight: 600;
                color: #1f2937;
                font-size: 0.9rem;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .header-container {
                    padding: 0 1rem;
                }
                
                .main-container,
                .categories-container {
                    padding-left: 1rem;
                    padding-right: 1rem;
                }
                
                .nav-links {
                    display: none;
                }
                
                .categories {
                    justify-content: flex-start;
                    overflow-x: auto;
                    padding-bottom: 0.5rem;
                }
                
                .events-grid {
                    grid-template-columns: 1fr;
                }
                
                .event-details {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <!-- Header -->
        <header class="header">
            <div class="header-container">
                <div class="logo" onclick="resetToHome()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4V8L15 9V22H9V16H15V10L14 9V4C14 2.9 13.1 2 12 2H12Z"/>
                    </svg>
                    K-pop Info
                </div>
                
            </div>
        </header>
        
        <!-- Categories -->
        <div class="categories-container">
            <div class="categories">
                ${categories.map(cat => `
                    <span class="category-tag ${cat.id === 'all' ? 'active' : ''}" onclick="filterByCategory('${cat.id}')">
                        ${cat.icon} ${cat.name}
                    </span>
                `).join('')}
            </div>
        </div>
        
        <!-- Main Content -->
        <main class="main-container">
            <!-- Featured Info -->
            <section class="featured-info">
                <h2 class="section-title">
                    🌟 精選資訊
                </h2>
                
                ${featuredInfo ? `
                <div class="info-showcase">
                    <div class="info-header" style="background: ${featuredInfo.gradient}">
                        <div class="info-badge">精選</div>
                    </div>
                    <div class="info-content">
                        <div class="info-meta">
                            <span>🎵 ${featuredInfo.subtitle}</span>
                            <span>📅 ${featuredInfo.debut}</span>
                        </div>
                        <h3 class="info-title">${featuredInfo.title}</h3>
                        <p class="info-description">${featuredInfo.description}</p>
                        <div class="info-details">
                            <div class="detail-item">
                                <div class="detail-label">成員</div>
                                <div class="detail-value">${featuredInfo.members}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">最新作品</div>
                                <div class="detail-value">${featuredInfo.latestWork}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">成就</div>
                                <div class="detail-value">${featuredInfo.achievement}</div>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}
            </section>
            
            <!-- K-pop Info -->
            <section class="kpop-info">
                <h2 class="section-title">
                    🎵 K-pop 資訊
                </h2>
                
                <div class="info-grid" id="infoGrid">
                    ${allInfo.map(info => {
                        return `
                        <div class="info-card" data-category="${info.category}" style="--gradient: ${info.gradient}">
                            <div class="card-header" style="background: ${info.gradient}">
                                <div class="card-badge">${categories.find(cat => cat.id === info.category)?.name || '資訊'}</div>
                                <div class="card-header-content">
                                    <div class="card-icon">🎵</div>
                                </div>
                            </div>
                            <div class="card-content">
                                <h3 class="card-title">${info.title}</h3>
                                <div class="card-subtitle">${info.subtitle}</div>
                                <div class="card-details">
                                    <div class="detail-row">
                                        <span class="detail-label">出道/發行:</span>
                                        <span class="detail-value">${info.debut}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">最新作品:</span>
                                        <span class="detail-value">${info.latestWork}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">成就:</span>
                                        <span class="detail-value">${info.achievement}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </section>
        </main>
        
        <script>
            // 分類篩選
            function filterByCategory(categoryId) {
                // 更新按鈕狀態
                document.querySelectorAll('.category-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
                
                // 找到被點擊的元素並激活
                const clickedElement = event ? event.target : document.querySelector('.category-tag[onclick*="' + categoryId + '"]');
                if (clickedElement) {
                    clickedElement.classList.add('active');
                }
                
                // 篩選活動
                const cards = document.querySelectorAll('.event-card');
                cards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (categoryId === 'all' || cardCategory === categoryId) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
            
            // 重置到首頁
            function resetToHome() {
                document.querySelectorAll('.category-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
                
                const firstCategory = document.querySelector('.category-tag');
                if (firstCategory) {
                    firstCategory.classList.add('active');
                }
                
                document.querySelectorAll('.event-card').forEach(card => {
                    card.style.display = 'block';
                });
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // 演出詳情顯示
            function showEventDetails(eventId) {
                // 未來可以展示更多詳情
                console.log('查看演出詳情:', eventId);
            }
            
            // 載入完成初始化
            document.addEventListener('DOMContentLoaded', function() {
                console.log('🎪 K-pop Events 已載入');
                console.log('🎤 共載入 ' + ${eventData.length} + ' 個活動');
            });
        </script>
    </body>
    </html>
  `);
});

// API endpoints
app.get('/api/info', (req, res) => {
  const { category, search } = req.query;
  let filteredInfo = kpopData;
  
  if (category && category !== 'all') {
    filteredInfo = filteredInfo.filter(info => info.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredInfo = filteredInfo.filter(info => 
      info.title.toLowerCase().includes(searchLower) ||
      info.subtitle.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({ 
    success: true, 
    data: filteredInfo,
    total: filteredInfo.length,
    categories: categories
  });
});

app.get('/api/trending', (req, res) => {
  res.json({ 
    success: true, 
    data: trendingTags.map(tag => ({
      tag,
      count: kpopData.filter(info => info.title.includes(tag)).length
    }))
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: '正常', 
    timestamp: new Date().toISOString(),
    service: 'K-pop Info | 韓流資訊展示',
    version: '5.0.0',
    totalInfo: kpopData.length,
    categories: categories.length,
    featured: kpopData.filter(i => i.featured).length
  });
});

app.listen(PORT, () => {
  console.log(`🎵 K-pop Info 運行在端口 ${PORT}`);
  console.log('✅ K-pop資訊展示平台就緒');
  console.log('✅ 真實K-pop資訊設計'); 
  console.log('✅ 完整資訊數據已載入');
  console.log(`🎤 總共 ${kpopData.length} 筆資訊`);
  console.log(`🏷️ ${categories.length} 個分類`);
  console.log('🌟 精選資訊系統啟用');
});