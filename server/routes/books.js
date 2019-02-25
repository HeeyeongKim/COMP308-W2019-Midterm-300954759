/*
  <books.js>
  COMP308-W2019-Midterm
  Student Number: 300954759
  Stduent Name: Heeyeong Kim
  Date: 02/24/2019
*/

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

// function for authorization
function requireAuth(req, res, next) {
  //check if the user is logged in
  if (!req.isAuthenticated()) {
      return res.redirect('./login');
  }
  next();
}

/* GET books List page. READ */
router.get('/', requireAuth, (req, res, next) => {
  // find all books in the books collection
  book.find((err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books,
        displayName: req.user ? req.user.displayName : ''
      });
    }
  });
});

// GET the Book Details page in order to add a new Book
router.get('/add', requireAuth, (req, res, next) => {
  res.render('books/details', {
    title: 'Add New Book',
    books: '',
    displayName: req.user ? req.user.displayName : ''
  });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', requireAuth, (req, res, next) => {
  // create new book object with data from text fields
  let newBook = book({
    "Title": req.body.title,
    "Description": req.body.description,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre
  });

  // add book object to db using book model
  book.create(newBook, (err, book) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      // refresh the book list
      res.redirect('/books');
    }
  });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', requireAuth, (req, res, next) => {
  let id = req.params.id;

  // find selected book by bookId
  book.findById(id, (err, bookObject) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.render('books/details', {
        title: 'Update a Book',
        books: bookObject,
        displayName: req.user ? req.user.displayName : ''
      });
    }
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {
  let id = req.params.id;

  // create new book object with updated data
  let updatedBook = book({
    "_id": id,
    "Title": req.body.title,
    "Description": req.body.description,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre
  });

  // update db using book model
  book.update({ _id: id }, updatedBook, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/books');
    }
  });
});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
  let id = req.params.id;

  // remove book object from db using book model
  book.remove({ _id: id }, (err) => {
      if (err) {
          console.log(err);
          res.end(err);
      } else {
          res.redirect('/books');
      }
  });
});

module.exports = router;
