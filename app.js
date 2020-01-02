'use strict';

// ------------------------------------------
//  Express App Setup
// ------------------------------------------

const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const books = require('./routes/books');
const Book = require('./models').Book;
const app = express();

// Pug and static asset setup
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

// Setup json parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect routes
app.use('/', routes);
app.use('/books', books);

// Sync database - async IIFE
(async () => {
  // Sync 'Book' table
  await Book.sequelize.sync();

});

// Error handlers
app.use((req, res, next) => {
  const err = new Error('Error --> Could not find requested page, dawg!');
  err.status = 404;
  if (err.status) {
    res.render('404');
  } else {
    console.error(err.message);
    return next(err);
  }
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  err.message = 'Something went wrong dawg!';
  res.status(err.status || 500);
  res.render('error');
});

// app.use((err, req, res, next) => {
//   if (err instanceof NotFound) {
//     res.render('404');
//   } else {
//     return next(err);
//   }
// });

// Setup local host
app.listen(port, () => {
  console.log(`The app is running on localhost: ${port}, dawg!`);
});

module.exports = app;