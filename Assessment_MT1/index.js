
const express = require('express');

const app = express();
app.use(express.json());

// In-memory array
let books = [];
let nextId = 1;

// 1. POST - Add a new book
app.post('/api/books', (req, res) => {
    const { title, author, year } = req.body;

    // Check missing data
    if (!title || !author || year === undefined) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Check year is a number
    if (typeof year !== 'number') {
        return res.status(400).json({
            message: "Year must be a number"
        });
    }

    // Check duplicate title
    const duplicate = books.find(
        book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({
            message: "Book already exists"
        });
    }

    const newBook = {
        id: nextId++,
        title,
        author,
        year
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});


// 2. GET - Get all books (with author filter)
app.get('/api/books', (req, res) => {
    const { author } = req.query;

    let result = books;

    if (author) {
        result = books.filter(
            book => book.author.toLowerCase() === author.toLowerCase()
        );
    }

    res.status(200).json(result);
});


// 3. GET - Get book by ID
app.get('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});


// 4. PUT - Update book by ID
app.put('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, year } = req.body;

    if (!title || !author || year === undefined) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (typeof year !== 'number') {
        return res.status(400).json({
            message: "Year must be a number"
        });
    }

    // Check duplicate title excluding current book
    const duplicate = books.find(
        b => b.title.toLowerCase() === title.toLowerCase()
        && b.id !== id
    );

    if (duplicate) {
        return res.status(409).json({
            message: "Book already exists"
        });
    }

    book.title = title;
    book.author = author;
    book.year = year;

    res.status(200).json({
        message: "Book updated successfully",
        book
    });
});


// 5. DELETE - Delete book by ID
app.delete('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});


// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
