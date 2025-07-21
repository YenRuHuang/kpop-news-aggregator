const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// GET /api/articles - 獲取所有文章
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const articles = await Article.getAll(page, limit, category, search);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/articles/:id - 獲取單篇文章
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.getById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/articles - 創建新文章
router.post('/', async (req, res) => {
  try {
    const articleData = req.body;
    const articleId = await Article.create(articleData);
    res.status(201).json({ id: articleId, message: 'Article created successfully' });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/articles/category/:category - 按分類獲取文章
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const articles = await Article.getByCategory(req.params.category, page, limit);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;