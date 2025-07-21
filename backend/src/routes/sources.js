const express = require('express');
const router = express.Router();
const Source = require('../models/Source');

// GET /api/sources - 獲取所有新聞來源
router.get('/', async (req, res) => {
  try {
    const sources = await Source.getAll();
    res.json(sources);
  } catch (error) {
    console.error('Error fetching sources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sources - 添加新的新聞來源
router.post('/', async (req, res) => {
  try {
    const sourceData = req.body;
    const sourceId = await Source.create(sourceData);
    res.status(201).json({ id: sourceId, message: 'Source created successfully' });
  } catch (error) {
    console.error('Error creating source:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/sources/:id - 更新新聞來源
router.put('/:id', async (req, res) => {
  try {
    const sourceData = req.body;
    await Source.update(req.params.id, sourceData);
    res.json({ message: 'Source updated successfully' });
  } catch (error) {
    console.error('Error updating source:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/sources/:id - 刪除新聞來源
router.delete('/:id', async (req, res) => {
  try {
    await Source.delete(req.params.id);
    res.json({ message: 'Source deleted successfully' });
  } catch (error) {
    console.error('Error deleting source:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;