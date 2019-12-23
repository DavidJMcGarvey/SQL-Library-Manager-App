'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'library.db'
});

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}

    Book.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true, 
            autoIncrement: true,
            unique: true 
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: '"Title" is required dawg!'
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: '"Author" is required dawg!'
                }
            }
        },
        genre: {
            type: Sequelize.STRING,
        },
        year: {
            type: Sequelize.INTEGER,
        }
    }, { sequelize });

    return Book;
};

// Test connection to database
(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection to the database successful!');
    } catch (error) {
      console.error('Error connecting to the database: ', error);
    }
  })();