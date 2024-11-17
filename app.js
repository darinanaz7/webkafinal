const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const apiRoutes = require('./routes/api');
const { authenticateUser } = require('./middleware/authMiddleware'); // Исправленный путь
const cookieparser = require ("cookie-parser");
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieparser())
app.use('/media', express.static(path.join(__dirname, 'media')));



// Настройка шаблонизатора
app.set('view engine', 'ejs');

// Middleware для парсинга JSON и формы
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Сессии
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/portfolio');


// Открытые маршруты
app.use('/auth', authRoutes);

// Защищённые маршруты
app.use('/portfolio', authenticateUser, portfolioRoutes);
app.use('/api', authenticateUser, apiRoutes);

// Пример защищённого маршрута
app.get('/protected', authenticateUser, (req, res) => {
  res.send({ message: `Welcome, ${req.user.username}!` });
});

// Запуск сервера
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
