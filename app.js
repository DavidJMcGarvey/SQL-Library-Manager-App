'use strict'

// ------------------------------------------
//  Express App Setup
// ------------------------------------------

const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

// Pug and Static setup
app.use('/static', express.static('public/stylesheets'));
app.set('views engine', 'pug');


app.get('/', (req, res, next) => {
    res.render('layout');
})

// Setup local host
app.listen(port, () => {
    console.log(`The app is running on localhost: ${port}, dawg!`);
});