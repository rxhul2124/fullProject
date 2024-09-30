const User = require("../models/user");


module.exports.signUpForm = (req,res)=>{
    res.render("./user/signUp.ejs");
}

module.exports.signUpUser = async (req, res, next) => {
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
}


module.exports.loginUserForm = (req,res)=>{
    res.render("./user/login.ejs")
}

module.exports.loginUser = async(req,res)=>{
    req.flash("success" , "Welcome back to Wonderlust");
    const redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); 
        }
        req.flash("warning", "You have been logged out!!");
        res.redirect("/listing");
    });
}