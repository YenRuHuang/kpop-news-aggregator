import React from 'react';
import { Article } from '../types';

interface NewsCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      music: 'bg-purple-100 text-purple-800',
      awards: 'bg-yellow-100 text-yellow-800',
      fashion: 'bg-pink-100 text-pink-800',
      variety: 'bg-blue-100 text-blue-800',
      news: 'bg-red-100 text-red-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
      onClick={() => onClick(article)}
    >
      {article.imageUrl && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
            {article.category.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500">{article.sourceName}</span>
        </div>

        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {article.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{article.tags.length - 3}</span>
            )}
          </div>
          
          <time className="text-xs text-gray-500">
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;