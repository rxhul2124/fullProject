const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");


async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}
main().then(()=>{
    console.log("Connection astablished");
}).catch((err)=>{
    console.log(err);
});

const initDb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was initialised");
}

initDb();