const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class KpopEventScraper {
  constructor() {
    this.events = [];
    this.sources = [
      {
        name: 'KKTIX',
        baseUrl: 'https://kktix.com',
        searchUrl: 'https://kktix.com/events?utf8=✓&query=kpop'
      },
      {
        name: '年代售票',
        baseUrl: 'https://www.ticket.com.tw',
        searchUrl: 'https://www.ticket.com.tw/application/UTK02/UTK0201_.aspx?PRODUCT_ID=Q&TNAME=kpop'
      },
      {
        name: 'Ticketmaster',
        baseUrl: 'https://www.ticketmaster.com',
        searchUrl: 'https://www.ticketmaster.com/browse/concerts/k-pop-j1001002'
      }
    ];
    
    // 設定瀏覽器選項
    this.browserOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ]
    };
  }

  // 通用的延遲函數
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 爬取 KKTIX K-pop 活動
  async scrapeKKTIX() {
    console.log('🎫 正在爬取 KKTIX...');
    
    try {
      const browser = await puppeteer.launch(this.browserOptions);
      const page = await browser.newPage();
      
      // 設定請求攔截，加快載入速度
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'image') {
          req.abort();
        } else {
          req.continue();
        }
      });

      // 搜尋 K-pop 相關活動
      const searchTerms = ['kpop', 'k-pop', '韓流', 'SEVENTEEN', 'NewJeans', 'IVE', 'STRAY KIDS'];
      
      for (const term of searchTerms) {
        const searchUrl = `https://kktix.com/events?utf8=✓&query=${encodeURIComponent(term)}`;
        
        try {
          await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
          await page.waitForSelector('.event-list', { timeout: 10000 });
          
          const events = await page.evaluate(() => {
            const eventCards = document.querySelectorAll('.event-item');
            return Array.from(eventCards).map(card => {
              const titleElement = card.querySelector('.event-title a');
              const dateElement = card.querySelector('.event-date');
              const venueElement = card.querySelector('.event-location');
              const linkElement = card.querySelector('.event-title a');
              
              return {
                title: titleElement?.textContent?.trim() || '',
                date: dateElement?.textContent?.trim() || '',
                venue: venueElement?.textContent?.trim() || '',
                link: linkElement?.href || '',
                source: 'KKTIX'
              };
            });
          });
          
          // 過濾 K-pop 相關活動
          const kpopEvents = events.filter(event => 
            this.isKpopEvent(event.title) || this.isKpopEvent(event.venue)
          );
          
          this.events.push(...kpopEvents);
          console.log(`✅ KKTIX 找到 ${kpopEvents.length} 個 K-pop 活動 (搜尋詞: ${term})`);
          
        } catch (error) {
          console.log(`❌ 搜尋 "${term}" 時發生錯誤:`, error.message);
        }
        
        await this.delay(2000); // 避免過於頻繁請求
      }
      
      await browser.close();
      
    } catch (error) {
      console.error('KKTIX 爬取失敗:', error.message);
    }
  }

  // 爬取年代售票
  async scrapeEraTicket() {
    console.log('🎪 正在爬取年代售票...');
    
    try {
      const browser = await puppeteer.launch(this.browserOptions);
      const page = await browser.newPage();
      
      // 年代售票的搜尋頁面
      const searchUrl = 'https://www.ticket.com.tw/application/UTK02/UTK0201_.aspx';
      
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      
      // 在搜尋框輸入關鍵字
      const searchTerms = ['韓流', 'K-POP', '演唱會'];
      
      for (const term of searchTerms) {
        try {
          await page.type('#ctl00_ContentPlaceHolder1_txtKeyword', term);
          await page.click('#ctl00_ContentPlaceHolder1_btnSearch');
          await page.waitForSelector('.activity-item', { timeout: 10000 });
          
          const events = await page.evaluate(() => {
            const items = document.querySelectorAll('.activity-item');
            return Array.from(items).map(item => {
              const title = item.querySelector('.activity-title')?.textContent?.trim() || '';
              const date = item.querySelector('.activity-date')?.textContent?.trim() || '';
              const venue = item.querySelector('.activity-venue')?.textContent?.trim() || '';
              const link = item.querySelector('a')?.href || '';
              
              return { title, date, venue, link, source: '年代售票' };
            });
          });
          
          const kpopEvents = events.filter(event => this.isKpopEvent(event.title));
          this.events.push(...kpopEvents);
          console.log(`✅ 年代售票找到 ${kpopEvents.length} 個 K-pop 活動`);
          
          // 清空搜尋框準備下一次搜尋
          await page.evaluate(() => document.querySelector('#ctl00_ContentPlaceHolder1_txtKeyword').value = '');
          
        } catch (error) {
          console.log(`年代售票搜尋 "${term}" 失敗:`, error.message);
        }
        
        await this.delay(3000);
      }
      
      await browser.close();
      
    } catch (error) {
      console.error('年代售票爬取失敗:', error.message);
    }
  }

  // 爬取 Ticketmaster (國際)
  async scrapeTicketmaster() {
    console.log('🌍 正在爬取 Ticketmaster...');
    
    try {
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      };
      
      // 搜尋 K-pop 演出
      const searchUrl = 'https://www.ticketmaster.com/browse/concerts/k-pop-j1001002';
      const response = await axios.get(searchUrl, { headers, timeout: 15000 });
      
      const $ = cheerio.load(response.data);
      
      const events = [];
      $('.event-listing').each((index, element) => {
        const title = $(element).find('.event-name').text().trim();
        const date = $(element).find('.event-date').text().trim();
        const venue = $(element).find('.event-venue').text().trim();
        const link = $(element).find('a').attr('href');
        
        if (title && this.isKpopEvent(title)) {
          events.push({
            title,
            date,
            venue,
            link: link ? 'https://www.ticketmaster.com' + link : '',
            source: 'Ticketmaster'
          });
        }
      });
      
      this.events.push(...events);
      console.log(`✅ Ticketmaster 找到 ${events.length} 個 K-pop 活動`);
      
    } catch (error) {
      console.error('Ticketmaster 爬取失敗:', error.message);
    }
  }

  // 判斷是否為 K-pop 相關活動
  isKpopEvent(text) {
    if (!text) return false;
    
    const kpopKeywords = [
      // 藝人名稱
      'BTS', 'BLACKPINK', 'TWICE', 'SEVENTEEN', 'NewJeans', 'IVE', 'aespa',
      'STRAY KIDS', 'ITZY', 'ENHYPEN', 'LE SSERAFIM', 'NMIXX', 'BABYMONSTER',
      '(G)I-DLE', 'RIIZE', 'KISS OF LIFE', 'TAEMIN', 'j-hope', 'SOLO',
      
      // 通用關鍵詞
      'K-POP', 'KPOP', 'K-pop', '韓流', '韓團', '韓國', 'KOREA', 'KOREAN',
      '偶像', 'IDOL', '男團', '女團', 'BOY GROUP', 'GIRL GROUP',
      
      // 活動類型
      'FAN MEETING', '粉絲見面會', 'SHOWCASE', 'CONCERT', '演唱會',
      'WORLD TOUR', '世界巡演', 'KCON', 'Music Bank', '音樂銀行'
    ];
    
    const textUpper = text.toUpperCase();
    return kpopKeywords.some(keyword => textUpper.includes(keyword.toUpperCase()));
  }

  // 解析和標準化日期格式
  parseEventDate(dateString) {
    if (!dateString) return null;
    
    try {
      // 各種日期格式的處理
      const patterns = [
        /(\d{4})[/-](\d{1,2})[/-](\d{1,2})/, // 2025-08-15, 2025/08/15
        /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/, // 15/08/2025, 08-15-2025
        /(\d{4})年(\d{1,2})月(\d{1,2})日/, // 2025年8月15日
      ];
      
      for (const pattern of patterns) {
        const match = dateString.match(pattern);
        if (match) {
          let year, month, day;
          
          if (pattern.toString().includes('年')) {
            [, year, month, day] = match;
          } else if (match[1].length === 4) {
            [, year, month, day] = match;
          } else {
            [, month, day, year] = match;
          }
          
          // 確保月份和日期是兩位數
          month = month.padStart(2, '0');
          day = day.padStart(2, '0');
          
          return `${year}-${month}-${day}`;
        }
      }
      
      return dateString; // 如果無法解析，返回原始字串
      
    } catch (error) {
      console.log('日期解析失敗:', dateString, error.message);
      return null;
    }
  }

  // 過濾近三個月的活動
  filterRecentEvents(events) {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);
    
    return events.filter(event => {
      const eventDate = new Date(this.parseEventDate(event.date));
      return eventDate >= now && eventDate <= threeMonthsLater;
    });
  }

  // 主爬蟲執行函數
  async scrapeAll() {
    console.log('🚀 開始爬取 K-pop 演出資訊...');
    console.log('⏰ 目標時間範圍: 近三個月');
    
    const startTime = Date.now();
    
    // 並行執行各平台爬蟲 (但限制併發數避免被封)
    const scrapers = [
      this.scrapeKKTIX(),
      // 暫時註釋其他平台，專注於 KKTIX
      // this.scrapeEraTicket(),
      // this.scrapeTicketmaster()
    ];
    
    await Promise.allSettled(scrapers);
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log(`\n🎉 爬取完成! 耗時 ${duration} 秒`);
    console.log(`📊 總共找到 ${this.events.length} 個活動`);
    
    // 過濾近三個月的活動
    const recentEvents = this.filterRecentEvents(this.events);
    console.log(`📅 近三個月活動: ${recentEvents.length} 個`);
    
    // 移除重複活動
    const uniqueEvents = this.removeDuplicates(recentEvents);
    console.log(`✨ 去重後活動: ${uniqueEvents.length} 個`);
    
    return uniqueEvents;
  }

  // 移除重複活動
  removeDuplicates(events) {
    const seen = new Set();
    return events.filter(event => {
      const key = `${event.title}_${event.date}_${event.venue}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // 儲存爬取結果
  async saveResults(events) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `scraped_events_${timestamp}.json`;
    
    // 儲存原始資料
    fs.writeFileSync(filename, JSON.stringify(events, null, 2));
    console.log(`💾 原始資料已儲存: ${filename}`);
    
    // 轉換為網站格式
    const websiteFormat = this.convertToWebsiteFormat(events);
    const websiteFilename = `website_events_${timestamp}.js`;
    
    const fileContent = `// 爬取的 K-pop 演出資訊 - ${timestamp}
const scrapedKpopEvents = ${JSON.stringify(websiteFormat, null, 2)};

module.exports = scrapedKpopEvents;`;
    
    fs.writeFileSync(websiteFilename, fileContent);
    console.log(`🌐 網站格式已儲存: ${websiteFilename}`);
    
    return { events, websiteFormat, filename, websiteFilename };
  }

  // 轉換為網站格式
  convertToWebsiteFormat(events) {
    return events.map((event, index) => ({
      id: index + 1,
      title: event.title,
      artist: this.extractArtist(event.title),
      date: this.parseEventDate(event.date) || '2025-08-01',
      time: "19:00", // 預設時間，之後可以從詳細頁面爬取
      venue: event.venue || "待公佈",
      location: this.extractLocation(event.venue),
      price: "詳見官網",
      description: `${event.title} - 資料來源: ${event.source}`,
      status: "確認舉辦",
      category: this.categorizeEvent(event.title),
      gradient: this.getRandomGradient(),
      source: event.source,
      originalLink: event.link,
      featured: index === 0 // 第一個設為精選
    }));
  }

  // 從標題提取藝人名稱
  extractArtist(title) {
    const artists = [
      'BTS', 'BLACKPINK', 'TWICE', 'SEVENTEEN', 'NewJeans', 'IVE', 'aespa',
      'STRAY KIDS', 'ITZY', 'ENHYPEN', 'LE SSERAFIM', 'NMIXX', 'BABYMONSTER',
      '(G)I-DLE', 'RIIZE', 'KISS OF LIFE', 'TAEMIN', 'j-hope'
    ];
    
    const found = artists.find(artist => title.toUpperCase().includes(artist.toUpperCase()));
    return found || title.split(' ')[0] || '待公佈';
  }

  // 提取地點資訊
  extractLocation(venue) {
    if (!venue) return "待公佈";
    
    const locations = {
      '台北': '台北, Taiwan',
      '高雄': '高雄, Taiwan',
      'Seoul': 'Seoul, South Korea',
      'Tokyo': 'Tokyo, Japan',
      'Bangkok': 'Bangkok, Thailand',
      'Singapore': 'Singapore',
      'Manila': 'Manila, Philippines',
      'Los Angeles': 'Los Angeles, USA'
    };
    
    for (const [key, value] of Object.entries(locations)) {
      if (venue.includes(key)) return value;
    }
    
    return venue;
  }

  // 分類活動類型
  categorizeEvent(title) {
    const titleUpper = title.toUpperCase();
    
    if (titleUpper.includes('CONCERT') || titleUpper.includes('TOUR') || titleUpper.includes('演唱會')) return 'concert';
    if (titleUpper.includes('FAN MEET') || titleUpper.includes('粉絲見面會')) return 'fanmeet';
    if (titleUpper.includes('AWARD') || titleUpper.includes('頒獎')) return 'award';
    if (titleUpper.includes('FESTIVAL') || titleUpper.includes('KCON')) return 'festival';
    if (titleUpper.includes('MUSIC BANK') || titleUpper.includes('綜藝')) return 'variety';
    if (titleUpper.includes('POP UP') || titleUpper.includes('快閃')) return 'popup';
    
    return 'concert'; // 預設為演唱會
  }

  // 隨機漸層色彩
  getRandomGradient() {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }
}

// 主執行函數
async function main() {
  const scraper = new KpopEventScraper();
  
  try {
    const events = await scraper.scrapeAll();
    
    if (events.length > 0) {
      const results = await scraper.saveResults(events);
      
      console.log('\n📋 爬取結果預覽:');
      events.slice(0, 5).forEach((event, index) => {
        console.log(`${index + 1}. ${event.title}`);
        console.log(`   📅 ${event.date}`);
        console.log(`   📍 ${event.venue}`);
        console.log(`   🔗 ${event.source}`);
        console.log('');
      });
      
      return results;
    } else {
      console.log('❌ 未找到任何 K-pop 活動');
      return null;
    }
    
  } catch (error) {
    console.error('爬蟲執行失敗:', error.message);
    throw error;
  }
}

// 如果直接執行此檔案
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { KpopEventScraper, main };