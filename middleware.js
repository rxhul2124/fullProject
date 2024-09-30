const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./util/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("owner")
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You dont have the permission !!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {reviewId, id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have the permission !!");
        return res.redirect(`/listing/${id}`);
    }
    next();
    
}

module.exports.validateListing = (req, res, next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(", "));
    } else {
        next();
    }
};

