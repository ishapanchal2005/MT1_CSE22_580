
const express = require('express');
const router = express.Router();

let books = [];
let nextId = 1;


// 1. POST 
router.post('/', (req, res) => {
    const { title, author, year } = req.body;

    if (!title || !author || year === undefined) {
        return res.status(400).json({
            message: "Missing data"
        });
    }

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

// 2. GET 
router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// 4. PUT 
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, year } = req.body;

    if (!title || !author || year === undefined) {
        return res.status(400).json({
            message: "Missing data"
        });
    }

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


// 5. DELETE 
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

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


// Export router
module.exports = router;
