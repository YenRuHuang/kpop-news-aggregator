# Kpop News Aggregator

A modern web application for aggregating and organizing Kpop news from various sources.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Build Tool**: Vite

## Project Structure

```
kpop-news-aggregator/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── styles/          # CSS and styling files
│   └── public/              # Static assets
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/     # Business logic controllers
│   │   ├── models/          # Data models
│   │   ├── services/        # External services and utilities
│   │   ├── middleware/      # Express middleware
│   │   └── config/          # Configuration files
│   └── database/            # Database files and migrations
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kpop-news-aggregator
```

2. Install all dependencies:
```bash
npm run install:all
```

### Development

1. Start the development servers:
```bash
npm run dev
```

This will start both the frontend (React) and backend (Express) servers concurrently.

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Building for Production

```bash
npm run build
```

## Features

- News aggregation from multiple Kpop sources
- Real-time news updates
- Category-based news organization
- Search and filtering capabilities
- Responsive design for mobile and desktop

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC