// if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
// }

const mongoDB = "mongodb://127.0.0.1:27017/homigo";
const dbonline = process.env.ATLAS_URL;

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const port = 8000;

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const store = MongoStore.create({
    mongoUrl:dbonline,
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600
});

store.on("error", (err)=>{
    console.log("Error in Mongo Session Store", err);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/users", userRouter);

main().then(()=>{
    console.log("connected was established");
})
.catch((err)=>{
    console.log("Error occured");
})

async function main(){
    await mongoose.connect(dbonline);
}

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next)=>{
    let {statusCode = 500, message= "Error occured MiddleWare"} = err;
    res.status(statusCode).render("error.ejs", {message});
})

app.listen(port, ()=>{
    console.log(`Listening to port : ${port}`);
});
