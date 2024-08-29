const mongoose = require("mongoose");


const listSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    image : {
        type : String
    },
    price : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    }
});

const Listing = mongoose.model("Listing", listSchema);

module.exports = Listing;