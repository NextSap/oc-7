const express = require("express");
const auth = require("../middleware/auth")
const router = express.Router();
const multer = require("../middleware/multer-config");

const bookController = require("../controllers/book.controller");

router.get("/", bookController.readBooks);
router.get("/bestrating", bookController.readBooksBestRating);
router.get("/:id", bookController.readBookById);
router.post("/", auth, bookController.createBook);
router.put("/:id", auth, bookController.updateBook);
router.delete("/:id", auth, bookController.deleteBook);
router.post("/:id/rating", auth, bookController.createRating);

module.exports = router;
