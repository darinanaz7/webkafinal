// /routes/api.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: { country: 'us', apiKey: '0b20af078be04bfb903b420ace9737b9' },
    });
    res.send(response.data.articles);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch news' });
  }
});

router.get('/crypto', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: { ids: 'bitcoin,ethereum', vs_currencies: 'usd' },
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch crypto prices' });
  }
});

module.exports = router;
