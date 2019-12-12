'use strict';

const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

function asyncHandler(cb) {
  return async(req, res, next) => {
      try {
          await cb(req, res);
      } catch (error) {
          res.status(500).send(error);
      }
  }
};

// Sync database
(async () => {
  // Sync 'Book' table
  await Book.sequelize.sync();
});

// Book listing page
router.get('/', asyncHandler(async (req, res) => {
  let books = await Book.findAll();
  books = books.map(book => book.toJSON());
  res.render('index', { books });
}));

// Create new book form
router.get('/new-book', (req, res) => {
  res.render('books/new-book', { title: "Add a new book!" })
});

// POST new book
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    console.log(req.body);
    res.redirect('books/' + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('new-book', { book, errors: error.errors, title: "New Book Dawg" });
    } else {
      throw error;
    }
  }
    // const book = await Book.create(req.body);
    // res.redirect('/books/' + book.id);
}));

// Detail page
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/book-detail', { book }); 
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;