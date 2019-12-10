const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res, next) => {
  res.redirect('/books');
});

module.exports = router;