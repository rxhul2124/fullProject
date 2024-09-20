
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); 
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./util/ExpressError.js");

const listing = require("./routes/listing.js");
const review = require("./routes/review.js");

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


// Listening route
app.listen("8080" , (req,res)=>{
    console.log("Server is starting");
});

// Root route
app.get("/" , (req, res)=>{
    res.send("Connection successful");
});

// Router for listing routes
app.use("/listing", listing);

// Router for review routes (nested under listings)
app.use("/listing/:id/review", review);

// Default error middleware
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!!"));
});

// Error handler middleware
app.use((err, req, res, next)=>{
    const statuscode = err.statusCode || 500; 
    const message = err.message || "Something went wrong";
    res.status(statuscode).render("error.ejs" ,{message});
});
