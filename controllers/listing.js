const Listing = require("../models/listing");

module.exports.allListing = async (req,res)=>{
    const allListing = await Listing.find();
    res.render("./listing/index.ejs", {allListing});
}

module.exports.renderNew =  (req,res)=>{
    res.render("./listing/new.ejs");
}

module.exports.newListing = async (req, res, next) => {
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
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: 'reviews',
        populate: { path: 'author' } 
    })
    .populate("owner");
    res.render("./listing/show.ejs", {listing});
}

module.exports.editRequest = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("owner");
    res.render("./listing/edit.ejs" , {listing});
}

module.exports.editListing = async (req, res, next) => {
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
}

module.exports.distroyListing = async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("warning" , "Listing deleted !!");
    res.redirect("/listing");
}