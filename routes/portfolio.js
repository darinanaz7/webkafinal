const express = require('express');
const Portfolio = require('../models/Portfolio');
const { authenticateUser } = require('../middleware/authMiddleware'); // Middleware для аутентификации
const { checkRole } = require('../middleware/roleMiddleware'); // Middleware для проверки ролей
const upload = require('../config/multerConfig');

const router = express.Router();

// Создание элемента портфолио (доступно только для admin и editor)
router.post('/', authenticateUser,upload.any("images"), checkRole(['admin', 'editor']), async (req, res) => {
  try {
    const {title,description}=req.body;
    const imagePaths = req.files.map(file => file.path);
    const portfolio = new Portfolio({ title,description,images:imagePaths, createdBy: req.user._id });
    await portfolio.save();
    res.status(201).send(portfolio);
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'Failed to create portfolio item' });
  }
});
router.get('/portfolio', authenticateUser, async (req, res) => {
  try {
    const items = await Portfolio.find();
    res.status(200).json({items})
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'Failed to fetch portfolio items' });
  }
});
// Чтение всех элементов портфолио (доступно для всех аутентифицированных пользователей)
router.get('/', authenticateUser, async (req, res) => {
  try {
    res.render("portfolio")
  } catch (error) {
    res.status(400).send({ error: 'Failed to fetch portfolio items' });
  }
});

// Обновление элемента портфолио (доступно только для admin)
router.put('/:id', authenticateUser, checkRole(['admin']), async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!portfolio) return res.status(404).send({ error: 'Portfolio item not found' });
    res.send(portfolio);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update portfolio item' });
  }
});

// Удаление элемента портфолио (доступно только для admin)
router.delete('/:id', authenticateUser, checkRole(['admin']), async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) return res.status(404).send({ error: 'Portfolio item not found' });
    res.send({ message: 'Portfolio item deleted' });
  } catch (error) {
    res.status(400).send({ error: 'Failed to delete portfolio item' });
  }
});
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const id=req.params.id;
    const portfolio = await Portfolio.findById(id);
    if (!portfolio) return res.status(404).send({ error: 'Portfolio item not found' });
    res.render("article",{portfolio})
  } catch (error) {
    res.status(400).send({ error: 'Failed to delete portfolio item' });
  }
});
router.get('/article/:id', authenticateUser, async (req, res) => {
  try {
    const id=req.params.id;
    const portfolio = await Portfolio.findById(id);
    if (!portfolio) return res.status(404).send({ error: 'Portfolio item not found' });
    res.status(200).json({portfolio});
  } catch (error) {
    res.status(400).send({ error: 'Failed to delete portfolio item' });
  }
});

module.exports = router;


