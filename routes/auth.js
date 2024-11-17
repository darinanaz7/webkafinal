const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const User = require('../models/User'); // Модель пользователя
const QRCode = require("qrcode");
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
  try {
    const { username, password, age, gender, lastName, firstName, email } = req.body;


    // Проверка на существование пользователя
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ error: 'User already exists' });
    }

    // Создание нового пользователя
    
    const user = new User({ username, password, age, gender,lastName, firstName, email });
    await user.save();

    // Отправка email (необязательно)
    const transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port:465,
      secure:true,
      auth: { user: 'darina.nazarbekova@ya.ru', pass: 'ebonhzuzcrnwxzsz' },
    });

    await transporter.sendMail({
    from: 'darina.nazarbekova@ya.ru',
      to: email,
      subject: 'Welcome!',
      text: 'Thank you for registering.',
     });

    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ error: 'Registration failed' });
  }
});
router.get("/login", async(req, res)=>{
  return res.render("login", {error: false})

})
router.get("/register", async(req, res)=>{
  return res.render("register", {error: false})

})
router.get("/2fa/setup",authenticateUser,async(req,res)=>{
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const secretKey = speakeasy.generateSecret({ name: `PortfolioApp ${user.username}` });
  user.twoFactorSecret=secretKey.base32
  await user.save()
  const qrCode = await QRCode.toDataURL(secretKey.otpauth_url);
  res.status(200).json({qrCode})

})
router.post('/2fa/verify', authenticateUser, async (req, res) => {
  try {
      const { token } = req.body;
    
      const user = await User.findById(req.user.id);
      console.log(user)
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isValid = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token,
      });

      if (!isValid) {
          return res.status(400).json({ message: 'Invalid token' });
      }

      
      user.twoFactorAuthEnabled = true;
      await user.save();

      res.status(200).json({ message: '2FA successfully enabled' });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error', error });
  }
});
router.get("/2fa",(req,res)=>{
  res.render("2fa")
})
// Логин пользователя
router.post('/login', async (req, res) => {
  try {
    const { username, password, twoFactorCode } = req.body;

    // Поиск пользователя в базе данных
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ error: 'User not found' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    // Проверка 2FA, если включено
    if (user.twoFactorSecret) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
      });

      if (!verified) {
        return res.status(400).send({ error: 'Invalid 2FA code' });
      }
    }

    // Генерация JWT
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.cookie("token", token, {
      httpOnly:true,
      maxAge:24*60*60*1000, 
      secure:false

    })
    res.redirect("/")
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ error: 'Login failed' });
  }
});

module.exports = router;
