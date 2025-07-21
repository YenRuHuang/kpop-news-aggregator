import React, { useState, useEffect } from 'react';
import { Article, SearchFilters } from '../types';
import SearchBar from '../components/SearchBar';
import NewsList from '../components/NewsList';

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories] = useState(['music', 'awards', 'fashion', 'variety', 'news', 'general']);
  const [sources, setSources] = useState<string[]>([]);

  const fetchArticles = async (filters?: SearchFilters, page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });

      if (filters?.query) params.append('search', filters.query);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.source) params.append('source', filters.source);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();
      
      setArticles(data.articles || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/sources');
      const data = await response.json();
      setSources(data.map((source: any) => source.name));
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchSources();
  }, []);

  const handleSearch = (filters: SearchFilters) => {
    fetchArticles(filters, 1);
  };

  const handleArticleClick = (article: Article) => {
    window.open(article.url, '_blank');
  };

  const handlePageChange = (page: number) => {
    fetchArticles(undefined, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 標題區域 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🎵 Kpop News Aggregator
            </h1>
            <p className="text-lg text-gray-600">
              最新的 K-Pop 新聞，全部在這裡！
            </p>
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          onSearch={handleSearch}
          categories={categories}
          sources={sources}
        />

        <NewsList
          articles={articles}
          loading={loading}
          onArticleClick={handleArticleClick}
        />

        {/* 分頁 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                上一頁
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const page = Math.max(1, currentPage - 2) + index;
                if (page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg border ${
                      page === currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                下一頁
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* 底部 */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Kpop News Aggregator. Made with ❤️ for K-Pop fans.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;