const express = require("express");
const router = express.Router({ mergeParams: true }); // MergeParams to access the listing id from parent router
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../util/wrapAsync");
const ExpressError = require("../util/ExpressError");
const { reviewSchema } = require("../schema.js");

// Middleware to validate review input
let validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(", "));
    } else {
        next();
    }
};

// Route to add a review 
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;  
    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${id}`);
}));

// Route to delete a review 
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listing/${id}`);
}));


module.exports = router;