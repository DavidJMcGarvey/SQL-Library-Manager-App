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

// Sync database
(async () => {
    // Sync 'Movies' table
    await Book.sequelize.sync();
});

// router.get('/', asyncHandler(async (req, res) => {
//     const books = await Book.findAll();
//     res.render("index", { books, title: "Dave!" });
// }));

module.exports = router;