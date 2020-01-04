'use strict';

const express = require('express');
const paginate = require('express-paginate');
const router = express.Router();
const Book = require('../models').Book;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.use(paginate.middleware(5, 50));

// Function to handle async/await
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

// Book listing page
router.get('/', asyncHandler(async (req, res) => {
  let allBooks = await Book.findAll();
  let books = await Book.findAll({
    limit: req.query.limit,
    offset: req.skip
  });

  const pageCount = Math.ceil(allBooks.length / req.query.limit);
  if (books) {
    res.render('index', {
      books,
      pages: paginate.getArrayPages(req)(10, pageCount, req.query.page)
    });
  } else {
    res.sendStatus(404);
  }
  

}));

// Create new book form
router.get('/new', asyncHandler(async (req, res) => {
  res.render('books/new', { book: {}, title: "Add a new book!" });
}));

// POST new book
router.post('/', asyncHandler(async (req, res, next) => {
  let book;

  try {
    book = await Book.create(req.body);
    return res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('books/new', { book, errors: error.errors, title: "Let's Try That Again" });
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
    res.render('404');
  }
}));

// Update book page
router.get('/:id/new', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  if (book) {
    res.render('books/update', { book });
  } else {
    res.sendStatus(404);
  }
}));

// POST updated book
router.post('/:id/new', asyncHandler(async (req, res) => {
  let book;

  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      return res.redirect('/books/' + book.id)
    } else {
      res.sendStatus(404);
    }
    return res.redirect('/books/' + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('books/new', { book, errors: error.errors, title: "Let's Try That Again" });
    } else {
      throw error;
    }
  }
}));

// Delete book form
router.get('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  if (book) {
    res.render('books/delete', { book, title: "Delete Book" });
  } else {
    res.sendStatus(404);
  }
}));

// POST delete book
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);

  if (book) {
    await book.destroy()
    return res.redirect('/books');
  } else {
    res.sendStatus(404);
  }
}));

// POST search route
router.post('/search', asyncHandler(async (req, res) => {
  let query = req.body.query;
  let searchConditions = {
    [Op.or] : {
      title: {
        [Op.like]: `%${query}%`,
      },
      author: {
        [Op.like]: `%${query}%`,
      },
      genre: {
        [Op.like]: `%${query}%`,
      },
      year: {
        [Op.like]: `%${query}%`,
      } 
    }
  };

  let books = await Book.findAll({
    where: searchConditions,
  });

  res.render('search', {
    books,
    query
   });
}));

module.exports = router;