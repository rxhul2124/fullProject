const mongoose = require('mongoose');
const review = require('./review');
const { Schema } = mongoose;
const Review = require("./review/js")

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type : Schema.Types.ObjectId,
      ref : "Review"
    }
  ]
});


const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({reviews: {$in : listing.reviews}});
  }
});