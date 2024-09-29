const express = require("express");
const router = express.Router({ mergeParams: true }); 
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../util/wrapAsync");
const ExpressError = require("../util/ExpressError");
const {isLoggedIn, validateReview, isOwner} = require("../middleware.js");



// Route to add a review 
router.post("/", validateReview, isLoggedIn ,  wrapAsync(async (req, res) => {
    const { id } = req.params;  
    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(listing);

    req.flash("success" , "review added !!");
    res.redirect(`/listing/${id}`);
}));

// Route to delete a review 
router.delete("/:reviewId", isLoggedIn, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("warning" , "Review deleted !!");
    res.redirect(`/listing/${id}`);
}));


module.exports = router;