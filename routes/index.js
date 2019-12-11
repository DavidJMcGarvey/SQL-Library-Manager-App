const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

asyncHandler = (cb) => {
  return async(req, res, next) => {
      try {
          await cb(req, res, next);
      } catch (error) {
          res.status(500).send(error);
      }
  }
};

// Home page
router.get('/', asyncHandler(async(req, res, next) => {
  let books = await Book.findAll();
  books = books.map(book => book.toJSON());
  res.render("index", { books });
  // console.log(books.map(book => book.toJSON()));
  // res.render('index');
}));

module.exports = router;