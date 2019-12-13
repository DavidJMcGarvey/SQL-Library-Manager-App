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
// (async () => {
//   // Sync 'Book' table
//   await Book.sequelize.sync({force: true});

//   try {
//     const book111 = await Book.create({
//       title: 'Mindset',
//       author: 'Carolyn Dweck',
//       genre: 'Sociology',
//       year: 2011,
//     });
//     console.log(book111.toJSON());
//   } catch (error) {
//       throw error;
//   }
// });

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

// Update book page
router.get('/:id/update-book', asyncHandler(async(res, req) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/update-book', { book });
  } else {
    res.sendStatus(404);
  }
}));

// POST new book
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
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


// POST updated book
router.post('/:id/update-book', asyncHandler(async(res, req) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    res.redirect('books/' + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('book/new-book', { book });
    } else {
      throw error;
    }
  }
}));

// Delete book form
router.get("/:id/delete-book", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/delete-book", { book, title: "Delete Book" });
  } else {
    res.sendStatus(404);
  }
}));

// Delete the book
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy()
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
  
}));

module.exports = router;