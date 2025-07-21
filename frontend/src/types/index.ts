export interface Article {
  id: number;
  title: string;
  url: string;
  description: string;
  content: string;
  publishedAt: string;
  sourceId: number;
  sourceName: string;
  category: string;
  tags: string[];
  imageUrl?: string;
}

export interface Source {
  id: number;
  name: string;
  url: string;
  category: string;
  language: string;
  isActive: boolean;
  lastFetched?: string;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
  color: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  source: string;
  dateFrom: string;
  dateTo: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}