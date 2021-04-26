const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('ping');
  res.send('alive');
});

module.exports = router;
