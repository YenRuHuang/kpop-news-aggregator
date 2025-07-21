const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class KpopEventCrawler {
  constructor() {
    this.events = [];
    this.sources = [
      {
        name: 'Soompi Tour List',
        url: 'https://www.soompi.com/article/1727876wpp/2025-k-pop-tour-masterlist-concerts-fan-meetings-and-more',
        selector: 'p, h2, h3',
        extract: this.extractTourInfo.bind(this)
      }
    ];
  }

  // 設定請求標頭避免被封鎖
  getHeaders() {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
    };
  }

  // 抓取 Soompi 巡演列表的資訊
  async extractTourInfo($, element) {
    const text = $(element).text().trim();
    
    // 尋找包含藝人名稱和日期的段落
    const tourPatterns = [
      /([A-Z][A-Za-z\s&()'-]+)\s*[-–]\s*(.+?)(?:\s*\(([^)]+)\))?/,
      /([A-Z][A-Z\s]+)\s+"([^"]+)"\s*Tour/i,
      /(NCT|BTS|SEVENTEEN|STRAY KIDS|BLACKPINK|TWICE|NewJeans|IVE|aespa|ITZY|ENHYPEN|BABYMONSTER|TAEMIN|j-hope|G-DRAGON)[^:]*:\s*(.+)/i
    ];

    for (const pattern of tourPatterns) {
      const match = text.match(pattern);
      if (match) {
        return await this.parseTourInfo(text, match);
      }
    }

    return null;
  }

  // 解析巡演資訊
  async parseTourInfo(text, match) {
    const artist = match[1]?.trim();
    const tourInfo = match[2]?.trim();
    
    if (!artist || artist.length < 2) return null;

    // 提取日期資訊
    const dateMatch = text.match(/(\w+\s+\d{1,2}(?:[-–]\d{1,2})?,?\s+\d{4})/);
    const venueMatch = text.match(/(?:at|@)\s+([^,\n]+)/i);
    const cityMatch = text.match(/(?:in|,)\s+([A-Za-z\s]+(?:,\s*[A-Za-z]+)?)/);

    return {
      artist,
      title: tourInfo || `${artist} Concert`,
      date: dateMatch ? dateMatch[1] : null,
      venue: venueMatch ? venueMatch[1].trim() : null,
      location: cityMatch ? cityMatch[1].trim() : null,
      source: 'Soompi Tour List',
      originalText: text
    };
  }

  // 舊的 Soompi 提取函數（保留作為參考）
  async extractSoompiEvent($, element) {
    const title = $(element).find('.post-title a').text().trim();
    const link = $(element).find('.post-title a').attr('href');
    const date = $(element).find('.post-date').text().trim();
    const excerpt = $(element).find('.post-excerpt').text().trim();

    // 檢查是否為演出相關新聞
    const eventKeywords = ['concert', 'tour', 'fan meeting', 'comeback', 'festival', 'award'];
    const isEvent = eventKeywords.some(keyword => 
      title.toLowerCase().includes(keyword) || excerpt.toLowerCase().includes(keyword)
    );

    if (isEvent && title && link) {
      // 進一步抓取詳細資訊
      try {
        const eventDetails = await this.getEventDetails(link);
        return {
          title,
          link,
          date,
          excerpt,
          source: 'Soompi',
          ...eventDetails
        };
      } catch (error) {
        console.log('Error getting event details:', error.message);
        return {
          title,
          link,
          date,
          excerpt,
          source: 'Soompi'
        };
      }
    }
    return null;
  }

  // 獲取詳細演出資訊
  async getEventDetails(url) {
    try {
      const response = await axios.get(url, { headers: this.getHeaders() });
      const $ = cheerio.load(response.data);
      
      const content = $('.post-content').text();
      
      // 用正則表達式提取關鍵資訊
      const dateMatch = content.match(/(?:on|at|date)[\s:]*(\w+\s+\d{1,2},?\s+\d{4})/i);
      const venueMatch = content.match(/(?:venue|at|location)[\s:]*([^.\n]+)/i);
      const priceMatch = content.match(/(?:ticket|price)[\s:]*([^.\n]+)/i);
      const artistMatch = content.match(/([A-Z][A-Za-z\s]+)(?:\s+will|\s+is|\s+has)/);

      return {
        eventDate: dateMatch ? dateMatch[1] : null,
        venue: venueMatch ? venueMatch[1].trim() : null,
        ticketInfo: priceMatch ? priceMatch[1].trim() : null,
        artist: artistMatch ? artistMatch[1].trim() : null
      };
    } catch (error) {
      console.log('Error fetching event details:', error.message);
      return {};
    }
  }

  // 主要爬蟲函數
  async crawlEvents() {
    console.log('🕷️ 開始爬取 K-pop 演出資訊...');
    
    for (const source of this.sources) {
      try {
        console.log(`📰 正在爬取 ${source.name}...`);
        
        const response = await axios.get(source.url, { 
          headers: this.getHeaders(),
          timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        const elements = $(source.selector);
        
        console.log(`找到 ${elements.length} 個項目`);
        
        for (let i = 0; i < Math.min(elements.length, 10); i++) {
          const element = elements[i];
          const event = await source.extract($, element);
          
          if (event) {
            this.events.push(event);
            console.log(`✅ 找到演出: ${event.title}`);
          }
          
          // 添加延遲避免被封鎖
          await this.delay(1000);
        }
        
      } catch (error) {
        console.error(`❌ 爬取 ${source.name} 時發生錯誤:`, error.message);
      }
    }

    return this.events;
  }

  // 延遲函數
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 儲存結果
  saveEvents() {
    const filename = `events_${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(this.events, null, 2));
    console.log(`💾 演出資訊已儲存到 ${filename}`);
    return filename;
  }

  // 轉換為我們網站的格式
  formatForWebsite() {
    return this.events.map((event, index) => ({
      id: index + 100,
      title: event.title,
      artist: event.artist || this.extractArtistFromTitle(event.title),
      date: event.eventDate || new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: "19:00", // 預設時間
      venue: event.venue || "待公佈",
      location: this.extractLocation(event.venue),
      price: event.ticketInfo || "待公佈",
      description: event.excerpt.substring(0, 100) + "...",
      status: "確認舉辦",
      category: this.categorizeEvent(event.title),
      gradient: this.getRandomGradient(),
      source: event.source,
      originalLink: event.link
    }));
  }

  // 從標題提取藝人名稱
  extractArtistFromTitle(title) {
    const artists = ['BTS', 'BLACKPINK', 'TWICE', 'SEVENTEEN', 'aespa', 'NewJeans', 'IVE', 'STRAY KIDS'];
    const found = artists.find(artist => title.includes(artist));
    return found || title.split(' ')[0];
  }

  // 提取地點資訊
  extractLocation(venue) {
    if (!venue) return "待公佈";
    if (venue.includes('Seoul') || venue.includes('Korea')) return "首爾，韓國";
    if (venue.includes('Tokyo') || venue.includes('Japan')) return "東京，日本";
    if (venue.includes('Taipei') || venue.includes('Taiwan')) return "台北，台灣";
    return venue;
  }

  // 分類演出類型
  categorizeEvent(title) {
    if (title.toLowerCase().includes('concert') || title.toLowerCase().includes('tour')) return 'concert';
    if (title.toLowerCase().includes('fan meet')) return 'fanmeet';
    if (title.toLowerCase().includes('award')) return 'award';
    if (title.toLowerCase().includes('festival')) return 'festival';
    if (title.toLowerCase().includes('variety') || title.toLowerCase().includes('show')) return 'variety';
    return 'concert';
  }

  // 隨機漸層色彩
  getRandomGradient() {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }
}

// 使用範例
async function main() {
  const crawler = new KpopEventCrawler();
  
  try {
    const events = await crawler.crawlEvents();
    console.log(`🎉 總共找到 ${events.length} 個演出活動`);
    
    if (events.length > 0) {
      crawler.saveEvents();
      
      // 格式化為網站資料
      const websiteData = crawler.formatForWebsite();
      fs.writeFileSync('kpop_events_formatted.json', JSON.stringify(websiteData, null, 2));
      console.log('🌐 網站格式資料已儲存到 kpop_events_formatted.json');
      
      // 顯示前幾個結果
      console.log('\n📋 爬取結果預覽:');
      events.slice(0, 3).forEach(event => {
        console.log(`- ${event.title}`);
        console.log(`  來源: ${event.source}`);
        console.log(`  日期: ${event.date}`);
        console.log(`  摘要: ${event.excerpt.substring(0, 50)}...`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('爬蟲執行失敗:', error.message);
  }
}

// 如果直接執行此檔案
if (require.main === module) {
  main();
}

module.exports = KpopEventCrawler;