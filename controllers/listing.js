const Listing = require("../models/listing");

module.exports.allListing = async (req,res)=>{
    const allListing = await Listing.find();
    res.render("./listing/index.ejs", {allListing});
}

module.exports.renderNew =  (req,res)=>{
    res.render("./listing/new.ejs");
}

module.exports.newListing = async (req, res, next) => {
    const { title, description, price, location, country } = req.body.listing;
    let path = req.file.path;
    let filename = req.file.filename;

    try {
        
        const fetch = (await import('node-fetch')).default;

        
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.length > 0) {
            
            const lat = data[0].lat;
            const lon = data[0].lon;
            console.log(lat, lon);

            
            const newListing = new Listing({
                title,
                description,
                image: {
                    filename: filename,
                    url: path,
                },
                price,
                location: {
                    name: location,  
                    lat: lat,        
                    lon: lon        
                },
                country
            });

            newListing.owner = req.user._id; 
            await newListing.save();
            console.log(newListing); 

            req.flash("success", "New listing added with geocoded location!");
            res.redirect('/listing');
        } else {
            req.flash('error', 'Geocoding failed. Location not found.');
            res.redirect('/listing/new');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        req.flash('error', 'Failed to geocode the location.');
        res.redirect('/listing/new');
    }
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
        price,
        location,
        country
    });

    if(typeof req.file !== "undefined"){
        let path = req.file.path;
        let filename = req.file.filename;
        updatedListing.image.filename = filename;
        updatedListing.image.url = path;
        await updatedListing.save();
    } 
    
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