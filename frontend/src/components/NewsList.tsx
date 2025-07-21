import React from 'react';
import { Article } from '../types';
import NewsCard from './NewsCard';

interface NewsListProps {
  articles: Article[];
  loading: boolean;
  onArticleClick: (article: Article) => void;
}

const NewsList: React.FC<NewsListProps> = ({ articles, loading, onArticleClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-1"></div>
              <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">沒有找到新聞</h3>
        <p className="text-gray-500">
          請嘗試調整搜尋條件或稍後再試
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          onClick={onArticleClick}
        />
      ))}
    </div>
  );
};

export default NewsList;