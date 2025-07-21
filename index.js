const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// 演出活動分類
const categories = [
  { id: 'all', name: '全部活動', icon: '🎪' },
  { id: 'concert', name: '演唱會', icon: '🎤' },
  { id: 'fanmeeting', name: '粉絲見面會', icon: '👥' },
  { id: 'festival', name: '音樂節', icon: '🎡' },
  { id: 'showcase', name: '發片會', icon: '🎵' },
  { id: 'popup', name: '快閃活動', icon: '⚡' },
  { id: 'exhibition', name: '展覽', icon: '🖼️' },
  { id: 'workshop', name: '工作坊', icon: '🎓' }
];

// K-pop 演出活動資訊數據
const eventData = [
  // 精選演出活動
  {
    id: 1,
    title: "NewJeans 2025 世界巡演 'Get Up Tour' 台北站",
    artist: "NewJeans",
    date: "2025-09-15",
    time: "19:00",
    venue: "台北小巨蛋",
    location: "台北市松山區",
    price: "NT$2,800 - NT$8,800",
    description: "NewJeans 首次來台演出！將帶來全新舞台設計和經典曲目表演。包含《Get Up》、《Super Shy》等熱門歌曲。",
    status: "預售中",
    category: "concert",
    featured: true,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  
  {
    id: 2,
    title: "BLACKPINK Lisa 粉絲見面會 'LLOUD' 首爾站",
    artist: "BLACKPINK Lisa",
    date: "2025-08-22",
    time: "15:00",
    venue: "Olympic Hall",
    location: "首爾奧林匹克公園",
    price: "KRW 150,000 - KRW 350,000",
    description: "Lisa 個人活動後首次粉絲見面會，將分享新音樂作品和與粉絲互動遊戲。",
    status: "售票中",
    category: "fanmeeting",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  
  {
    id: 3,
    title: "SEVENTEEN 'Follow Again' Tour 高雄站",
    artist: "SEVENTEEN",
    date: "2025-10-08",
    time: "18:30",
    venue: "高雄巨蛋",
    location: "高雄市左營區",
    price: "NT$3,200 - NT$9,800",
    description: "SEVENTEEN 睽違三年再度來台！全新專輯歌曲首演，預計演出3小時精彩內容。",
    status: "即將開售",
    category: "concert",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  
  {
    id: 4,
    title: "aespa Showcase 'MY WORLD' 香港站",
    artist: "aespa",
    date: "2025-08-30",
    time: "20:00",
    venue: "AsiaWorld-Expo",
    location: "香港機場",
    price: "HK$880 - HK$2,880",
    description: "aespa 最新專輯發片會，將首度表演新歌《Armageddon》等曲目。",
    status: "預售中",
    category: "showcase",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  
  {
    id: 5,
    title: "IVE 粉絲見面會 'I'VE MINE' 新加坡站",
    artist: "IVE",
    date: "2025-09-05",
    time: "19:30",
    venue: "Suntec Convention Centre",
    location: "新加坡市中心",
    price: "S$180 - S$480",
    description: "IVE 東南亞首場粉絲見面會，包含遊戲環節和專屬表演舞台。",
    status: "售票中",
    category: "fanmeeting",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
  },
  
  {
    id: 6,
    title: "Summer K-Pop Festival 2025",
    artist: "Multiple Artists",
    date: "2025-07-28",
    time: "16:00",
    venue: "大佳河濱公園",
    location: "台北市中山區",
    price: "NT$1,800 - NT$5,500",
    description: "夏日韓流音樂節，邀請 ITZY、(G)I-DLE、NMIXX 等多組藝人共同演出。",
    status: "售票中",
    category: "festival",
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

// 熱門藝人標籤
const trendingArtists = ["NewJeans", "BLACKPINK", "SEVENTEEN", "aespa", "IVE", "TWICE"];

app.get('/', (req, res) => {
  const featuredEvent = eventData.filter(event => event.featured)[0];
  const upcomingEvents = eventData.filter(event => !event.featured);
  
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
                
                <nav class="nav-links">
                    <span class="nav-link active">首頁</span>
                    <span class="nav-link">演出活動</span>
                    <span class="nav-link">藝人排程</span>
                </nav>
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
                    🌟 精選活動
                </h2>
                
                ${featuredEvent ? `
                <div class="event-showcase">
                    <div class="event-image" style="background: ${featuredEvent.gradient}">
                        <div class="event-badge">${featuredEvent.artist}</div>
                    </div>
                    <div class="event-content">
                        <div class="event-meta">
                            <span>📅 ${featuredEvent.date}</span>
                            <span>📍 ${featuredEvent.venue}</span>
                        </div>
                        <h3 class="event-title">${featuredEvent.title}</h3>
                        <p class="event-description">${featuredEvent.description}</p>
                        <div class="event-details">
                            <div class="detail-item">
                                <div class="detail-label">演出時間</div>
                                <div class="detail-value">${featuredEvent.time}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">地點</div>
                                <div class="detail-value">${featuredEvent.location}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">票價</div>
                                <div class="detail-value">${featuredEvent.price}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">狀態</div>
                                <div class="detail-value">${featuredEvent.status}</div>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}
            </section>
            
            <!-- Upcoming Events -->
            <section class="upcoming-events">
                <h2 class="section-title">
                    🎪 即將到來
                </h2>
                
                <div class="events-grid" id="eventsGrid">
                    ${upcomingEvents.map(event => {
                        const eventDate = new Date(event.date);
                        const day = eventDate.getDate();
                        const month = eventDate.toLocaleDateString('zh-TW', {month: 'short'});
                        
                        return `
                        <div class="event-card" data-category="${event.category}" style="--gradient: ${event.gradient}">
                            <div class="card-header" style="background: ${event.gradient}">
                                <div class="card-badge">${categories.find(cat => cat.id === event.category)?.name || '活動'}</div>
                                <div class="status-badge">${event.status}</div>
                                <div class="card-header-content">
                                    <div class="card-date">${day}</div>
                                    <div class="card-month">${month}</div>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="card-artist">${event.artist}</div>
                                <h3 class="card-title">${event.title}</h3>
                                <div class="card-details">
                                    <span>⏰ ${event.time}</span>
                                    <span>📍 ${event.venue}</span>
                                    <span>🌏 ${event.location}</span>
                                </div>
                                <div class="card-price">${event.price}</div>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">演出日期</div>
                                        <div class="info-value">${event.date}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">演出時間</div>
                                        <div class="info-value">${event.time}</div>
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
app.get('/api/events', (req, res) => {
  const { category, artist } = req.query;
  let filteredEvents = eventData;
  
  if (category && category !== 'all') {
    filteredEvents = filteredEvents.filter(event => event.category === category);
  }
  
  if (artist) {
    const searchLower = artist.toLowerCase();
    filteredEvents = filteredEvents.filter(event => 
      event.artist.toLowerCase().includes(searchLower) ||
      event.title.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({ 
    success: true, 
    data: filteredEvents,
    total: filteredEvents.length,
    categories: categories
  });
});

app.get('/api/artists', (req, res) => {
  res.json({ 
    success: true, 
    data: trendingArtists.map(artist => ({
      artist,
      eventCount: eventData.filter(event => event.artist.includes(artist)).length
    }))
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: '正常', 
    timestamp: new Date().toISOString(),
    service: 'K-pop Events | 韓流演出活動資訊',
    version: '4.0.0',
    totalEvents: eventData.length,
    categories: categories.length,
    featured: eventData.filter(e => e.featured).length
  });
});

app.listen(PORT, () => {
  console.log(`🎪 K-pop Events 運行在端口 ${PORT}`);
  console.log('✅ 演出活動資訊平台就緒');
  console.log('✅ 全新活動導向設計'); 
  console.log('✅ 完整活動數據已載入');
  console.log(`🎤 總共 ${eventData.length} 個活動`);
  console.log(`🏷️ ${categories.length} 個分類`);
  console.log('🌟 精選活動系統啟用');
});