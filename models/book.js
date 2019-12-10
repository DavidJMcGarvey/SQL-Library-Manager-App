const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}

    Book.init({
        title: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"Title" is required dawg!'
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"Author" is required dawg!'
                }
            }
        },
        genre: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"Genre" is required dawg!'
                }
            }
        },
        year: {
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: {
                    msg: '"Year" is required dawg!'
                }
            }
        },
    }, { sequelize });

    return Book;
};