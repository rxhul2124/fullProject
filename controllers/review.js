const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../util/ExpressError");

module.exports.addReview = async (req, res) => {
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

    req.flash("success" , "review added !!");
    res.redirect(`/listing/${id}`);
}

module.exports.distroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("warning" , "Review deleted !!");
    res.redirect(`/listing/${id}`);
}