'use strict'

// ------------------------------------------
//  Express App Setup
// ------------------------------------------

const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');


const app = express();

// Pug and Static setup
app.use('/static', express.static('public/stylesheets'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req, res, next) => {
    res.render('index');
})

// Setup local host
app.listen(port, () => {
    console.log(`The app is running on localhost: ${port}, dawg!`);
});