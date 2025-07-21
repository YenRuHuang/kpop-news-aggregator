-- Kpop News Aggregator Database Schema

-- Sources table for RSS feeds and news sources
CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    category TEXT DEFAULT 'general',
    language TEXT DEFAULT 'en',
    isActive BOOLEAN DEFAULT 1,
    lastFetched DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Articles table for news articles
CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT,
    publishedAt DATETIME NOT NULL,
    sourceId INTEGER,
    sourceName TEXT,
    category TEXT DEFAULT 'general',
    tags TEXT, -- JSON array of tags
    imageUrl TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sourceId) REFERENCES sources(id) ON DELETE SET NULL
);

-- Insert default sources
INSERT OR IGNORE INTO sources (name, url, category, language) VALUES 
('Soompi', 'https://www.soompi.com/feed/', 'general', 'en'),
('AllKPop', 'https://www.allkpop.com/rss', 'general', 'en'),
('Korea JoongAng Daily Entertainment', 'https://koreajoongangdaily.joins.com/RSS/entertainment', 'entertainment', 'en');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(publishedAt DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(sourceId);
CREATE INDEX IF NOT EXISTS idx_articles_url ON articles(url);
CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(isActive);