const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('Authentication failed');
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateUser };