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
  const { title, author, price } = req.body;

  if (!title || !author) {
	//Logging added here
	console.error('Validation failed: missing title or author');
	  
    return res.status(400).json({
      error: 'title and author are required'
    });
  }

  let existingAuthor = authors.find(
    a => a.name.toLowerCase() === author.toLowerCase()
  );

  if (!existingAuthor) {
    existingAuthor = {
      id: authors.length + 1,
      name: author
    };

    authors.push(existingAuthor);

    console.log(`[AUTHOR CREATED] ${new Date().toISOString()} - ${JSON.stringify(existingAuthor)}`);
  }

  const book = {
    id: nextBookId++,
    title,
    authorId: existingAuthor.id,
    author: existingAuthor.name,
    price: price || 0
  };

  books.push(book);
  
// Logging added here 
  console.log(`[BOOK CREATED] ${new Date().toISOString()} - ${JSON.stringify(book)}`);

  res.status(201).json(book);
});

// GET /books/:id → retrieve a book
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) {
    //Logging added here
    console.error(`Book not found: ID ${req.params.id}`);
    
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
    //Logging added here
    console.error(`Update failed - Book not found: ID ${req.params.id}`);
    
    return res.status(404).json({
      error: 'Book not found'
    });
  }

  const { title, author, price } = req.body;

  if (!title || !author) {
    //Logging added here
    console.error(`Validation failed: missing title or author`);
  
    return res.status(400).json({
      error: 'title and author are required'
    });
  }
// Find or create author
    let existingAuthor = authors.find(
    a => a.name.toLowerCase() === author.toLowerCase()
  );

  if (!existingAuthor) {
    existingAuthor = {
      id: authors.length + 1,
      name: author
    };

    authors.push(existingAuthor);

    console.log(`[AUTHOR CREATED] ${new Date().toISOString()} - ${JSON.stringify(existingAuthor)}`);
  }

  // ✅ Update book
  book.title = title;
  book.authorId = existingAuthor.id;
  book.author = existingAuthor.name;
  book.price = price || 0;

  console.log(`[BOOK UPDATED - FULL] ${new Date().toISOString()} - ${JSON.stringify(book)}`);

  res.status(200).json(book);
});

// PATCH /books/:id → partially update book details
app.patch('/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) {
    //Logging added here
    console.error(`Update failed - Book not found: ID ${req.params.id}`);
    
    return res.status(404).json({
      error: 'Book not found'
    });
  }

  const { title, author, price } = req.body;

    if (author !== undefined) {
    let existingAuthor = authors.find(
      a => a.name.toLowerCase() === author.toLowerCase()
    );

    if (!existingAuthor) {
      existingAuthor = {
        id: authors.length + 1,
        name: author
      };

      authors.push(existingAuthor);

      console.log(`[AUTHOR CREATED] ${new Date().toISOString()} - ${JSON.stringify(existingAuthor)}`);
    }

    book.authorId = existingAuthor.id;
    book.author = existingAuthor.name;
  }

  if (title !== undefined) book.title = title;
  if (price !== undefined) book.price = price;

  console.log(`[BOOK UPDATED - PARTIAL] ${new Date().toISOString()} - ${JSON.stringify(book)}`);

  res.status(200).json(book);
});

// DELETE /books/:id → delete a book
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === Number(req.params.id));

  if (bookIndex === -1) {
    //Logging added here
    console.error(`Delete failed: Book not found ID ${req.params.id}`);
    
    return res.status(404).json({
      error: 'Book not found'
    });
  }

  books.splice(bookIndex, 1);

//Logging added here 
  console.log(`Book deleted: ID ${req.params.id}`);

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

//Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);

  res.status(500).json({
    error: 'Internal Server Error'
  });
});

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`Bookstore API listening on port ${port}`);
});


