const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('combined'));

// In-memory data store
let books = [];
let authors = [
  { id: 1, name: 'George Orwell' },
  { id: 2, name: 'Jane Austen' }
];

let nextBookId = 1;

// Health / monitoring endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// GET /books → list books
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// POST /books → add a book
app.post('/books', (req, res) => {
  const { title, authorId, price } = req.body;

  if (!title || !authorId) {
    return res.status(400).json({
      error: 'title and authorId are required'
    });
  }

  const author = authors.find(a => a.id === Number(authorId));

  if (!author) {
    return res.status(400).json({
      error: 'authorId must reference an existing author'
    });
  }

  const book = {
    id: nextBookId++,
    title,
    authorId: Number(authorId),
    price: price || 0
  };

  books.push(book);

  res.status(201).json(book);
});

// GET /books/:id → retrieve a book
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({
      error: 'Book not found'
    });
  }

  res.status(200).json(book);
});

// PUT /books/:id → fully update book details
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({
      error: 'Book not found'
    });
  }

  const { title, authorId, price } = req.body;

  if (!title || !authorId) {
    return res.status(400).json({
      error: 'title and authorId are required'
    });
  }

  const author = authors.find(a => a.id === Number(authorId));

  if (!author) {
    return res.status(400).json({
      error: 'authorId must reference an existing author'
    });
  }

  book.title = title;
  book.authorId = Number(authorId);
  book.price = price || 0;

  res.status(200).json(book);
});

// PATCH /books/:id → partially update book details
app.patch('/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({
      error: 'Book not found'
    });
  }

  const { title, authorId, price } = req.body;

  if (authorId !== undefined) {
    const author = authors.find(a => a.id === Number(authorId));

    if (!author) {
      return res.status(400).json({
        error: 'authorId must reference an existing author'
      });
    }

    book.authorId = Number(authorId);
  }

  if (title !== undefined) book.title = title;
  if (price !== undefined) book.price = price;

  res.status(200).json(book);
});

// DELETE /books/:id → delete a book
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === Number(req.params.id));

  if (bookIndex === -1) {
    return res.status(404).json({
      error: 'Book not found'
    });
  }

  books.splice(bookIndex, 1);

  res.status(204).send();
});

// GET /authors → list authors
app.get('/authors', (req, res) => {
  res.status(200).json(authors);
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`Bookstore API listening on port ${port}`);
});