const express = require("express");
const router = express.Router({ mergeParams: true }); 
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../util/wrapAsync");
const ExpressError = require("../util/ExpressError");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



// Route to add a review 
router.post("/", validateReview, isLoggedIn ,  wrapAsync(reviewController.addReview));

// Route to delete a review 
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.distroyReview));


module.exports = router;