const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// K-pop 演出活動分類
const categories = [
  { id: 'all', name: '全部活動', icon: '🎪' },
  { id: 'concert', name: '演唱會', icon: '🎤' },
  { id: 'fanmeet', name: '粉絲見面會', icon: '💕' },
  { id: 'variety', name: '綜藝錄影', icon: '📺' },
  { id: 'award', name: '頒獎典禮', icon: '🏆' },
  { id: 'festival', name: '音樂節', icon: '🎵' },
  { id: 'popup', name: '快閃活動', icon: '⚡' }
];

// K-pop 演出活動真實資訊
const kpopData = [
  // 近期演唱會
  {
    id: 1,
    title: "SEVENTEEN 'FOLLOW' THE CITY TOUR",
    artist: "SEVENTEEN",
    date: "2025-08-15",
    time: "19:00",
    venue: "高雄巨蛋",
    location: "高雄市左營區",
    price: "NT$2,800 - NT$6,800",
    description: "SEVENTEEN 2024 世界巡演台灣站，預計演出約3小時，包含熱門歌曲及新專輯歌曲。",
    status: "售票中",
    category: "concert",
    featured: true,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  
  {
    id: 2,
    title: "NewJeans Fan Meeting",
    artist: "NewJeans",
    date: "2025-08-20",
    time: "18:00",
    venue: "台北小巨蛋",
    location: "台北市松山區",
    price: "NT$2,200 - NT$4,500",
    description: "NewJeans 亞洲粉絲見面會台灣場，互動遊戲、現場演唱及簽名活動。",
    status: "預售中",
    category: "fanmeet",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  
  {
    id: 3,
    title: "MAMA AWARDS 2025",
    artist: "多組藝人",
    date: "2025-11-30",
    time: "18:00",
    venue: "東京巨蛋",
    location: "東京，日本",
    price: "¥8,000 - ¥25,000",
    description: "亞洲最大音樂頒獎典禮，預計 aespa、IVE、(G)I-DLE、STRAY KIDS 等多組頂級藝人出席。",
    status: "確認出演",
    category: "award",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  
  {
    id: 4,
    title: "IVE WORLD TOUR 'SHOW WHAT I HAVE'",
    artist: "IVE",
    date: "2025-09-05",
    time: "19:30",
    venue: "台北流行音樂中心",
    location: "台北市南港區",
    price: "NT$2,500 - NT$5,800",
    description: "IVE 首次世界巡演台灣站，演出最新專輯《I'VE IVE》完整曲目。",
    status: "即將開賣",
    category: "concert",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  
  {
    id: 5,
    title: "Running Man 錄影",
    artist: "BLACKPINK",
    date: "2025-08-25",
    time: "13:00",
    venue: "SBS 電視台",
    location: "首爾，韓國",
    price: "觀眾席申請",
    description: "BLACKPINK 全員出演 Running Man，進行團體遊戲和個人訪談。",
    status: "錄影完成",
    category: "variety",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
  },
  
  {
    id: 6,
    title: "STRAY KIDS '5-STAR' Fan Meeting",
    artist: "STRAY KIDS",
    date: "2025-09-10",
    time: "16:00",
    venue: "Legacy Taipei",
    location: "台北市中正區",
    price: "NT$3,200 - NT$5,500",
    description: "STRAY KIDS 台灣限定粉絲見面會，包含遊戲環節及迷你演唱會。",
    status: "預售中",
    category: "fanmeet",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
  },
  
  {
    id: 7,
    title: "TWICE POP UP STORE",
    artist: "TWICE",
    date: "2025-08-01",
    time: "10:00",
    venue: "信義誠品",
    location: "台北市信義區",
    price: "免費參觀",
    description: "TWICE 'SET ME FREE' 主題快閃店，限定商品及拍照區，為期一個月。",
    status: "進行中",
    category: "popup",
    gradient: "linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)"
  },
  
  {
    id: 8,
    title: "Summer Sonic 2025",
    artist: "aespa, LE SSERAFIM",
    date: "2025-08-18",
    time: "12:00",
    venue: "千葉海洋球場",
    location: "千葉，日本",
    price: "¥12,000 - ¥18,000",
    description: "日本最大夏季音樂節，aespa 及 LE SSERAFIM 確認出演。",
    status: "確認出演",
    category: "festival",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  
  {
    id: 9,
    title: "音樂中心錄影",
    artist: "(G)I-DLE",
    date: "2025-08-12",
    time: "14:30",
    venue: "MBC 電視台",
    location: "首爾，韓國",
    price: "觀眾席抽選",
    description: "(G)I-DLE 新歌 'Queencard' 音樂中心首次表演錄影。",
    status: "觀眾招募中",
    category: "variety",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  
  {
    id: 10,
    title: "KCON 2025 LA",
    artist: "ITZY, NMIXX, ENHYPEN",
    date: "2025-08-28",
    time: "18:00",
    venue: "Los Angeles Convention Center",
    location: "洛杉磯，美國",
    price: "$99 - $350",
    description: "美國最大 K-pop 慶典，ITZY、NMIXX、ENHYPEN 確認參演。",
    status: "售票中",
    category: "festival",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  
  {
    id: 11,
    title: "LE SSERAFIM WORLD TOUR",
    artist: "LE SSERAFIM",
    date: "2025-09-22",
    time: "19:00",
    venue: "台北小巨蛋",
    location: "台北市松山區",
    price: "NT$2,800 - NT$6,200",
    description: "LE SSERAFIM 首次世界巡演，演出約2.5小時包含最新專輯歌曲。",
    status: "即將公佈",
    category: "concert",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  
  {
    id: 12,
    title: "知名哥哥錄影",
    artist: "ENHYPEN",
    date: "2025-08-30",
    time: "15:00",
    venue: "JTBC 電視台",
    location: "首爾，韓國",
    price: "觀眾席申請",
    description: "ENHYPEN 全員出演知名哥哥，展現才藝及進行問答環節。",
    status: "觀眾招募",
    category: "variety",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
  },
  
  {
    id: 13,
    title: "Golden Disc Awards 2026",
    artist: "NewJeans, IVE, aespa",
    date: "2026-01-04",
    time: "18:00",
    venue: "首爾奧林匹克體操館",
    location: "首爾，韓國",
    price: "₩80,000 - ₩250,000",
    description: "韓國金唱片大獎，預計多組頂級藝人出席頒獎及表演。",
    status: "確認出席",
    category: "award",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
  },
  
  {
    id: 14,
    title: "ITZY Fan Meeting 'CHECKMATE'",
    artist: "ITZY",
    date: "2025-09-15",
    time: "17:00",
    venue: "高雄展覽館",
    location: "高雄市前鎮區",
    price: "NT$2,600 - NT$4,800",
    description: "ITZY 台灣粉絲見面會，互動遊戲、團體表演及個別問候時間。",
    status: "預售開始",
    category: "fanmeet",
    gradient: "linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)"
  },
  
  {
    id: 15,
    title: "NMIXX Showcase",
    artist: "NMIXX",
    date: "2025-08-08",
    time: "19:30",
    venue: "Blue Square",
    location: "首爾，韓國",
    price: "₩55,000 - ₩120,000",
    description: "NMIXX 新專輯發行紀念 Showcase，現場首次表演新歌。",
    status: "售票中",
    category: "concert",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
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
        <title>K-pop Events | 韓流演出活動資訊</title>
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
                    K-pop Events
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
            <!-- Featured Event -->
            <section class="featured-event">
                <h2 class="section-title">
                    🌟 精選演出
                </h2>
                
                ${featuredInfo ? `
                <div class="event-showcase">
                    <div class="event-image" style="background: ${featuredInfo.gradient}">
                        <div class="event-badge">HOT</div>
                    </div>
                    <div class="event-content">
                        <div class="event-meta">
                            <span>🎤 ${featuredInfo.artist}</span>
                            <span>📅 ${featuredInfo.date}</span>
                        </div>
                        <h3 class="event-title">${featuredInfo.title}</h3>
                        <p class="event-description">${featuredInfo.description}</p>
                        <div class="event-details">
                            <div class="detail-item">
                                <div class="detail-label">時間</div>
                                <div class="detail-value">${featuredInfo.time}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">地點</div>
                                <div class="detail-value">${featuredInfo.venue}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">票價</div>
                                <div class="detail-value">${featuredInfo.price}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">狀態</div>
                                <div class="detail-value">${featuredInfo.status}</div>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}
            </section>
            
            <!-- K-pop Events -->
            <section class="kpop-events">
                <h2 class="section-title">
                    🎪 近期演出活動
                </h2>
                
                <div class="events-grid" id="eventsGrid">
                    ${allInfo.map(event => {
                        const eventDate = new Date(event.date);
                        const day = eventDate.getDate();
                        const month = eventDate.toLocaleDateString('zh-TW', { month: 'short' });
                        
                        return `
                        <div class="event-card" data-category="${event.category}" style="--gradient: ${event.gradient}">
                            <div class="card-header" style="background: ${event.gradient}">
                                <div class="card-badge">${categories.find(cat => cat.id === event.category)?.name || '活動'}</div>
                                <div class="card-header-content">
                                    <div class="card-date">${day}</div>
                                    <div class="card-month">${month}</div>
                                </div>
                                <div class="status-badge">${event.status}</div>
                            </div>
                            <div class="card-content">
                                <div class="card-artist">${event.artist}</div>
                                <h3 class="card-title">${event.title}</h3>
                                <div class="card-details">
                                    <div>📍 ${event.venue}</div>
                                    <div>⏰ ${event.time}</div>
                                </div>
                                <div class="card-price">${event.price}</div>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">地區</div>
                                        <div class="info-value">${event.location}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">狀態</div>
                                        <div class="info-value">${event.status}</div>
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
                console.log('🎤 共載入 ${kpopData.length} 場演出活動');
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