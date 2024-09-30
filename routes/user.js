const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../util/wrapAsync");
const ExpressError = require("../util/ExpressError");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");


router
    .route("/signUp")
        .get(userController.signUpForm)
        .post(wrapAsync(userController.signUpUser));


router
    .route("/login")
    .get(userController.loginUserForm)
    .post(
        saveRedirectUrl,
        passport.authenticate(
            "local", {
            failureRedirect : "/login", 
            failureFlash : true}), 
            wrapAsync(userController.loginUser));

//logout route

router.get("/logout", userController.logout);




module.exports = router;