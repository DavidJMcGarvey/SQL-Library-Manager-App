'use strict';

// ------------------------------------------
//  Express App Setup
// ------------------------------------------

const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const routes = require('./routes/index');
const books = require('./routes/books');
const Book = require('./models').Book;
const app = express();

// Pug and static asset setup
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

// Connect routes
app.use('/', routes);
app.use('/books', books);

// Sync database
(async () => {
  // Sync 'Book' table
  await Book.sequelize.sync({force: true});

  try {
    const book111 = await Book.create({
      title: 'Mindset',
      author: 'Carolyn Dweck',
      genre: 'Sociology',
      year: 2011,
    });
    console.log(book111.toJSON());
  } catch (error) {
      throw error;
  }
});

// Error handlers
app.use((req, res, next) => {
  const err = new Error('Error --> Could not find requested page, dawg!');
  err.status = 404;
  console.error(err.message);
  return next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  err.message = 'Something went wrong dawg!';
  res.status(err.status || 500);
  res.render('error');
});

// Setup local host
app.listen(port, () => {
  console.log(`The app is running on localhost: ${port}, dawg!`);
});

module.exports = app;