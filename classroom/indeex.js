const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(cookieParser());

app.use(
    session({
        secret : "1234abcd",
        resave : false,
        saveUninitialized : true
    })
);

app.get("/session", (req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`Session request - ${req.session.count }`);
})

app.get("/cookies",(req,res)=>{
    res.cookie("Greet", "Hello");
    res.send("Cookie send !!");
});

app.get("/" , (req, res)=>{
    console.dir(req.cookies);
    res.send("Connection successful");
});


app.listen("3000" , (req,res)=>{
    console.log("Server is listing to 3000");
});