const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");



router
    .route("/")
        .get(wrapAsync(listingController.allListing))
        .post(validateListing, wrapAsync(listingController.newListing));

router.get("/new", isLoggedIn, listingController.renderNew);

router
    .route("/:id")
        .get(wrapAsync(listingController.showListing))
        .put(validateListing,isOwner, wrapAsync(listingController.editListing));



router.get("/:id/edit" , isLoggedIn,isOwner,wrapAsync(listingController.editRequest));


router.delete("/:id/delete" , isOwner,isLoggedIn,wrapAsync(listingController.distroyListing));





module.exports = router;
