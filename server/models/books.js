/*
  <books.js>
  COMP308-W2019-Midterm
  Student Number: 300954759
  Student Name: Heeyeong Kim
  Date: 02/24/2019
*/

let mongoose = require('mongoose');

// create a model class
let booksSchema = mongoose.Schema({
    Title: String,
    Description: String,
    Price: Number,
    Author: String,
    Genre: String
},
{
  collection: "books"
});

module.exports = mongoose.model('books', booksSchema);
