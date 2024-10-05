const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
        .get(wrapAsync(listingController.allListing))
        .post(isLoggedIn,upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.newListing));

router.get("/new", isLoggedIn, listingController.renderNew);

router
    .route("/:id")
        .get(wrapAsync(listingController.showListing))
        .put(isOwner,upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.editListing));



router.get("/:id/edit" , isLoggedIn,isOwner,wrapAsync(listingController.editRequest));


router.delete("/:id/delete" , isOwner,isLoggedIn,wrapAsync(listingController.distroyListing));





module.exports = router;
