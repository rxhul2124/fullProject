const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../util/wrapAsync");
const ExpressError = require("../util/ExpressError");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

//sign up route
router.get("/signUp", (req,res)=>{
    res.render("./user/signUp.ejs");
});

router.post("/signUp", wrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to Wonderlust!");
        res.redirect("/listing");
    });
}));


//login routes
router.get("/login", (req,res)=>{
    res.render("./user/login.ejs")
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate(
        "local", {
        failureRedirect : "/login", 
        failureFlash : true}), 
        wrapAsync(async(req,res)=>{
        req.flash("success" , "Welcome back to Wonderlust");
        const redirectUrl = res.locals.redirectUrl || "/listing";
        res.redirect(redirectUrl);
    }
));

//logout route

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); 
        }
        req.flash("warning", "You have been logged out!!");
        res.redirect("/listing");
    });
});




module.exports = router;