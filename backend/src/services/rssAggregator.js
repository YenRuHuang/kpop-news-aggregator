const Parser = require('rss-parser');
const axios = require('axios');
const Article = require('../models/Article');
const Source = require('../models/Source');

class RSSAggregator {
  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['pubDate', 'description', 'content']
      }
    });
    this.isRunning = false;
  }

  // 預設的 Kpop 新聞來源
  getDefaultSources() {
    return [
      {
        name: 'Soompi',
        url: 'https://www.soompi.com/feed/',
        category: 'general',
        language: 'en'
      },
      {
        name: 'AllKPop',
        url: 'https://www.allkpop.com/rss',
        category: 'general',
        language: 'en'
      },
      {
        name: 'Korea JoongAng Daily - Entertainment',
        url: 'https://koreajoongangdaily.joins.com/RSS/entertainment',
        category: 'entertainment',
        language: 'en'
      }
    ];
  }

  // 從單個 RSS 源獲取新聞
  async fetchFromSource(source) {
    try {
      console.log(`Fetching from ${source.name}: ${source.url}`);
      
      const response = await axios.get(source.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; KpopNewsAggregator/1.0)'
        }
      });

      const feed = await this.parser.parseString(response.data);
      const articles = [];

      for (const item of feed.items) {
        // 檢查是否為 Kpop 相關內容
        if (this.isKpopRelated(item.title, item.contentSnippet || item.description)) {
          const article = {
            title: item.title,
            url: item.link,
            description: item.contentSnippet || item.description || '',
            content: item.content || item.description || '',
            publishedAt: new Date(item.pubDate || item.isoDate),
            sourceId: source.id,
            sourceName: source.name,
            category: this.categorizeContent(item.title, item.contentSnippet || item.description),
            tags: this.extractTags(item.title, item.contentSnippet || item.description)
          };

          // 檢查文章是否已存在
          const existingArticle = await Article.getByUrl(article.url);
          if (!existingArticle) {
            articles.push(article);
          }
        }
      }

      return articles;
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error.message);
      return [];
    }
  }

  // 檢查內容是否與 Kpop 相關
  isKpopRelated(title, description) {
    const kpopKeywords = [
      'kpop', 'k-pop', 'korean pop', 'bts', 'blackpink', 'twice', 'stray kids',
      'newjeans', 'ive', 'aespa', 'red velvet', 'girls generation', 'snsd',
      'exo', 'nct', 'seventeen', 'itzy', 'gidle', 'mamamoo', 'bigbang',
      'super junior', 'shinee', 'f(x)', 'wonder girls', 'kara', 'sistar',
      'apink', 'loona', 'fromis_9', 'le sserafim', 'ive', 'idol', 'comeback',
      'debut', 'music video', 'mv', 'album', 'seoul music awards', 'mama',
      'melon', 'gaon', 'hanteo', 'korean music', 'hallyu'
    ];

    const content = (title + ' ' + (description || '')).toLowerCase();
    return kpopKeywords.some(keyword => content.includes(keyword));
  }

  // 自動分類內容
  categorizeContent(title, description) {
    const content = (title + ' ' + (description || '')).toLowerCase();
    
    if (content.includes('comeback') || content.includes('debut') || content.includes('album') || content.includes('music video')) {
      return 'music';
    } else if (content.includes('award') || content.includes('win') || content.includes('chart')) {
      return 'awards';
    } else if (content.includes('fashion') || content.includes('style') || content.includes('photoshoot')) {
      return 'fashion';
    } else if (content.includes('variety') || content.includes('show') || content.includes('interview')) {
      return 'variety';
    } else if (content.includes('scandal') || content.includes('controversy') || content.includes('issue')) {
      return 'news';
    }
    
    return 'general';
  }

  // 提取標籤
  extractTags(title, description) {
    const content = (title + ' ' + (description || '')).toLowerCase();
    const tags = [];

    // 知名團體和歌手
    const artists = [
      'bts', 'blackpink', 'twice', 'stray kids', 'newjeans', 'ive', 'aespa',
      'red velvet', 'girls generation', 'snsd', 'exo', 'nct', 'seventeen',
      'itzy', 'gidle', 'mamamoo', 'bigbang', 'super junior', 'shinee'
    ];

    artists.forEach(artist => {
      if (content.includes(artist)) {
        tags.push(artist);
      }
    });

    // 活動類型
    const activities = ['comeback', 'debut', 'album', 'mv', 'concert', 'tour', 'award'];
    activities.forEach(activity => {
      if (content.includes(activity)) {
        tags.push(activity);
      }
    });

    return tags.slice(0, 5); // 限制最多 5 個標籤
  }

  // 聚合所有來源的新聞
  async aggregateNews() {
    if (this.isRunning) {
      console.log('Aggregation already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting news aggregation...');

    try {
      const sources = await Source.getActive();
      const allArticles = [];

      for (const source of sources) {
        const articles = await this.fetchFromSource(source);
        allArticles.push(...articles);
      }

      // 批量保存文章
      for (const article of allArticles) {
        try {
          await Article.create(article);
          console.log(`Saved article: ${article.title}`);
        } catch (error) {
          console.error(`Error saving article: ${article.title}`, error.message);
        }
      }

      console.log(`Aggregation completed. Processed ${allArticles.length} new articles.`);
      return allArticles.length;

    } catch (error) {
      console.error('Error during news aggregation:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  // 定期聚合新聞
  startPeriodicAggregation(intervalMinutes = 30) {
    console.log(`Starting periodic aggregation every ${intervalMinutes} minutes`);
    
    // 立即執行一次
    this.aggregateNews();
    
    // 設定定期執行
    setInterval(() => {
      this.aggregateNews();
    }, intervalMinutes * 60 * 1000);
  }

  // 初始化預設來源
  async initializeDefaultSources() {
    const defaultSources = this.getDefaultSources();
    
    for (const sourceData of defaultSources) {
      try {
        const existingSource = await Source.getByUrl(sourceData.url);
        if (!existingSource) {
          await Source.create(sourceData);
          console.log(`Added default source: ${sourceData.name}`);
        }
      } catch (error) {
        console.error(`Error adding default source ${sourceData.name}:`, error);
      }
    }
  }
}

module.exports = RSSAggregator;