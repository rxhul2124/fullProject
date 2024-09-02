const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const engine = require("ejs-mate");

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

app.listen("8080" , (req,res)=>{
    console.log("Server is starting");
});

app.get("/" , (req, res)=>{
    res.send("Connection successful");
});


//show route
app.get("/listing" , async (req,res)=>{
    const allListing = await Listing.find();
    res.render("./listing/index.ejs", {allListing});
});


//new listing route
app.get("/listing/new", (req,res)=>{
    res.render("./listing/new.ejs");
});

app.post('/listing', async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Error saving listing:', error);
        res.status(500).send('Error saving listing');
    }
});


//show routes
app.get("/listing/:id" , async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/show.ejs", {listing});
});



//edit route

app.get("/listing/:id/edit" ,async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs" , {listing});
});



app.put("/listing/:id" ,async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
});

//delete route

app.delete("/listing/:id/delete" ,async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listing");
});