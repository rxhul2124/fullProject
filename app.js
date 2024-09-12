const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./util/wrapAsync.js");
const ExpressError = require("./util/ExpressError.js");
const {listingSchema} = require("./schema.js"); 

app.engine("ejs", engine);  
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main()
    .then(()=>
        {
        console.log("connected to db");
    })
    .catch((err)=>
        {
        console.log(err);
    });

let validateListing = (req, res, next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
}

app.listen("8080" , (req,res)=>{
    console.log("Server is starting");
});

app.get("/" , (req, res)=>{
    res.send("Connection successful");
});


//show route
app.get("/listing" , wrapAsync(async (req,res)=>{
    const allListing = await Listing.find();
    res.render("./listing/index.ejs", {allListing});
}));


//new listing route
app.get("/listing/new", (req,res)=>{
    res.render("./listing/new.ejs");
});

app.post('/listing', validateListing, wrapAsync(async (req, res, next) => {
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
app.get("/listing/:id" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/show.ejs", {listing});
}));



//edit route

app.get("/listing/:id/edit" ,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs" , {listing});
}));



app.put("/listing/:id", validateListing, wrapAsync(async (req, res, next) => {
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

app.delete("/listing/:id/delete" ,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listing");
}));

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!!"));
});

app.use((err, req, res, next)=>{
    const statuscode = err.statusCode || 500; 
    const message = err.message || "Something went wrong";
    res.status(statuscode).render("error.ejs" ,{message});
});