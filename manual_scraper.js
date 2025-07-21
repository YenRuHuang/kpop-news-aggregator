const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class ManualKpopScraper {
  constructor() {
    this.events = [];
    
    // 手動驗證的真實網站
    this.sources = [
      {
        name: 'Soompi Tours',
        url: 'https://www.soompi.com/article/1727876wpp/2025-k-pop-tour-masterlist-concerts-fan-meetings-and-more',
        method: 'fetchSoompiTours'
      }
    ];
  }

  // 通用 HTTP 請求設定
  getHeaders() {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };
  }

  // 抓取 Soompi 2025 巡演資訊
  async fetchSoompiTours() {
    console.log('📰 正在抓取 Soompi 2025 K-pop 巡演資訊...');
    
    try {
      const response = await axios.get(this.sources[0].url, {
        headers: this.getHeaders(),
        timeout: 30000
      });
      
      const $ = cheerio.load(response.data);
      const events = [];
      
      // 尋找包含演出資訊的段落
      $('p, li, h3, h4').each((index, element) => {
        const text = $(element).text().trim();
        
        // 尋找包含藝人名稱和日期的模式
        const patterns = [
          // NCT 127 – January 25 at Philippine Sports Stadium
          /([A-Z][A-Za-z\s&()-]+)\s*[–-]\s*([A-Za-z]+\s+\d{1,2})\s+at\s+([^,\n]+)/i,
          
          // SEVENTEEN: January 25-26, Philippine Sports Stadium
          /([A-Z][A-Za-z\s&()-]+):\s*([A-Za-z]+\s+\d{1,2}[-–]\d{1,2}),?\s*([^,\n]+)/i,
          
          // j-hope "HOPE ON THE STAGE" – March 15, 2025 at Madison Square Garden
          /([A-Z][A-Za-z\s&()-]+)\s+"[^"]+"\s*[–-]\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4})\s+at\s+([^,\n]+)/i,
        ];
        
        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match && this.isKpopArtist(match[1])) {
            const [, artist, dateStr, venue] = match;
            
            events.push({
              artist: artist.trim(),
              title: `${artist.trim()} Concert`,
              dateStr: dateStr.trim(),
              venue: venue.trim(),
              originalText: text,
              source: 'Soompi Tour List'
            });
            
            console.log(`✅ 找到: ${artist.trim()} - ${dateStr.trim()}`);
          }
        }
      });
      
      // 處理文章中的巡演時間表
      $('.entry-content table tr, .wp-block-table tr').each((index, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 3) {
          const artist = $(cells[0]).text().trim();
          const date = $(cells[1]).text().trim();
          const venue = $(cells[2]).text().trim();
          
          if (this.isKpopArtist(artist) && date && venue) {
            events.push({
              artist,
              title: `${artist} Tour`,
              dateStr: date,
              venue,
              source: 'Soompi Tour Table'
            });
          }
        }
      });
      
      this.events.push(...events);
      console.log(`📊 Soompi 找到 ${events.length} 個演出活動`);
      
      return events;
      
    } catch (error) {
      console.error('Soompi 抓取失敗:', error.message);
      return [];
    }
  }

  // 判斷是否為已知 K-pop 藝人
  isKpopArtist(name) {
    if (!name || name.length < 2) return false;
    
    const knownArtists = [
      'BTS', 'BLACKPINK', 'TWICE', 'SEVENTEEN', 'NewJeans', 'IVE', 'aespa',
      'STRAY KIDS', 'ITZY', 'ENHYPEN', 'LE SSERAFIM', 'NMIXX', 'BABYMONSTER',
      '(G)I-DLE', 'RIIZE', 'KISS OF LIFE', 'TAEMIN', 'j-hope', 'G-DRAGON',
      'NCT', 'NCT 127', 'NCT DREAM', 'WayV', 'SUPER JUNIOR', 'SHINee',
      'Girls\' Generation', 'Red Velvet', 'MAMAMOO', 'GFRIEND', 'OH MY GIRL'
    ];
    
    const nameUpper = name.toUpperCase().trim();
    return knownArtists.some(artist => 
      nameUpper.includes(artist.toUpperCase()) || artist.toUpperCase().includes(nameUpper)
    );
  }

  // 解析日期字串為標準格式
  parseDate(dateStr) {
    if (!dateStr) return null;
    
    try {
      // January 25 -> 2025-01-25
      const monthNames = {
        'JANUARY': '01', 'FEBRUARY': '02', 'MARCH': '03', 'APRIL': '04',
        'MAY': '05', 'JUNE': '06', 'JULY': '07', 'AUGUST': '08',
        'SEPTEMBER': '09', 'OCTOBER': '10', 'NOVEMBER': '11', 'DECEMBER': '12'
      };
      
      // 處理 "January 25" 格式
      const monthDayMatch = dateStr.match(/([A-Za-z]+)\s+(\d{1,2})/);
      if (monthDayMatch) {
        const [, monthName, day] = monthDayMatch;
        const month = monthNames[monthName.toUpperCase()];
        if (month) {
          const year = dateStr.includes('2025') ? '2025' : '2025'; // 預設 2025
          return `${year}-${month}-${day.padStart(2, '0')}`;
        }
      }
      
      // 處理 "2025-08-15" 格式
      if (dateStr.match(/\d{4}-\d{2}-\d{2}/)) {
        return dateStr;
      }
      
      return null;
      
    } catch (error) {
      console.log('日期解析失敗:', dateStr);
      return null;
    }
  }

  // 過濾近三個月的活動
  filterUpcomingEvents(events) {
    const now = new Date('2025-07-21'); // 以今天為基準
    const threeMonthsLater = new Date('2025-10-21');
    
    return events.filter(event => {
      const eventDate = new Date(this.parseDate(event.dateStr));
      return eventDate >= now && eventDate <= threeMonthsLater;
    }).filter(event => this.parseDate(event.dateStr) !== null);
  }

  // 主執行函數
  async runScraper() {
    console.log('🚀 啟動手動驗證 K-pop 演出資訊爬蟲...');
    console.log('📅 目標期間: 2025年7月21日 - 2025年10月21日\n');
    
    const startTime = Date.now();
    
    // 執行 Soompi 抓取
    await this.fetchSoompiTours();
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n⏱️  爬取完成，耗時 ${duration} 秒`);
    console.log(`📊 找到 ${this.events.length} 個潛在活動`);
    
    // 過濾近三個月的活動
    const upcomingEvents = this.filterUpcomingEvents(this.events);
    console.log(`✨ 近三個月內活動: ${upcomingEvents.length} 個`);
    
    if (upcomingEvents.length > 0) {
      console.log('\n📋 找到的活動:');
      upcomingEvents.forEach((event, index) => {
        const date = this.parseDate(event.dateStr);
        console.log(`${index + 1}. ${event.artist} - ${date || event.dateStr}`);
        console.log(`   📍 ${event.venue}`);
        console.log(`   🔗 ${event.source}`);
        console.log('');
      });
    }
    
    return upcomingEvents;
  }

  // 轉換為網站格式
  convertToWebsiteFormat(events) {
    return events.map((event, index) => ({
      id: index + 1,
      title: event.title || `${event.artist} Concert`,
      artist: event.artist,
      date: this.parseDate(event.dateStr) || '2025-08-01',
      time: '19:00', // 預設時間
      venue: event.venue,
      location: this.extractLocation(event.venue),
      price: '詳見官網',
      description: `${event.artist} 演出活動 (資料來源: ${event.source})`,
      status: '確認舉辦',
      category: 'concert',
      gradient: this.getRandomGradient(),
      source: event.source,
      featured: index === 0
    }));
  }

  // 提取地點資訊
  extractLocation(venue) {
    const locationMaps = {
      'Philippine': 'Philippines',
      'Bangkok': 'Bangkok, Thailand',
      'Seoul': 'Seoul, South Korea',
      'Tokyo': 'Tokyo, Japan',
      'Singapore': 'Singapore',
      'Manila': 'Manila, Philippines',
      'Los Angeles': 'Los Angeles, USA',
      'New York': 'New York, USA',
      'London': 'London, UK'
    };
    
    for (const [key, value] of Object.entries(locationMaps)) {
      if (venue.includes(key)) return value;
    }
    
    return venue;
  }

  // 隨機漸層
  getRandomGradient() {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }

  // 儲存結果
  async saveResults(events) {
    if (!events || events.length === 0) {
      console.log('❌ 沒有活動資料可儲存');
      return null;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    
    // 儲存網站格式
    const websiteEvents = this.convertToWebsiteFormat(events);
    const filename = `manual_scraped_events_${timestamp}.js`;
    
    const content = `// 手動驗證的 K-pop 演出資訊 - ${timestamp}
// 資料來源: Soompi 2025 Tour Masterlist

const manualScrapedEvents = ${JSON.stringify(websiteEvents, null, 2)};

module.exports = manualScrapedEvents;`;
    
    fs.writeFileSync(filename, content);
    console.log(`💾 資料已儲存: ${filename}`);
    
    return { filename, events: websiteEvents };
  }
}

// 主執行函數
async function main() {
  const scraper = new ManualKpopScraper();
  
  try {
    const events = await scraper.runScraper();
    const result = await scraper.saveResults(events);
    
    if (result) {
      console.log(`\n🎉 成功！可以使用 ${result.filename} 替換現有的演出資料`);
      console.log(`📝 建議更新 index.js 中的 require 路徑:`);
      console.log(`   const realKpopEvents = require('./${result.filename.replace('.js', '')}');`);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ 手動爬蟲執行失敗:', error.message);
    throw error;
  }
}

// 如果直接執行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ManualKpopScraper, main };