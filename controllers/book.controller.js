const Book = require("../models/book.model");

exports.readBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({error}));
};

exports.readBookById = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({error}));
};

exports.readBooksBestRating = (req, res, next) => {
    Book.find()
        .sort({averageRating: "descending"})
        .then(books => res.status(200).json(books.slice(0, 3)))
        .catch(error => res.status(500).json({error}))
};

exports.createBook = (req, res, next) => {
    delete req.body.userId
    delete req.body.ratings
    delete req.body.averageRating
    const book = new Book({
        userId: req.auth.userId,
        ...req.body,
        ratings: [],
        averageRating: 0
    });
    console.log(book);
    book.save()
        .then(() => res.status(201).json({message: "201 CREATED: Book created"}))
        .catch(error => res.status(500).json({error}))
};

exports.updateBook = (req, res, next) => {

};

exports.deleteBook = (req, res, next) => {
    Book.deleteOne({_id: req.params.id})
        .then(book => {
            if (book.userId !== req.auth.userId)
                return res.status(401).json({message: "401 Unauthorized: You just can delete your own books"})
            res.status(200).json({message: "200 OK: Book deleted"})
        })
        .catch(error => res.status(404).json({error}))
};

exports.createRating = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => {
            const userId = req.auth.userId;
            const rating = req.body.rating;

            if (rating < 0 || rating > 5)
                return res.status(400).json({message: "400 Bad request: Rating must be a Number between 0 and 5"})

            book.ratings.forEach(rate => {
                if (rate.userId === userId) {
                    res.status(409).json({message: "409 Conflict: Ressource already exists"});
                    return;
                }
            });

            book.ratings.push({userId: userId, grade: rating});

            let averageRating = 0;

            book.ratings.forEach(rate => {
                averageRating += rate.grade;
            })

            book.averageRating = averageRating / book.ratings.length;

            book.save()
                .then(book => res.status(201).json({book}))
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(404).json({error}))
};