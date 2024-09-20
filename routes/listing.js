const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const {listingSchema} = require("../schema.js");


let validateListing = (req, res, next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
}



//show route
router.get("/" , wrapAsync(async (req,res)=>{
    const allListing = await Listing.find();
    res.render("./listing/index.ejs", {allListing});
}));


//new listing route
router.get("/new", (req,res)=>{
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

    await newListing.save();
    res.redirect('/listing');
}));


//show routes
router.get("/:id" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listing/show.ejs", {listing});
}));



//edit route

router.get("/:id/edit" ,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs" , {listing});
}));



router.put("/:id", validateListing, wrapAsync(async (req, res, next) => {
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
        res.redirect(`/listing/${id}`); 
}));


//delete route

router.delete("/:id/delete" ,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listing");
}));





module.exports = router;
