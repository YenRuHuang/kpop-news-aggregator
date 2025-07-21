const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// 新聞分類
const categories = [
  { id: 'all', name: '全部', icon: '🏠' },
  { id: 'comeback', name: '回歸', icon: '🎵' },
  { id: 'concert', name: '演唱會', icon: '🎤' },
  { id: 'award', name: '獎項', icon: '🏆' },
  { id: 'fashion', name: '時尚', icon: '👗' },
  { id: 'variety', name: '綜藝', icon: '📺' },
  { id: 'international', name: '海外', icon: '🌍' },
  { id: 'individual', name: '個人', icon: '⭐' }
];

// 擴充韓流新聞數據 (2025年6月-7月)
const mockNews = [
  // 精選頭條新聞
  {
    id: 1,
    title: "NewJeans 正式公布8月回歸計劃，新專輯概念首度公開",
    source: "Soompi",
    publishedAt: "2025-07-24T10:00:00Z",
    summary: "女團 NewJeans 正式宣布將於8月回歸，新專輯概念照片首度公開，展現全新成熟魅力，粉絲期待已久。此次回歸將帶來前所未有的音樂風格轉變。",
    url: "https://www.soompi.com/",
    tags: ["NewJeans", "回歸", "專輯"],
    category: "comeback",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
  },
  
  // 最新新聞
  {
    id: 2,
    title: "BTS Jin 個人專輯《The Astronaut》全球成功",
    source: "AllKPop",
    publishedAt: "2025-07-24T08:30:00Z",
    summary: "BTS 成員 Jin 個人專輯《The Astronaut》在全球多國音樂榜單獲得優異成績，展現其個人音樂實力。",
    url: "https://www.soompi.com/",
    tags: ["BTS", "Jin", "個人專輯"],
    category: "individual",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
  },
  {
    id: 3,
    title: "BLACKPINK Lisa 成為全球時尚品牌大使",
    source: "Vogue",
    publishedAt: "2025-07-23T16:15:00Z",
    summary: "BLACKPINK 成員 Lisa 正式成為國際知名時尚品牌全球大使，將參與多項時尚活動。",
    url: "https://www.vogue.com/",
    tags: ["BLACKPINK", "Lisa", "時裝"],
    category: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
  },
  {
    id: 4,
    title: "aespa 世界巡演確定來台演出",
    source: "拓元售票",
    publishedAt: "2025-07-23T14:45:00Z",
    summary: "SM 娛樂女團 aespa 正式確認將在台北舉辦演唱會，門票開售時間即將公布。",
    url: "https://www.ticketmaster.tw/",
    tags: ["aespa", "演唱會", "台北"],
    category: "concert",
    imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
  },
  {
    id: 5,
    title: "SEVENTEEN 新專輯銷量突破記錄",
    source: "Billboard",
    publishedAt: "2025-07-22T12:30:00Z",
    summary: "SEVENTEEN 最新專輯發行首週即獲得驚人銷量，再次證明其在全球市場的影響力。",
    url: "https://www.billboard.com/",
    tags: ["SEVENTEEN", "新歌", "榜單"],
    category: "comeback",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 6,
    title: "IVE 日本活動大獲成功",
    source: "Oricon",
    publishedAt: "2025-07-22T09:20:00Z",
    summary: "新生代女團 IVE 在日本舉辦的粉絲見面會獲得熱烈迴響，展現強大人氣。",
    url: "https://www.oricon.co.jp/",
    tags: ["IVE", "日本", "粉絲見面會"],
    category: "individual",
    imageUrl: "https://images.unsplash.com/photo-1574391884720-bfbf13d85e0d?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 7,
    title: "(G)I-DLE 新專輯概念照公開",
    source: "Soompi",
    publishedAt: "2025-07-21T18:45:00Z",
    summary: "(G)I-DLE 即將發行的新專輯概念照正式公開，展現成員們的多樣魅力。",
    url: "https://www.soompi.com/",
    tags: ["(G)I-DLE", "回歸", "概念照"],
    category: "comeback",
    imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
  },
  {
    id: 8,
    title: "ITZY 美國巡演大成功",
    source: "Variety",
    publishedAt: "2025-07-21T15:00:00Z",
    summary: "JYP 娛樂女團 ITZY 美國巡演圓滿結束，獲得當地媒體和粉絲高度評價。",
    url: "https://variety.com/",
    tags: ["ITZY", "巡演", "美國"],
    category: "concert",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 9,
    title: "TWICE 日本新單曲《DIVE》預購突破80萬創紀錄",
    source: "Tower Records",
    publishedAt: "2025-07-20T13:30:00Z",
    summary: "TWICE 即將發行的日本新單曲《DIVE》預購數量突破80萬張。",
    url: "https://tower.jp/article/news/twice-dive-single-preorder-record-800k",
    tags: ["TWICE", "日本單曲", "預購"],
    category: "individual",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&auto=format&q=80"
  },
  {
    id: 10,
    title: "Red Velvet Joy《Elle Korea》8月號封面女郎",
    source: "Elle Korea",
    publishedAt: "2025-07-20T10:15:00Z",
    summary: "Red Velvet 成員 Joy 登上《Elle Korea》8月號封面，展現多面魅力。",
    url: "https://www.elle.com/kr/culture/celebrity/red-velvet-joy-august-cover-2025",
    tags: ["Red Velvet", "Joy", "畫報"],
    category: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=250&fit=crop&auto=format&q=80"
  },
  {
    id: 11,
    title: "ENHYPEN 新專輯《ORANGE BLOOD》首週銷量破250萬",
    source: "Hanteo",
    publishedAt: "2025-07-19T14:20:00Z",
    summary: "ENHYPEN 最新專輯發行首週銷量突破250萬張，再次證明第四代男團實力。",
    url: "https://www.hanteo.com/chart/news/enhypen-orange-blood-album-sales-2.5million-first-week",
    tags: ["ENHYPEN", "專輯銷量", "紀錄"],
    category: "comeback",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop&auto=format&q=80"
  },
  {
    id: 12,
    title: "LE SSERAFIM《Tonight Show》表演獲美國媒體盛讚",
    source: "Entertainment Weekly",
    publishedAt: "2025-07-18T20:45:00Z",
    summary: "LE SSERAFIM 在美國《Tonight Show》的精彩表演獲得媒體好評。",
    url: "https://ew.com/music/le-sserafim-tonight-show-performance-praise-2025",
    tags: ["LE SSERAFIM", "美國", "電視表演"],
    category: "international",
    imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=250&fit=crop&auto=format&q=80"
  },
  {
    id: 13,
    title: "STRAY KIDS《S-CLASS》MV 觀看次數突破2億大關",
    source: "YouTube Music",
    publishedAt: "2025-07-17T16:30:00Z",
    summary: "STRAY KIDS 熱門歌曲《S-CLASS》MV 觀看次數正式突破2億次。",
    url: "https://www.youtube.com/watch?v=stray-kids-s-class-mv-200-million-views",
    tags: ["STRAY KIDS", "MV", "YouTube"],
    category: "individual",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop&auto=format&q=80"
  },
  {
    id: 14,
    title: "NewJeans 獲得2025青龍電影獎最佳OST大獎",
    source: "Korea Herald",
    publishedAt: "2025-07-16T19:00:00Z",
    summary: "女團 NewJeans 憑藉電影《青春紀實》OST 獲得青龍電影獎最佳原聲音樂獎。",
    url: "https://www.koreaherald.com/view.php?ud=20250716000428&newjeans-wins-best-ost-blue-dragon-awards",
    tags: ["NewJeans", "獎項", "電影配樂"],
    category: "award",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&auto=format&q=80"
  },
  {
    id: 15,
    title: "BLACKPINK 全團真人秀《BLACKPINK HOUSE 2》確定製作",
    source: "Netflix Korea",
    publishedAt: "2025-07-15T11:45:00Z",
    summary: "BLACKPINK 四位成員將再次聚首拍攝真人秀，預計年底在Netflix播出。",
    url: "https://www.soompi.com/article/1628405wpp/blackpink-house-2-reality-show-confirmed-netflix-2025",
    tags: ["BLACKPINK", "綜藝節目", "Netflix"],
    category: "variety",
    imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=250&fit=crop&auto=format&q=80"
  }
];

// 熱門新聞標籤
const trendingTags = ["NewJeans", "BTS", "BLACKPINK", "aespa", "SEVENTEEN", "TWICE"];

app.get('/', (req, res) => {
  const featuredNews = mockNews.filter(news => news.featured)[0];
  const latestNews = mockNews.filter(news => !news.featured);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>News Portal | 韓流新聞聚合器</title>
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
            
            .header-actions {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .search-icon,
            .menu-icon {
                width: 20px;
                height: 20px;
                cursor: pointer;
                transition: opacity 0.3s ease;
            }
            
            .search-icon:hover,
            .menu-icon:hover {
                opacity: 0.7;
            }
            
            /* Search Bar */
            .search-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 1rem 2rem;
                background: #f9fafb;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .search-box {
                position: relative;
                max-width: 500px;
                margin: 0 auto;
            }
            
            .search-input {
                width: 100%;
                padding: 12px 45px 12px 20px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
                outline: none;
                transition: border-color 0.3s ease;
            }
            
            .search-input:focus {
                border-color: #3b82f6;
            }
            
            .search-btn {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background: #3b82f6;
                border: none;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            
            .search-btn:hover {
                background: #2563eb;
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
            
            /* Hot Topics Section */
            .hot-topics {
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
            
            .featured-news {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            .featured-main {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                transition: transform 0.3s ease;
                cursor: pointer;
                border: 1px solid #f3f4f6;
            }
            
            .featured-main:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            }
            
            .featured-image {
                width: 100%;
                height: 300px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                background-size: cover;
                background-position: center;
                position: relative;
            }
            
            .featured-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
                display: flex;
                align-items: end;
                padding: 2rem;
            }
            
            .featured-badge {
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
            
            .featured-content {
                padding: 2rem;
            }
            
            .featured-meta {
                display: flex;
                gap: 1rem;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                color: #6b7280;
            }
            
            .featured-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 1rem;
                line-height: 1.4;
            }
            
            .featured-summary {
                color: #6b7280;
                line-height: 1.6;
                margin-bottom: 1rem;
            }
            
            .featured-tags {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .tag {
                background: #f3f4f6;
                color: #6b7280;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 500;
            }
            
            /* Featured Sidebar */
            .featured-sidebar {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .sidebar-card {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                transition: transform 0.3s ease;
                cursor: pointer;
                border: 1px solid #f3f4f6;
            }
            
            .sidebar-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            
            .sidebar-image {
                width: 100%;
                height: 120px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                background-size: cover;
                background-position: center;
            }
            
            .sidebar-content {
                padding: 1rem;
            }
            
            .sidebar-meta {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
                font-size: 0.8rem;
                color: #6b7280;
            }
            
            .sidebar-title {
                font-size: 0.95rem;
                font-weight: 600;
                color: #1f2937;
                line-height: 1.3;
            }
            
            /* Latest News */
            .latest-news {
                margin-top: 4rem;
            }
            
            .news-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
            }
            
            .news-card {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                transition: all 0.3s ease;
                cursor: pointer;
                border: 1px solid #f3f4f6;
            }
            
            .news-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            }
            
            .news-image {
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                background-size: cover;
                background-position: center;
                position: relative;
            }
            
            .news-category-badge {
                position: absolute;
                top: 1rem;
                left: 1rem;
                background: rgba(255,255,255,0.9);
                color: #1f2937;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
            }
            
            .news-content {
                padding: 1.5rem;
            }
            
            .news-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                font-size: 0.85rem;
                color: #6b7280;
            }
            
            .news-source {
                background: #dbeafe;
                color: #1d4ed8;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-weight: 500;
                font-size: 0.75rem;
            }
            
            .news-title {
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
            
            .news-summary {
                color: #6b7280;
                line-height: 1.5;
                margin-bottom: 1rem;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: 0.9rem;
            }
            
            .news-tags {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            /* Responsive */
            @media (max-width: 1024px) {
                .featured-news {
                    grid-template-columns: 1fr;
                }
                
                .news-grid {
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                }
            }
            
            @media (max-width: 768px) {
                .header-container {
                    padding: 0 1rem;
                }
                
                .main-container,
                .search-container,
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
                
                .news-grid {
                    grid-template-columns: 1fr;
                }
                
                .featured-sidebar {
                    display: none;
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
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    News Portal
                </div>
                
                <nav class="nav-links">
                    <a href="#" class="nav-link active">首頁</a>
                    <a href="#" class="nav-link">最新</a>
                    <a href="#" class="nav-link">熱門</a>
                    <a href="#" class="nav-link">分類</a>
                </nav>
                
                <div class="header-actions">
                    <svg class="search-icon" onclick="toggleSearch()" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387zM8 14A6 6 0 108 2a6 6 0 000 12z" clip-rule="evenodd"/>
                    </svg>
                    <svg class="menu-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                    </svg>
                </div>
            </div>
        </header>
        
        <!-- Search -->
        <div class="search-container" id="searchContainer" style="display: none;">
            <div class="search-box">
                <input type="text" class="search-input" placeholder="搜尋韓流新聞、藝人、團體..." id="searchInput">
                <button class="search-btn" onclick="searchNews()">搜尋</button>
            </div>
        </div>
        
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
            <!-- Hot Topics -->
            <section class="hot-topics">
                <h2 class="section-title">
                    🔥 Hot Topics
                </h2>
                
                <div class="featured-news">
                    ${featuredNews ? `
                    <article class="featured-main" onclick="openNewsLink('${featuredNews.url}')">
                        <div class="featured-image" style="background-image: url('${featuredNews.imageUrl}')">
                            <div class="featured-badge">${featuredNews.source}</div>
                            <div class="featured-overlay"></div>
                        </div>
                        <div class="featured-content">
                            <div class="featured-meta">
                                <span>${new Date(featuredNews.publishedAt).toLocaleDateString('zh-TW')}</span>
                                <span>精選新聞</span>
                            </div>
                            <h3 class="featured-title">${featuredNews.title}</h3>
                            <p class="featured-summary">${featuredNews.summary}</p>
                            <div class="featured-tags">
                                ${featuredNews.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </article>
                    ` : ''}
                    
                    <div class="featured-sidebar">
                        ${latestNews.slice(0, 3).map(news => `
                            <article class="sidebar-card" onclick="openNewsLink('${news.url}')">
                                <div class="sidebar-image" style="background-image: url('${news.imageUrl}')"></div>
                                <div class="sidebar-content">
                                    <div class="sidebar-meta">
                                        <span>${news.source}</span>
                                        <span>${new Date(news.publishedAt).toLocaleDateString('zh-TW')}</span>
                                    </div>
                                    <h4 class="sidebar-title">${news.title}</h4>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                </div>
            </section>
            
            <!-- Latest News -->
            <section class="latest-news">
                <h2 class="section-title">
                    📰 Latest News
                </h2>
                
                <div class="news-grid" id="newsGrid">
                    ${latestNews.slice(3).map(news => `
                        <article class="news-card" data-category="${news.category}" onclick="openNewsLink('${news.url}')">
                            <div class="news-image" style="background-image: url('${news.imageUrl}')">
                                <div class="news-category-badge">${categories.find(cat => cat.id === news.category)?.name || '新聞'}</div>
                            </div>
                            <div class="news-content">
                                <div class="news-meta">
                                    <span class="news-source">${news.source}</span>
                                    <span>${new Date(news.publishedAt).toLocaleDateString('zh-TW')}</span>
                                </div>
                                <h3 class="news-title">${news.title}</h3>
                                <p class="news-summary">${news.summary}</p>
                                <div class="news-tags">
                                    ${news.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        </main>
        
        <script>
            // 全局變數
            const mockNewsLength = ${mockNews.length};
            
            // 切換搜尋框
            function toggleSearch() {
                const searchContainer = document.getElementById('searchContainer');
                if (searchContainer) {
                    const isVisible = searchContainer.style.display !== 'none';
                    searchContainer.style.display = isVisible ? 'none' : 'block';
                    if (!isVisible) {
                        const searchInput = document.getElementById('searchInput');
                        if (searchInput) {
                            searchInput.focus();
                        }
                    }
                }
            }
            
            // 搜尋功能
            function searchNews() {
                const searchInput = document.getElementById('searchInput');
                if (!searchInput) return;
                
                const query = searchInput.value.toLowerCase();
                const cards = document.querySelectorAll('.news-card, .sidebar-card');
                
                cards.forEach(card => {
                    const title = card.querySelector('.news-title, .sidebar-title');
                    const tags = card.querySelector('.news-tags');
                    const source = card.querySelector('.news-source, .sidebar-meta');
                    
                    const titleText = title ? title.textContent.toLowerCase() : '';
                    const tagsText = tags ? tags.textContent.toLowerCase() : '';
                    const sourceText = source ? source.textContent.toLowerCase() : '';
                    
                    if (titleText.includes(query) || tagsText.includes(query) || sourceText.includes(query)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = query ? 'none' : 'block';
                    }
                });
                
                // 隱藏搜尋框
                toggleSearch();
            }
            
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
                
                // 篩選新聞
                const cards = document.querySelectorAll('.news-card');
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
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = '';
                }
                
                document.querySelectorAll('.category-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
                
                const firstCategory = document.querySelector('.category-tag');
                if (firstCategory) {
                    firstCategory.classList.add('active');
                }
                
                document.querySelectorAll('.news-card, .sidebar-card').forEach(card => {
                    card.style.display = 'block';
                });
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // 開啟新聞連結
            function openNewsLink(url) {
                if (url) {
                    window.open(url, '_blank');
                }
            }
            
            // 事件監聽器設置
            function setupEventListeners() {
                // 鍵盤事件
                document.addEventListener('keydown', function(e) {
                    if (e.key === '/' && e.target.tagName !== 'INPUT') {
                        e.preventDefault();
                        toggleSearch();
                    }
                    if (e.key === 'Escape') {
                        const searchContainer = document.getElementById('searchContainer');
                        if (searchContainer) {
                            searchContainer.style.display = 'none';
                        }
                    }
                });
                
                // 搜尋輸入框事件
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            searchNews();
                        }
                    });
                }
            }
            
            // 載入完成初始化
            document.addEventListener('DOMContentLoaded', function() {
                console.log('🎵 韓流新聞聚合器已載入');
                console.log('📰 共載入 ' + mockNewsLength + ' 則新聞');
                console.log('🔥 精選新聞: 1 則, 最新新聞: ' + (mockNewsLength - 1) + ' 則');
                
                // 設置事件監聽器
                setupEventListeners();
                
                // 測試按鈕功能
                console.log('✅ JavaScript 功能已初始化');
            });
        </script>
    </body>
    </html>
  `);
});

// API endpoints
app.get('/api/articles', (req, res) => {
  const { category, search } = req.query;
  let filteredNews = mockNews;
  
  if (category && category !== 'all') {
    filteredNews = filteredNews.filter(news => news.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredNews = filteredNews.filter(news => 
      news.title.toLowerCase().includes(searchLower) ||
      news.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      news.source.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({ 
    success: true, 
    data: filteredNews,
    total: filteredNews.length,
    categories: categories
  });
});

app.get('/api/trending', (req, res) => {
  res.json({ 
    success: true, 
    data: trendingTags.map(tag => ({
      tag,
      count: mockNews.filter(news => news.tags.includes(tag)).length
    }))
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: '正常', 
    timestamp: new Date().toISOString(),
    service: 'News Portal | 韓流新聞聚合器',
    version: '3.0.0',
    totalNews: mockNews.length,
    categories: categories.length,
    featured: mockNews.filter(n => n.featured).length
  });
});

app.listen(PORT, () => {
  console.log(`🎵 News Portal 運行在端口 ${PORT}`);
  console.log('✅ 現代新聞門戶介面就緒');
  console.log('✅ 完全重新設計的UI'); 
  console.log('✅ 完整數據已載入');
  console.log(`📰 總共 ${mockNews.length} 則新聞`);
  console.log(`🏷️ ${categories.length} 個分類`);
  console.log('🔥 精選新聞系統啟用');
});