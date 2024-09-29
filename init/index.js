const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");


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
    initData.data = initData.data.map((obj)=>({...obj, owner : '66f500ff8307181406320ad1'}))
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

initDb();