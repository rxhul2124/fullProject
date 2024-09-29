const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");


//show route
router.get("/" , wrapAsync(async (req,res)=>{
    const allListing = await Listing.find();
    res.render("./listing/index.ejs", {allListing});
}));


//new listing route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("./listing/new.ejs");
});

router.post('/', validateListing, wrapAsync(async (req, res, next) => {
    const { title, description, image, price, location, country } = req.body.listing;


    const newListing = new Listing({
        title,
        description,
        image: {
            filename: "listingImage",
            url: image.url,
        },
        price,
        location,
        country
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , "New listing added !!");
    res.redirect('/listing');
}));


//show routes
router.get("/:id" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: 'reviews',
        populate: { path: 'author' } 
    })
    .populate("owner");
    res.render("./listing/show.ejs", {listing});
}));


//edit route

router.get("/:id/edit" , isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("owner");
    res.render("./listing/edit.ejs" , {listing});
}));



router.put("/:id", validateListing,isOwner, wrapAsync(async (req, res, next) => {
        const {id} = req.params;
        const { title, description, image, price, location, country } = req.body.listing;

        const updatedListing = await Listing.findByIdAndUpdate(id, {
            title,
            description,
            image: {
                filename: "listingImage", 
                url: image.url,
            },
            price,
            location,
            country
        });
        
        req.flash("success" , "Listing updated !!");
        res.redirect(`/listing/${id}`); 
}));


//delete route

router.delete("/:id/delete" , isOwner,isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("warning" , "Listing deleted !!");
    res.redirect("/listing");
}));





module.exports = router;
