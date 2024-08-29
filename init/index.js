const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const data = require("./data.js");


async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/wonderlust",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});}
main().then(()=>{
    console.log("Connection astablished");
}).catch((err)=>{
    console.log(err);
});